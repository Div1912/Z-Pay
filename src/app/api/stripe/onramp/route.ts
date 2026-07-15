import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia', // Latest Stripe API version
});

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { destCurrency, destNetwork, destAmount, walletAddress } = body;

    // Create an OnrampSession
    // Note: Stripe Crypto Onramp requires specific test mode setup for developers
    const onrampSession = await stripe.crypto.onrampSessions.create({
      transaction_details: {
        destination_currency: destCurrency || 'usdc',
        destination_network: destNetwork || 'stellar',
        destination_amount: destAmount,
      },
      customer_ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
      wallet_addresses: {
        [destNetwork || 'stellar']: walletAddress,
      },
    });

    // Save session in our database as 'pending'
    await supabaseAdmin.from('fiat_transactions').insert({
      user_id: user.id,
      stripe_session_id: onrampSession.id,
      type: 'onramp',
      status: 'pending',
      crypto_currency: destCurrency || 'usdc',
      crypto_amount: destAmount ? parseFloat(destAmount) : null,
      wallet_address: walletAddress,
    });

    return NextResponse.json({ clientSecret: onrampSession.client_secret });
  } catch (error: any) {
    console.error('Stripe Onramp Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
