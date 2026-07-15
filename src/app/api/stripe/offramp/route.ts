import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

// Use a dummy key if env var is missing during Next.js build time to prevent crashes
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-10-29.clover' as any,
});

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sourceCurrency, sourceAmount, sourceNetwork, walletAddress } = body;

    // Note: If using Stripe native Crypto Offramp (invite-only or beta in some regions)
    // you would call a similar method to onramp. For now, we mock the session creation
    // and rely on Z-Pay's treasury pipeline (user sends crypto to treasury -> triggers Fiat Payout).
    
    const sessionId = `offramp_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await supabaseAdmin.from('fiat_transactions').insert({
      user_id: user.id,
      stripe_session_id: sessionId,
      type: 'offramp',
      status: 'pending',
      crypto_currency: sourceCurrency || 'usdc',
      crypto_amount: sourceAmount ? parseFloat(sourceAmount) : null,
      wallet_address: walletAddress,
    });

    return NextResponse.json({ 
      sessionId,
      message: 'Offramp session created. Await crypto deposit confirmation.',
      // In a full Stripe offramp setup, return a clientSecret here.
      clientSecret: 'mock_secret_for_ui'
    });
  } catch (error: any) {
    console.error('Stripe Offramp Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
