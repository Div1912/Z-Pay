import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { refundEscrow } from '@/lib/escrow';
import { safeDecryptSecret } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { escrow_id, payer_stellar_address } = await request.json();
    const { data: payerProfile } = await supabaseAdmin.from('profiles').select('stellar_secret').eq('stellar_address', payer_stellar_address).single();
    const secret = safeDecryptSecret(payerProfile.stellar_secret);
    const txHash = await refundEscrow(escrow_id, secret);
    return NextResponse.json({ success: true, txHash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
