/**
 * crypto.ts – AES-256-GCM symmetric encryption for Stellar secret keys at rest.
 *
 * KEY FORMAT (env var STELLAR_SECRET_ENCRYPTION_KEY):
 *   Single key  : 64 hex chars  →  treated as version "v1"
 *   Versioned   : "v2:64hexchars"  →  use v2 as current
 *   Multi-version (for rotation):
 *     STELLAR_SECRET_ENCRYPTION_KEY=v2:64hexchars
 *     STELLAR_SECRET_ENCRYPTION_KEY_v1=64hexchars  ← kept for decryption of old rows
 *
 * STORED FORMAT: "vN:iv:<hex>:tag:<hex>:ct:<hex>"
 *   vN  = key version tag  (e.g. "v1", "v2")
 *   iv  = 12-byte random nonce (new per encryption)
 *   tag = 16-byte GCM auth tag  (tamper-proof)
 *   ct  = ciphertext
 *
 * LEGACY FORMAT (pre-versioning): "iv:<hex>:tag:<hex>:ct:<hex>"
 *   Treated as version "v1" automatically.
 *
 * ROTATION RUNBOOK: see docs/key-lifecycle.md
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGO = 'aes-256-gcm' as const;

// ── Key loading ───────────────────────────────────────────────────────────────

interface KeyEnvelope {
  version: string;   // e.g. "v1"
  keyBuffer: Buffer; // 32 bytes
}

/**
 * Parses a key string — either bare hex ("v1") or prefixed ("v2:hexchars").
 */
function parseKeyString(raw: string, fallbackVersion = 'v1'): KeyEnvelope {
  const colonIdx = raw.indexOf(':');
  if (colonIdx > 0 && colonIdx <= 4 && raw[0] === 'v') {
    const version = raw.slice(0, colonIdx);
    const hex = raw.slice(colonIdx + 1);
    if (hex.length !== 64) {
      throw new Error(`[crypto] Key ${version} must be 64 hex characters after the version prefix.`);
    }
    return { version, keyBuffer: Buffer.from(hex, 'hex') };
  }
  // Bare 64-char hex
  if (raw.length !== 64) {
    throw new Error(`[crypto] STELLAR_SECRET_ENCRYPTION_KEY must be 64 hex characters (or "vN:64hexchars"). Got length ${raw.length}.`);
  }
  return { version: fallbackVersion, keyBuffer: Buffer.from(raw, 'hex') };
}

/**
 * Returns the *current* key (used for all new encryptions).
 */
function getCurrentKey(): KeyEnvelope {
  const raw = process.env.STELLAR_SECRET_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      '[crypto] STELLAR_SECRET_ENCRYPTION_KEY is not set. ' +
      'Generate one: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return parseKeyString(raw);
}

/**
 * Returns a key buffer for the given version. Checks:
 *   1. STELLAR_SECRET_ENCRYPTION_KEY  (if its version matches)
 *   2. STELLAR_SECRET_ENCRYPTION_KEY_v1, _v2, etc.
 */
function getKeyForVersion(version: string): Buffer {
  const current = process.env.STELLAR_SECRET_ENCRYPTION_KEY;
  if (current) {
    try {
      const parsed = parseKeyString(current);
      if (parsed.version === version) return parsed.keyBuffer;
    } catch { /* ignore */ }
  }

  // Check versioned env var (e.g. STELLAR_SECRET_ENCRYPTION_KEY_v1)
  const versionedEnvName = `STELLAR_SECRET_ENCRYPTION_KEY_${version}`;
  const versionedRaw = process.env[versionedEnvName];
  if (versionedRaw) {
    const parsed = parseKeyString(versionedRaw, version);
    return parsed.keyBuffer;
  }

  throw new Error(
    `[crypto] Cannot decrypt: key version "${version}" not found. ` +
    `Ensure ${versionedEnvName} or a matching STELLAR_SECRET_ENCRYPTION_KEY is set. ` +
    `See docs/key-lifecycle.md for the rotation runbook.`
  );
}

// ── Encryption / Decryption ───────────────────────────────────────────────────

/**
 * Encrypts a plaintext string (e.g. a Stellar secret key) using the current key.
 * Always uses the most recent key version — outputs "vN:iv:…:tag:…:ct:…".
 */
