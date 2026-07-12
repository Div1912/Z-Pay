import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch as sender (outgoing payments)
  const { data: sent } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch as recipient (incoming payments, refunds from escrow where sender_id may be null)
  const { data: received } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  // Merge and deduplicate by id, sort newest first
  const allMap = new Map<string, any>();
  for (const tx of [...(sent || []), ...(received || [])]) {
    allMap.set(tx.id, tx);
  }
  const merged = Array.from(allMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 100);

  return NextResponse.json(merged);
}
