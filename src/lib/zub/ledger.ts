/**
 * ZUB — Unified Ledger Service
 *
 * Single source of truth for aggregate USDC balances across chains.
 * Design principles:
 *   - Append-only event log (never mutate a row, only insert)
 *   - Balance is always a derived SUM view of events
 *   - Fully idempotent and replay-safe
 */

import { supabaseAdmin } from '@/lib/supabase';
import type {
  UnifiedBalance,
  ZubChain,
  ZubEventType,
  SolvencyCheck,
} from './types';

// ── Balance Queries ───────────────────────────────────────────────────────────

/**
 * Returns the aggregate USDC balance for a user across all chains.
 * Reads directly from the event log (live query, not materialized view)
 * so it's always accurate even if the view hasn't been refreshed.
 */
export async function getUnifiedBalance(userId: string): Promise<UnifiedBalance> {
  const { data, error } = await supabaseAdmin
    .from('zub_balance_events')
    .select('chain, delta, created_at')
    .eq('user_id', userId);

  if (error) {
    console.error('[zub/ledger] getUnifiedBalance error:', error.message);
    return buildEmptyBalance();
  }

  const perChain: UnifiedBalance['per_chain'] = {
    stellar: 0,
    base: 0,
    ethereum: 0,
  };

  let lastEventAt: string | null = null;

  for (const event of data ?? []) {
    const chain = event.chain as ZubChain;
    if (chain in perChain) {
      perChain[chain] = parseFloat((perChain[chain] + parseFloat(event.delta)).toFixed(6));
    }
    if (!lastEventAt || event.created_at > lastEventAt) {
      lastEventAt = event.created_at;
    }
  }

  const total_usdc = parseFloat(
    (perChain.stellar + perChain.base + perChain.ethereum).toFixed(6)
  );

  return { total_usdc, per_chain: perChain, last_event_at: lastEventAt };
}

/**
 * Returns the balance breakdown for a specific chain only.
 */
export async function getChainBalance(userId: string, chain: ZubChain): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('zub_balance_events')
    .select('delta')
    .eq('user_id', userId)
    .eq('chain', chain);

  if (error) {
    console.error('[zub/ledger] getChainBalance error:', error.message);
    return 0;
  }

  return parseFloat(
    (data ?? []).reduce((sum, e) => sum + parseFloat(e.delta), 0).toFixed(6)
  );
}

// ── Write Operations ──────────────────────────────────────────────────────────

/**
 * Credits a deposit to the unified ledger.
 * Called when a deposit is confirmed on any chain.
 */
