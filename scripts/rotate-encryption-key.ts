/**
 * rotate-encryption-key.ts
 *
 * Safe, zero-downtime key rotation for stellar_secret values.
 *
 * Usage:
 *   1. Set the NEW key in your environment:
 *      STELLAR_SECRET_ENCRYPTION_KEY=v2:new64hexchars
 *      STELLAR_SECRET_ENCRYPTION_KEY_v1=old64hexchars
 *
 *   2. Dry run (check what would be re-encrypted):
 *      npx tsx scripts/rotate-encryption-key.ts --dry-run
 *
 *   3. Rotate (re-encrypts all rows under the old version):
 *      npx tsx scripts/rotate-encryption-key.ts
 *
 *   4. After verifying, remove STELLAR_SECRET_ENCRYPTION_KEY_v1 from env.
 *
 * SAFETY GUARANTEES:
 *   - Idempotent: skips rows already on the current version.
 *   - Batches in groups of 50 to avoid DB timeouts.
 *   - Verifies decrypt-then-re-encrypt round-trip before writing.
 *   - Never writes if the new encrypt/decrypt round-trip fails.
 *   - Rolls back nothing — if a row fails, it is skipped and reported.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { encryptSecret, decryptSecret, needsReencryption, getEncryptedKeyVersion } from '../src/lib/crypto';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const isDryRun = process.argv.includes('--dry-run');
const BATCH_SIZE = 50;

async function main() {
  console.log(`\n🔑 Z-Pay Key Rotation Script`);
  console.log(`   Mode: ${isDryRun ? 'DRY RUN (no writes)' : 'LIVE (will write to DB)'}`);
  console.log(`   Time: ${new Date().toISOString()}\n`);

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  let currentKey: any;
  try {
    // This will throw if STELLAR_SECRET_ENCRYPTION_KEY is missing or malformed
    // Import and call getCurrentKey to validate
    currentKey = encryptSecret('test_validation');
    console.log('✅ Current key loaded successfully\n');
  } catch (err: any) {
    console.error('❌ Key validation failed:', err.message);
    process.exit(1);
  }

  let page = 0;
  let totalRows = 0;
  let skipped = 0;
  let rotated = 0;
  let failed = 0;
  let plaintext = 0;

  while (true) {
    const { data: rows, error } = await supabase
      .from('profiles')
      .select('id, universal_id, stellar_secret')
      .not('stellar_secret', 'is', null)
      .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1);

    if (error) {
      console.error('❌ DB error:', error.message);
      break;
    }

    if (!rows || rows.length === 0) break;

    totalRows += rows.length;
    console.log(`Processing batch ${page + 1} (${rows.length} rows)…`);

    for (const row of rows) {
      const secret = row.stellar_secret;
      const uid    = row.universal_id ?? row.id;

      if (!secret) { skipped++; continue; }

      // Check if plaintext
      if (!secret.startsWith('iv:') && !/^v\d+:iv:/.test(secret)) {
        console.warn(`  ⚠  [${uid}] plaintext secret — encrypt first with migrate-encrypt-secrets.ts`);
        plaintext++;
        continue;
      }

      // Skip if already on current key version
      if (!needsReencryption(secret)) {
        skipped++;
        continue;
      }

      const oldVersion = getEncryptedKeyVersion(secret);

      try {
        // Decrypt with old key
        const plainKey = decryptSecret(secret);

        // Verify it looks like a Stellar secret
        if (!plainKey.startsWith('S') || plainKey.length < 50) {
          console.error(`  ❌ [${uid}] Decrypted value doesn't look like a Stellar secret!`);
          failed++;
          continue;
        }

        // Re-encrypt with new key
        const newEncrypted = encryptSecret(plainKey);

        // Verify round-trip
        const verify = decryptSecret(newEncrypted);
        if (verify !== plainKey) {
          console.error(`  ❌ [${uid}] Round-trip verification failed!`);
          failed++;
          continue;
        }

        console.log(`  🔄 [${uid}] ${oldVersion} → new version`);

        if (!isDryRun) {
          const { error: updateErr } = await supabase
            .from('profiles')
            .update({ stellar_secret: newEncrypted })
            .eq('id', row.id);

          if (updateErr) {
            console.error(`  ❌ [${uid}] DB update failed:`, updateErr.message);
            failed++;
            continue;
          }
        }

        rotated++;
      } catch (err: any) {
        console.error(`  ❌ [${uid}] Rotation failed:`, err.message);
        failed++;
      }
    }

    if (rows.length < BATCH_SIZE) break;
    page++;
  }

  console.log('\n' + '─'.repeat(50));
  console.log('📊 Rotation Summary');
  console.log('─'.repeat(50));
  console.log(`  Total rows examined : ${totalRows}`);
  console.log(`  Already current     : ${skipped}`);
  console.log(`  Rotated             : ${rotated}`);
  console.log(`  Plaintext (skip)    : ${plaintext}`);
  console.log(`  Failed              : ${failed}`);
  console.log(`  Mode                : ${isDryRun ? 'DRY RUN — no changes written' : 'LIVE'}`);
  console.log('─'.repeat(50));

  if (failed > 0) {
    console.error(`\n⚠️  ${failed} row(s) failed rotation. Investigate before removing old key from env.`);
    process.exit(1);
  }

  if (isDryRun) {
    console.log(`\n✅ Dry run complete. Run without --dry-run to apply.`);
  } else {
    console.log(`\n✅ Rotation complete. You can now remove STELLAR_SECRET_ENCRYPTION_KEY_v${getOldVersion()} from env.`);
  }
}

function getOldVersion(): string {
  // Try to infer old version from env
  const keys = Object.keys(process.env).filter(k => k.startsWith('STELLAR_SECRET_ENCRYPTION_KEY_v'));
  return keys.length > 0 ? keys[0].replace('STELLAR_SECRET_ENCRYPTION_KEY_', '') : '?';
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
