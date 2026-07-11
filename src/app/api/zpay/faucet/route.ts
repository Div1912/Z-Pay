import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { IS_MAINNET } from '@/lib/stellar';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (IS_MAINNET) {
    return NextResponse.json({ error: 'Faucet is only available on Testnet' }, { status: 400 });
  }

  // Fetch user's Stellar address
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stellar_address')
    .eq('id', user.id)
    .single();

  if (!profile?.stellar_address) {
    return NextResponse.json({ error: 'Stellar wallet not found.' }, { status: 404 });
  }

  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${profile.stellar_address}`);
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Friendbot error: ${errText}` }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Successfully funded 10,000 XLM from Friendbot!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
