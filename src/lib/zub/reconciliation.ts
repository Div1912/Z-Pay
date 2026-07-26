/**
 * ZUB — Reconciliation Engine
 *
 * Watches for vault reserve imbalances after spends and triggers
 * CCTP cross-chain rebalancing to settle obligations asynchronously.
 *
 * Phase 0: simple batching — net obligations per (surplus, deficit) chain
 * pair over a 60-second window before executing CCTP.
 */


import { supabaseAdmin } from '@/lib/supabase';
import { processPendingCctpIntents, processOutboundCctpIntents } from '@/lib/cctp';
import { expireStaleIntents } from './attestation';
import { checkSolvency, refreshBalanceView } from './ledger';
import type { ZubChain, ZubObligationStatus } from './types';

// ── Obligation Management ─────────────────────────────────────────────────────

/**
 * Records that a vault on deficit_chain needs to be topped up from surplus_chain.
 * Called immediately after a spend is released from a vault.
 */
export async function recordObligation(opts: {
  deficitChain: ZubChain;
  surplusChain: ZubChain;
  amount_usdc: number;
  intentId?: string;
}): Promise<string | null> {
  const { deficitChain, surplusChain, amount_usdc, intentId } = opts;

  if (deficitChain === surplusChain) {
    // Same-chain spend — no cross-chain obligation needed
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('zub_reconciliation_obligations')
    .insert({
      deficit_chain: deficitChain,
      surplus_chain: surplusChain,
      amount_usdc,
      status: 'pending' satisfies ZubObligationStatus,
      intent_id: intentId ?? null,
    })
    .select('obligation_id')
    .single();

  if (error) {
    console.error('[zub/reconciliation] Failed to record obligation:', error.message);
    return null;
  }

  console.log(
    `[zub/reconciliation] Recorded obligation: ${amount_usdc} USDC from ${surplusChain} → ${deficitChain}`
  );
  return data.obligation_id;
}

// ── Batch Processing ──────────────────────────────────────────────────────────

/**
 * Main reconciliation run — called by the cron endpoint every 60 seconds.
 *
 * Steps:
 * 1. Expire stale intents
 * 2. Net pending obligations per (surplus, deficit) pair
 * 3. Execute CCTP for net obligations
 * 4. Process any pending Circle attestations (both inbound + outbound)
 * 5. Run solvency check
 * 6. Refresh materialized balance view
 */
export async function processBatch(): Promise<{
  expired_intents: number;
  obligations_batched: number;
  cctp_processed: number;
  solvent: boolean;
}> {
  console.log('[zub/reconciliation] Starting batch run...');

  // 1. Expire stale intents
  const expiredCount = await expireStaleIntents();
  if (expiredCount > 0) {
    console.log(`[zub/reconciliation] Expired ${expiredCount} stale intents`);
  }

  // 2. Fetch pending obligations
  const { data: pending, error } = await supabaseAdmin
    .from('zub_reconciliation_obligations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) {
    console.error('[zub/reconciliation] Failed to fetch obligations:', error.message);
  }

  let obligationsBatched = 0;

  if (pending && pending.length > 0) {
    // 3. Net obligations per (surplus→deficit) pair — cancel overlaps first
    const netted = netObligations(pending);

    for (const [key, netAmount] of Object.entries(netted)) {
      if (netAmount <= 0) continue;

      const [surplusChain, deficitChain] = key.split('→') as [ZubChain, ZubChain];
      const batchId = crypto.randomUUID();

      // Mark all obligations in this pair as batched
      const pairIds = pending
        .filter(
          (o) =>
            o.surplus_chain === surplusChain &&
            o.deficit_chain === deficitChain &&
            o.status === 'pending'
        )
        .map((o) => o.obligation_id);

      await supabaseAdmin
        .from('zub_reconciliation_obligations')
        .update({ status: 'batched', batch_id: batchId })
        .in('obligation_id', pairIds);

      obligationsBatched += pairIds.length;

      // Trigger CCTP settlement for this batch
      await triggerCctpSettlement({
        surplusChain,
        deficitChain,
        netAmount,
        batchId,
      });
    }
  }

  // 4. Process Circle attestations for any in-flight CCTP transfers
  const [inbound, outbound] = await Promise.allSettled([
    processPendingCctpIntents(),
    processOutboundCctpIntents(),
  ]);

  const inboundResult = inbound.status === 'fulfilled' ? inbound.value : { processed: 0 };
  const outboundResult = outbound.status === 'fulfilled' ? outbound.value : { processed: 0 };
  const cctp_processed = inboundResult.processed + outboundResult.processed;

  // 5. Solvency check
  const solvency = await checkSolvency();

  // 6. Refresh materialized view
  await refreshBalanceView();

  console.log(
    `[zub/reconciliation] Batch complete: expired=${expiredCount}, obligations_batched=${obligationsBatched}, cctp_processed=${cctp_processed}, solvent=${solvency.solvent}`
  );

  return {
    expired_intents: expiredCount,
    obligations_batched: obligationsBatched,
    cctp_processed,
    solvent: solvency.solvent,
  };
}

// ── CCTP Settlement Trigger ───────────────────────────────────────────────────

/**
 * Triggers the appropriate CCTP path for a given (surplus→deficit) pair.
 * Phase 0 supported paths:
 *   - stellar → base: uses processOutboundCctpIntents (Stellar burn → Base mint)
 *   - base → stellar: uses processPendingCctpIntents (Base burn → Stellar mint)
 */
async function triggerCctpSettlement(opts: {
  surplusChain: ZubChain;
  deficitChain: ZubChain;
  netAmount: number;
  batchId: string;
}): Promise<void> {
  const { surplusChain, deficitChain, netAmount, batchId } = opts;

  console.log(
    `[zub/reconciliation] CCTP settlement: ${netAmount} USDC from ${surplusChain} → ${deficitChain} (batch ${batchId})`
  );

  // For Phase 0, we record the obligation and let the existing CCTP polling
  // pick it up. The full CCTP burn initiation requires the relayer private key
  // (EVM_RELAYER_PRIVATE_KEY) to be set. If not set, the existing code simulates it.
  //
  // Mark the obligations as burn_submitted to trigger the poll loop.
  await supabaseAdmin
    .from('zub_reconciliation_obligations')
    .update({ status: 'cctp_burn_submitted' })
    .eq('batch_id', batchId);

  // In Phase 1: directly call TokenMessenger.depositForBurn() on the surplus chain
  // using the relayer wallet, then store the message hash for attestation polling.
}

// ── Obligation Netting ────────────────────────────────────────────────────────

/**
 * Nets obligations per (surplus→deficit) pair.
 * Cancels circular flows: if stellar→base owes $100 and base→stellar owes $60,
 * net result is stellar→base owes $40 (only move $40, not $160).
 */
function netObligations(
  obligations: Array<{
    surplus_chain: string;
    deficit_chain: string;
    amount_usdc: string | number;
  }>
): Record<string, number> {
  const gross: Record<string, number> = {};

  for (const o of obligations) {
    const key = `${o.surplus_chain}→${o.deficit_chain}`;
    gross[key] = (gross[key] ?? 0) + parseFloat(String(o.amount_usdc));
  }

  // Cancel circular flows
  const netted = { ...gross };
  for (const key of Object.keys(gross)) {
    const [s, d] = key.split('→');
    const reverseKey = `${d}→${s}`;
    if (reverseKey in netted && netted[reverseKey] > 0) {
      const cancel = Math.min(netted[key], netted[reverseKey]);
      netted[key] -= cancel;
      netted[reverseKey] -= cancel;
    }
  }

  return netted;
}

// ── Status Query ──────────────────────────────────────────────────────────────

/**
 * Returns a summary of the current reconciliation queue.
 */
export async function getReconciliationStatus(): Promise<{
  pending: number;
  batched: number;
  in_flight: number;
  settled_today: number;
}> {
  const { data } = await supabaseAdmin
    .from('zub_reconciliation_obligations')
    .select('status, settled_at');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const counts = { pending: 0, batched: 0, in_flight: 0, settled_today: 0 };

  for (const row of data ?? []) {
    if (row.status === 'pending') counts.pending++;
    else if (row.status === 'batched') counts.batched++;
    else if (['cctp_burn_submitted', 'cctp_attested'].includes(row.status)) counts.in_flight++;
    else if (row.status === 'settled' && row.settled_at && new Date(row.settled_at) >= today) {
      counts.settled_today++;
    }
  }

  return counts;
}
