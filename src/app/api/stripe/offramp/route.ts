import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { safeDecryptSecret } from '@/lib/crypto';
import { sendPayment, PLATFORM_MERCHANT_WALLET } from '@/lib/stellar';
import { getExchangeRate } from '@/lib/fx-service';

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

    // 1. Fetch user's profile to get the stellar_secret
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stellar_secret, stellar_address')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.stellar_secret) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 400 });
    }

    const secret = safeDecryptSecret(profile.stellar_secret);
    if (!secret) {
      return NextResponse.json({ error: 'Wallet temporarily unavailable' }, { status: 503 });
    }

    // 2. Convert USDC to XLM
    const usdcAmount = sourceAmount ? parseFloat(sourceAmount) : 0;
    if (usdcAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    const xlmRate = await getExchangeRate('USDC', 'XLM');
    const xlmAmount = (usdcAmount * xlmRate).toFixed(7);

    // 3. Send the XLM from the user's wallet to the Platform Treasury
    let txHash = null;
    try {
      txHash = await sendPayment(
        secret,
        PLATFORM_MERCHANT_WALLET,
        xlmAmount,
        { memo: 'OFFRAMP-WITHDRAW' }
      );
    } catch (e: any) {
      console.error('Offramp sendPayment error:', e);
      return NextResponse.json({ error: 'Insufficient funds or network error' }, { status: 400 });
    }

    // 4. Record the offramp intent in fiat_transactions
    const sessionId = `offramp_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await supabaseAdmin.from('fiat_transactions').insert({
      user_id: user.id,
      stripe_session_id: sessionId,
      type: 'offramp',
      status: 'fulfilled', // Since we instantly collected the crypto, we mark the offramp as fulfilled on the crypto side.
      crypto_currency: sourceCurrency || 'usdc',
      crypto_amount: usdcAmount,
      fiat_currency: 'usd',
      fiat_amount: usdcAmount, // 1:1 for this mock
      wallet_address: walletAddress || profile.stellar_address,
    });

    // 5. Also record it in the main transactions table so the user sees it in their history
    await supabaseAdmin.from('transactions').insert({
      sender_id: user.id,
      sender_universal_id: user.id,
      recipient_universal_id: 'Z-Pay Treasury (Bank Withdrawal)',
      amount: usdcAmount,
      currency: 'USDC',
      tx_hash: txHash,
      status: 'completed',
      note: `Bank Withdrawal`,
    });

    return NextResponse.json({ 
      sessionId,
      message: 'Withdrawal successful! Funds deducted and sent to bank.',
      txHash
    });
  } catch (error: any) {
    console.error('Stripe Offramp Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