export async function creditDeposit(opts: {
  userId: string;
  universalId: string;
  chain: ZubChain;
  amount_usdc: number;
  tx_hash: string;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; event_id?: string; error?: string }> {
  const { userId, universalId, chain, amount_usdc, tx_hash, metadata } = opts;

  if (amount_usdc <= 0) {
    return { success: false, error: 'Amount must be positive' };
  }

  const { data, error } = await supabaseAdmin
    .from('zub_balance_events')
    .insert({
      user_id: userId,
      universal_id: universalId,
      delta: amount_usdc,
      chain,
      event_type: 'deposit' satisfies ZubEventType,
      tx_hash,
      metadata: metadata ?? {},
    })
    .select('event_id')
    .single();

  if (error) {
    console.error('[zub/ledger] creditDeposit error:', error.message);
    return { success: false, error: error.message };
  }

  // Update vault reserve config
  await updateVaultReserve(chain, amount_usdc);

  console.log(`[zub/ledger] Credited ${amount_usdc} USDC on ${chain} for user ${userId}`);
  return { success: true, event_id: data.event_id };
}

/**
 * Debits a spend from the unified ledger.
 * MUST only be called after balance sufficiency has been verified by the
 * attestation service. This is a write — do not call without checking balance first.
 */
export async function debitSpend(opts: {
  userId: string;
  universalId: string;
  amount_usdc: number;
  intentId: string;
  chain: ZubChain; // the chain this spend is being settled on
}): Promise<{ success: boolean; event_id?: string; error?: string }> {
  const { userId, universalId, amount_usdc, intentId, chain } = opts;

  // Final safety check — re-verify balance right before debiting
  const balance = await getUnifiedBalance(userId);
  if (balance.total_usdc < amount_usdc) {
    return {
      success: false,
      error: `Insufficient unified balance. Have ${balance.total_usdc} USDC, need ${amount_usdc} USDC.`,
    };
  }

  const { data, error } = await supabaseAdmin
    .from('zub_balance_events')
    .insert({
      user_id: userId,
      universal_id: universalId,
      delta: -Math.abs(amount_usdc), // always negative
      chain,
      event_type: 'spend' satisfies ZubEventType,
      intent_id: intentId,
      metadata: { intent_id: intentId },
    })
    .select('event_id')
    .single();

  if (error) {
    console.error('[zub/ledger] debitSpend error:', error.message);
    return { success: false, error: error.message };
  }

  // Decrement vault reserve
  await updateVaultReserve(chain, -amount_usdc);

  console.log(`[zub/ledger] Debited ${amount_usdc} USDC on ${chain} for user ${userId} (intent ${intentId})`);
  return { success: true, event_id: data.event_id };
}

/**
 * Records reconciliation credits/debits (internal rebalancing, not user-visible spends).
 */
export async function recordReconciliationEvent(opts: {
  userId: string;
  universalId: string;
  chain: ZubChain;
  amount_usdc: number; // positive for credit, negative for debit
  eventType: 'reconciliation_credit' | 'reconciliation_debit';
  obligationId: string;
}): Promise<void> {
  const { userId, universalId, chain, amount_usdc, eventType, obligationId } = opts;

  await supabaseAdmin.from('zub_balance_events').insert({
    user_id: userId,
    universal_id: universalId,
    delta: amount_usdc,
    chain,
    event_type: eventType,
    metadata: { obligation_id: obligationId },
  });
}

// ── Solvency Check ────────────────────────────────────────────────────────────

/**
 * Critical invariant: sum(vault reserves) >= sum(unified ledger balances)
 * If this returns solvent=false, the system is in a deficit state and
 * new instant-spend authorizations should be PAUSED.
 */
export async function checkSolvency(): Promise<SolvencyCheck> {
  // Sum all positive unified ledger balances
  const { data: eventData } = await supabaseAdmin
    .from('zub_balance_events')
    .select('delta');

  const total_ledger_usdc = parseFloat(
    (eventData ?? [])
      .reduce((sum, e) => sum + parseFloat(e.delta), 0)
      .toFixed(6)
  );

  // Sum all vault reserves
  const { data: vaultData } = await supabaseAdmin
    .from('zub_vault_config')
    .select('reserve_usdc')
    .eq('enabled', true);

  const total_vault_reserve_usdc = parseFloat(
    (vaultData ?? [])
      .reduce((sum, v) => sum + parseFloat(v.reserve_usdc), 0)
      .toFixed(6)
  );

  const deficit_usdc = Math.max(0, total_ledger_usdc - total_vault_reserve_usdc);
  const solvent = deficit_usdc === 0;

  if (!solvent) {
    console.error(
      `[zub/ledger] 🚨 SOLVENCY ALERT: ledger=${total_ledger_usdc} USDC, vault_reserves=${total_vault_reserve_usdc} USDC, deficit=${deficit_usdc} USDC`
    );
  }

  return { solvent, total_ledger_usdc, total_vault_reserve_usdc, deficit_usdc };
}

/**
 * Refreshes the materialized balance view (call after bulk operations or on a schedule).
 */
export async function refreshBalanceView(): Promise<void> {
  try {
    await supabaseAdmin.rpc('refresh_zub_balances');
  } catch (err: any) {
    // Non-fatal — view is an optimization, not required for correctness
    console.warn('[zub/ledger] Could not refresh materialized view:', err.message);
  }
}

// ── Internal Helpers ──────────────────────────────────────────────────────────

function buildEmptyBalance(): UnifiedBalance {
  return {
    total_usdc: 0,
    per_chain: { stellar: 0, base: 0, ethereum: 0 },
    last_event_at: null,
  };
}

async function updateVaultReserve(chain: ZubChain, delta: number): Promise<void> {
  try {
    // Use Supabase RPC for atomic increment to avoid race conditions
    await supabaseAdmin.rpc('increment_zub_vault_reserve', {
      p_chain: chain,
      p_delta: delta,
    });
  } catch (err: any) {
    // Non-fatal — vault config is a soft tracking layer, not the source of truth
    console.warn('[zub/ledger] Could not update vault reserve:', err.message);
  }
}
