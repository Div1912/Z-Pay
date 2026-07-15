import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { safeDecryptSecret } from '@/lib/crypto';
import { sendPayment, PLATFORM_MERCHANT_WALLET } from '@/lib/stellar';
import { getExchangeRate } from '@/lib/fx-service';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency } = await req.json(); // e.g., amount = "100", currency = "USDC"
    const cryptoAmount = parseFloat(amount);
    
    if (!cryptoAmount || cryptoAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // 1. Fetch user's profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.stellar_secret) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 400 });
    }

    const secret = safeDecryptSecret(profile.stellar_secret);
    if (!secret) {
      return NextResponse.json({ error: 'Wallet temporarily unavailable' }, { status: 503 });
    }

    // 2. Convert currency to XLM for sending to Treasury
    let xlmAmount = cryptoAmount;
    if (currency?.toUpperCase() === 'USDC') {
      const xlmRate = await getExchangeRate('USDC', 'XLM');
      xlmAmount = cryptoAmount * xlmRate;
    }
    const xlmAmountStr = xlmAmount.toFixed(7);

    // 3. Send crypto to Treasury Wallet
    let txHash = null;
    try {
      txHash = await sendPayment(
        secret,
        PLATFORM_MERCHANT_WALLET,
        xlmAmountStr,
        { memo: 'SELL-CRYPTO' }
      );
    } catch (e: any) {
      console.error('Sell sendPayment error:', e);
      return NextResponse.json({ error: 'Insufficient funds or network error' }, { status: 400 });
    }

    // 4. Calculate fiat value in INR
    let fiatValue = cryptoAmount;
    if (currency?.toUpperCase() === 'USDC' || currency?.toUpperCase() === 'XLM') {
      const inrRate = await getExchangeRate(currency?.toUpperCase() || 'USDC', 'INR');
      fiatValue = cryptoAmount * inrRate;
    }

    // 5. Update user's fiat_balance (INR)
    const newFiatBalance = (parseFloat(profile.fiat_balance || '0') + fiatValue).toFixed(2);
    await supabaseAdmin
      .from('profiles')
      .update({ fiat_balance: newFiatBalance, fiat_currency: 'inr' })
      .eq('id', user.id);

    // 6. Record transaction
    await supabaseAdmin.from('transactions').insert({
      sender_id: user.id,
      sender_universal_id: user.id,
      recipient_universal_id: 'Z-Pay Treasury (Crypto Sale)',
      amount: cryptoAmount,
      currency: currency || 'USDC',
      tx_hash: txHash,
      status: 'completed',
      note: `Sold ${cryptoAmount} ${currency || 'USDC'} for ₹${fiatValue.toFixed(2)} INR`,
    });

    return NextResponse.json({ 
      message: 'Sale successful! Fiat balance credited.',
      txHash,
      newFiatBalance
    });

  } catch (error: any) {
    console.error('Sell API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
