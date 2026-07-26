import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { creditDeposit } from '@/lib/zub/ledger';
import type { ZubChain } from '@/lib/zub/types';

const SUPPORTED_CHAINS: ZubChain[] = ['stellar', 'base'];

/**
 * POST /api/zub/deposit
 *
 * Credits a confirmed deposit to the unified ledger.
 * Called internally (by CCTP webhook or manual admin credit) after
 * a deposit is confirmed on-chain.
 *
 * Body: { user_id, chain, amount_usdc, tx_hash }
 */
export async function POST(req: NextRequest) {
  // This endpoint is for internal/admin use only
  const authHeader = req.headers.get('authorization');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Allow service role or CRON_SECRET
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    authHeader === `Bearer ${serviceKey}`;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    user_id?: string;
    chain?: string;
    amount_usdc?: number;
    tx_hash?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { user_id, chain, amount_usdc, tx_hash } = body;

  if (!user_id || !chain || !amount_usdc || !tx_hash) {
    return NextResponse.json(
      { error: 'user_id, chain, amount_usdc, and tx_hash are required' },
      { status: 400 }
    );
  }

  if (!SUPPORTED_CHAINS.includes(chain as ZubChain)) {
    return NextResponse.json(
      { error: `chain must be one of: ${SUPPORTED_CHAINS.join(', ')}` },
      { status: 400 }
    );
  }

  // Fetch the user's universal ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('universal_id')
    .eq('id', user_id)
    .single();

  if (!profile?.universal_id) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const result = await creditDeposit({
    userId: user_id,
    universalId: profile.universal_id,
    chain: chain as ZubChain,
    amount_usdc,
    tx_hash,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    event_id: result.event_id,
    user_id,
    chain,
    amount_usdc,
    tx_hash,
  });
}
