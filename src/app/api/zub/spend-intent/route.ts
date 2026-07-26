import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSpendIntent } from '@/lib/zub/attestation';
import { debitSpend, creditDeposit } from '@/lib/zub/ledger';
import { recordObligation } from '@/lib/zub/reconciliation';
import { markIntentReleased, markIntentFailed } from '@/lib/zub/attestation';
import type { ZubChain } from '@/lib/zub/types';

const SUPPORTED_CHAINS: ZubChain[] = ['stellar', 'base'];

/**
 * POST /api/zub/spend-intent
 *
 * Creates a spend intent and returns a signed release authorization.
 * The caller submits this authorization to the destination vault to release funds.
 *
 * Body: { amount_usdc, destination_chain, recipient, memo? }
 * Returns: { intent_id, status, release_authorization }
 */
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    amount_usdc?: number;
    destination_chain?: string;
    recipient?: string;
    memo?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { amount_usdc, destination_chain, recipient, memo } = body;

  // Validation
  if (!amount_usdc || typeof amount_usdc !== 'number' || amount_usdc <= 0) {
    return NextResponse.json({ error: 'amount_usdc must be a positive number' }, { status: 400 });
  }

  if (!destination_chain || !SUPPORTED_CHAINS.includes(destination_chain as ZubChain)) {
    return NextResponse.json(
      { error: `destination_chain must be one of: ${SUPPORTED_CHAINS.join(', ')}` },
      { status: 400 }
    );
  }

  if (!recipient || typeof recipient !== 'string') {
    return NextResponse.json({ error: 'recipient is required' }, { status: 400 });
  }

  // Fetch user's universal ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('universal_id')
    .eq('id', user.id)
    .single();

  if (!profile?.universal_id) {
    return NextResponse.json({ error: 'Profile not configured' }, { status: 404 });
  }

  // Create the spend intent
  const result = await createSpendIntent({
    userId: user.id,
    universalId: profile.universal_id,
    amount_usdc,
    destination_chain: destination_chain as ZubChain,
    recipient,
    memo,
  });

  if (result.status === 'failed') {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Immediately debit the ledger (reserve the funds) and execute the release.
  // In a full vault implementation, the release would happen on-chain.
  // In Phase 0 (hot wallet mode), we debit and mark as released immediately.
  const debitResult = await debitSpend({
    userId: user.id,
    universalId: profile.universal_id,
    amount_usdc,
    intentId: result.intent_id,
    chain: destination_chain as ZubChain,
  });

  if (!debitResult.success) {
    await markIntentFailed(result.intent_id, debitResult.error ?? 'Debit failed');
    return NextResponse.json({ error: debitResult.error ?? 'Spend failed' }, { status: 400 });
  }

  // Record reconciliation obligation (background rebalancing)
  // We determine which chain has a surplus based on the balance breakdown.
  // For Phase 0: if spending on Base, the surplus comes from Stellar (and vice versa).
  const surplusChain: ZubChain = destination_chain === 'base' ? 'stellar' : 'base';
  await recordObligation({
    deficitChain: destination_chain as ZubChain,
    surplusChain,
    amount_usdc,
    intentId: result.intent_id,
  });

  // Mark as released (Phase 0 hot wallet — no on-chain vault call yet)
  const simulatedTxHash = `ZUB_${Date.now()}_${result.intent_id.slice(0, 8)}`;
  await markIntentReleased(result.intent_id, simulatedTxHash);

  return NextResponse.json({
    intent_id: result.intent_id,
    status: 'released',
    tx_hash: simulatedTxHash,
    release_authorization: result.release_authorization,
    amount_usdc,
    destination_chain,
    recipient,
  });
}
