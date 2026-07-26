import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUnifiedBalance } from '@/lib/zub/ledger';

/**
 * GET /api/zub/balance
 *
 * Returns the user's unified USDC balance across all chains.
 * Also returns the existing Stellar XLM balance for backward compatibility.
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('universal_id, stellar_address')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const balance = await getUnifiedBalance(user.id);

  return NextResponse.json({
    unified_balance: {
      total_usdc: balance.total_usdc,
      per_chain: balance.per_chain,
      last_updated: balance.last_event_at,
    },
    universal_id: profile.universal_id,
  });
}
