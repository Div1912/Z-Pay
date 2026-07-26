/**
 * ZUB — Attestation & Intent Service
 *
 * Creates and verifies signed spend authorizations.
 * Phase 0: HMAC-SHA256 single-key signing.
 * Phase 1 upgrade path: swap signing impl for FROST threshold signing
 *   without touching the API or vault contracts — just replace
 *   signPayload() and verifyPayload() below.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { getUnifiedBalance } from './ledger';
import type {
  SpendIntentRequest,
  SpendIntentResult,
  ReleaseAuthorization,
  ZubChain,
} from './types';

// Phase 0: single signing key from env.
// Phase 1: replace with threshold signing key management.
const SIGNING_SECRET = process.env.ZUB_SIGNING_SECRET || 'zub-dev-secret-replace-in-prod';
const INTENT_TTL_SECONDS = 30; // authorizations expire in 30 seconds

// ── Intent Creation ───────────────────────────────────────────────────────────

/**
 * Creates a spend intent:
 * 1. Validates user has sufficient unified balance
 * 2. Inserts a pending spend intent record
 * 3. Signs a release authorization
 * 4. Returns the signed authorization to the caller
 *
 * The caller then submits this to the vault (on-chain or via hot wallet)
 * to actually release the funds.
 */
export async function createSpendIntent(
  req: SpendIntentRequest
): Promise<SpendIntentResult> {
  const { userId, universalId, amount_usdc, destination_chain, recipient, memo } = req;

  // 1. Validate amount
  if (amount_usdc <= 0) {
    return { intent_id: '', status: 'failed', error: 'Amount must be positive' };
  }

  // 2. Check unified balance
  const balance = await getUnifiedBalance(userId);
  if (balance.total_usdc < amount_usdc) {
    return {
      intent_id: '',
      status: 'failed',
      error: `Insufficient balance. Unified balance: ${balance.total_usdc} USDC. Requested: ${amount_usdc} USDC.`,
    };
  }

  // 3. Create the intent record
  const expiresAt = new Date(Date.now() + INTENT_TTL_SECONDS * 1000).toISOString();

  const { data: intentData, error: insertError } = await supabaseAdmin
    .from('zub_spend_intents')
    .insert({
      user_id: userId,
      universal_id: universalId,
      amount_usdc,
      destination_chain,
      recipient,
      memo: memo ?? null,
      status: 'pending',
      expires_at: expiresAt,
    })
    .select('intent_id')
    .single();

  if (insertError || !intentData) {
    console.error('[zub/attestation] Failed to create intent:', insertError?.message);
    return { intent_id: '', status: 'failed', error: 'Failed to create spend intent' };
  }

  const intentId = intentData.intent_id;

  // 4. Build and sign the release authorization
  const issuedAt = new Date().toISOString();
  const authPayload = {
    intent_id: intentId,
    user_id: userId,
    amount_usdc,
    destination_chain,
    recipient,
    expires_at: expiresAt,
    issued_at: issuedAt,
  };

  const signature = signPayload(authPayload);

  const releaseAuth: ReleaseAuthorization = {
    ...authPayload,
    signature,
  };

  // 5. Store the signed auth on the intent record
  await supabaseAdmin
    .from('zub_spend_intents')
    .update({ release_authorization: releaseAuth })
    .eq('intent_id', intentId);

  console.log(`[zub/attestation] Created spend intent ${intentId} for ${amount_usdc} USDC on ${destination_chain}`);

  return {
    intent_id: intentId,
    status: 'pending',
    release_authorization: releaseAuth,
  };
}

// ── Intent Verification ───────────────────────────────────────────────────────

/**
 * Verifies a release authorization signature and checks it hasn't expired.
 * Returns true only if the signature is valid AND the intent is still within TTL.
 *
 * This is what the vault (hot wallet handler) calls before releasing funds.
 */
export async function verifyReleaseAuthorization(
  auth: ReleaseAuthorization
): Promise<{ valid: boolean; reason?: string }> {
  // 1. Check expiry
  if (new Date(auth.expires_at) < new Date()) {
    return { valid: false, reason: 'Authorization has expired' };
  }

  // 2. Verify signature
  const { signature, ...payload } = auth;
  const expectedSig = signPayload(payload);

  if (!timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'))) {
    return { valid: false, reason: 'Invalid signature' };
  }

  // 3. Check intent is still pending in DB (prevents replay attacks)
  const { data: intent } = await supabaseAdmin
    .from('zub_spend_intents')
    .select('status')
    .eq('intent_id', auth.intent_id)
    .single();

  if (!intent) {
    return { valid: false, reason: 'Intent not found' };
  }

  if (intent.status !== 'pending') {
    return { valid: false, reason: `Intent already ${intent.status} — replay attack prevention` };
  }

  return { valid: true };
}

// ── Intent Status Management ──────────────────────────────────────────────────

/**
 * Marks an intent as released after the vault has confirmed the payment.
 */
export async function markIntentReleased(intentId: string, txHash: string): Promise<void> {
  await supabaseAdmin
    .from('zub_spend_intents')
    .update({ status: 'released', tx_hash: txHash })
    .eq('intent_id', intentId);
}

/**
 * Marks an intent as failed.
 */
export async function markIntentFailed(intentId: string, reason: string): Promise<void> {
  await supabaseAdmin
    .from('zub_spend_intents')
    .update({ status: 'failed', error_message: reason })
    .eq('intent_id', intentId);
}

/**
 * Expires all pending intents older than TTL.
 * Call periodically from the reconciliation cron.
 */
export async function expireStaleIntents(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('zub_spend_intents')
    .update({ status: 'expired' })
    .eq('status', 'pending')
    .lt('expires_at', new Date().toISOString())
    .select('intent_id');

  return data?.length ?? 0;
}

/**
 * Fetches the current status of a spend intent.
 */
export async function getIntentStatus(
  intentId: string,
  userId: string
): Promise<{ status: string; tx_hash: string | null; error_message: string | null } | null> {
  const { data } = await supabaseAdmin
    .from('zub_spend_intents')
    .select('status, tx_hash, error_message')
    .eq('intent_id', intentId)
    .eq('user_id', userId)
    .single();

  return data;
}

// ── Signing (Phase 0: HMAC, Phase 1: swap for FROST) ─────────────────────────

function signPayload(payload: Record<string, unknown>): string {
  // Deterministic JSON serialization (sorted keys) to ensure consistent signatures
  const canonical = JSON.stringify(payload, Object.keys(payload).sort());
  return createHmac('sha256', SIGNING_SECRET).update(canonical).digest('hex');
}
