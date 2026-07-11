import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { horizonServer } from '@/lib/stellar';

const PAGE_SIZE = 30;

/**
 * GET /api/zpay/deposits
 *
 * Returns paginated deposit history for the current user from stellar_deposits.
 * Includes CCTP cross-chain deposits alongside native Stellar deposits.
 *
 * Query params:
 *   page (default 1)
 *   status: 'all' | 'pending' | 'confirmed' | 'failed'  (default: 'all')
 *   type:   'all' | 'stellar_native' | 'cctp_usdc'       (default: 'all')
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const status = searchParams.get('status') ?? 'all';
  const type   = searchParams.get('type')   ?? 'all';
  const from   = (page - 1) * PAGE_SIZE;

  let query = supabaseAdmin
    .from('stellar_deposits')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  // Status filter — map UI terms to DB column values
  if (status !== 'all') {
    if (status === 'pending') {
      query = query.eq('credited', false);
    } else if (status === 'confirmed') {
      query = query.eq('credited', true);
    } else if (status === 'failed') {
      query = query.eq('bridge_status', 'failed');
    }
  }

  if (type !== 'all') {
    query = query.eq('deposit_type', type);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[deposits] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }

  // Also fetch any pending CCTP intents so the UI can show them before they credit
  const { data: pendingIntents } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .select('id, source_chain, amount_usdc, status, source_tx_hash, created_at, updated_at')
    .eq('user_id', user.id)
    .in('status', ['pending', 'submitted', 'attested'])
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({
    deposits:       data ?? [],
    pending_intents: pendingIntents ?? [],
    total:          count ?? 0,
    page,
    page_size:      PAGE_SIZE,
    total_pages:    Math.ceil((count ?? 0) / PAGE_SIZE),
  });
}

/**
 * POST /api/zpay/deposits
 * Body: {} (no params needed — backfills from user's own Horizon history)
 *
 * Scans the last 50 Stellar payments for the user's address and backfills
 * any that are missing from stellar_deposits. Handles the case where the
 * SSE stream was disconnected and deposits were missed.
 *
 * Rate-limited to once per 30 seconds per user (via Supabase timestamp check).
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stellar_address')
    .eq('id', user.id)
    .single();

  if (!profile?.stellar_address) {
    return NextResponse.json({ error: 'Stellar wallet not found' }, { status: 404 });
  }

  // Rate limit: check when we last did a backfill for this user
  const { data: recentDeposit } = await supabaseAdmin
    .from('stellar_deposits')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Allow backfill at most once per 30 seconds
  const lastBackfillKey = `backfill:${user.id}`;
  const backfillTimestamps: Record<string, number> = (global as any).__zpay_backfill ?? {};
  (global as any).__zpay_backfill = backfillTimestamps;

  const lastBackfill = backfillTimestamps[lastBackfillKey] ?? 0;
  if (Date.now() - lastBackfill < 30_000) {
    return NextResponse.json({
      message: 'Backfill recently completed. Please wait 30 seconds.',
      credited: 0,
    });
  }
  backfillTimestamps[lastBackfillKey] = Date.now();

  let credited = 0;
  let skipped  = 0;
  let errors   = 0;

  try {
    // Check account is active first
    try {
      await horizonServer.loadAccount(profile.stellar_address);
    } catch {
      return NextResponse.json({
        message: 'Stellar account not yet activated on-chain.',
        credited: 0,
      });
    }

    // Fetch last 50 incoming payments
    const payments = await horizonServer
      .payments()
      .forAccount(profile.stellar_address)
      .order('desc')
      .limit(50)
      .call();

    for (const payment of payments.records as any[]) {
      const isReceived =
        (payment.type === 'payment' && payment.to === profile.stellar_address) ||
        (payment.type === 'create_account' && payment.account === profile.stellar_address);

      if (!isReceived) { skipped++; continue; }

      const amount = payment.type === 'create_account'
        ? payment.starting_balance
        : payment.amount;

      const asset = payment.type === 'create_account' || payment.asset_type === 'native'
        ? 'XLM'
        : payment.asset_code;

      const fromAddress = payment.type === 'create_account'
        ? payment.funder
        : payment.from;

      const txHash = payment.transaction_hash;

      // Upsert — idempotent
      const { error: upsertErr } = await supabaseAdmin
        .from('stellar_deposits')
        .upsert(
          {
            user_id:      user.id,
            tx_hash:      txHash,
            amount:       parseFloat(amount),
            asset,
            from_address: fromAddress,
            deposit_type: 'stellar_native',
            credited:     true,
          },
          { onConflict: 'tx_hash', ignoreDuplicates: true }
        );

      if (upsertErr) {
        console.error('[deposits/backfill] upsert error:', upsertErr.message);
        errors++;
      } else {
        credited++;
      }
    }
  } catch (err: any) {
    console.error('[deposits/backfill] Horizon error:', err.message);
    return NextResponse.json({
      error:    'Failed to fetch payment history from Stellar network',
      credited: 0,
    }, { status: 500 });
  }

  return NextResponse.json({
    message:  `Backfill complete. Synced ${credited} deposit${credited !== 1 ? 's' : ''}.`,
    credited,
    skipped,
    errors,
  });
}