export function encryptSecret(plaintext: string): string {
  const { version, keyBuffer } = getCurrentKey();
  const iv = randomBytes(12); // 96-bit nonce recommended for AES-GCM
  const cipher = createCipheriv(ALGO, keyBuffer, iv);

  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${version}:iv:${iv.toString('hex')}:tag:${tag.toString('hex')}:ct:${ct.toString('hex')}`;
}

/**
 * Decrypts a value previously produced by encryptSecret().
 * Handles both versioned ("vN:iv:…") and legacy ("iv:…") formats.
 *
 * Throws a structured error if:
 *   - The value is not encrypted (use isEncrypted() to guard)
 *   - The required key version is not in the environment
 *   - The ciphertext has been tampered with (GCM auth failure)
 */
export function decryptSecret(encrypted: string): string {
  if (!isEncrypted(encrypted)) {
    throw new Error(
      '[crypto] decryptSecret called on a plaintext value. ' +
      'Run the migration script: npx tsx scripts/migrate-encrypt-secrets.ts'
    );
  }

  let version: string;
  let remainder: string;

  // Versioned format: "vN:iv:…"
  if (/^v\d+:iv:/.test(encrypted)) {
    const firstColon = encrypted.indexOf(':');
    version = encrypted.slice(0, firstColon);
    remainder = encrypted.slice(firstColon + 1); // "iv:…:tag:…:ct:…"
  } else {
    // Legacy format: "iv:…" — treat as v1
    version = 'v1';
    remainder = encrypted; // already starts with "iv:"
  }

  // Parse remainder: "iv:<ivHex>:tag:<tagHex>:ct:<ctHex>"
  const withoutIvPrefix = remainder.slice('iv:'.length);
  const tagSplit = withoutIvPrefix.split(':tag:');
  if (tagSplit.length !== 2) throw new Error('[crypto] Malformed encrypted value (missing :tag: separator)');

  const ivHex = tagSplit[0];
  const ctSplit = tagSplit[1].split(':ct:');
  if (ctSplit.length !== 2) throw new Error('[crypto] Malformed encrypted value (missing :ct: separator)');

  const tagHex = ctSplit[0];
  const ctHex = ctSplit[1];

  const keyBuffer = getKeyForVersion(version);
  const decipher = createDecipheriv(ALGO, keyBuffer, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ctHex, 'hex')),
    decipher.final(),
  ]);

  return plaintext.toString('utf8');
}

export function safeDecryptSecret(encrypted: string | null | undefined): string | null {
  if (!encrypted) return null;
  try {
    return decryptSecret(encrypted);
  } catch (err: any) {
    // Graceful fallback for older testnet accounts that haven't run the migration script yet
    if (err.message.includes('plaintext value') && encrypted.startsWith('S') && encrypted.length === 56) {
      console.warn('[crypto] WARNING: Using unencrypted legacy secret. Please run migrate-encrypt-secrets.ts.');
      return encrypted;
    }

    // Log server-side but never surface key details externally
    console.error('[crypto] safeDecryptSecret failed:', err.message);
    return null;
  }
}

/**
 * Returns true if the value looks like it was encrypted by encryptSecret().
 * Handles both versioned ("vN:iv:…") and legacy ("iv:…") formats.
 */
export function isEncrypted(value: string): boolean {
  return value.startsWith('iv:') || /^v\d+:iv:/.test(value);
}

/**
 * Returns true if the encrypted value uses an older key version than the current one.
 * Use this to identify rows that need re-encryption during rotation.
 */
export function needsReencryption(encrypted: string): boolean {
  if (!isEncrypted(encrypted)) return false;
  const currentVersion = getCurrentKey().version;
  if (encrypted.startsWith('iv:')) return currentVersion !== 'v1'; // legacy = v1
  const version = encrypted.slice(0, encrypted.indexOf(':'));
  return version !== currentVersion;
}

/**
 * Extracts the key version from an encrypted string.
 */
export function getEncryptedKeyVersion(encrypted: string): string {
  if (encrypted.startsWith('iv:')) return 'v1'; // legacy
  return encrypted.slice(0, encrypted.indexOf(':'));
}
