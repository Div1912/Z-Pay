import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-10-29.clover' as any,
});

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json(); // Fiat amount to withdraw
    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('fiat_balance, stripe_connect_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(profile.fiat_balance || '0');
    if (currentBalance < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient fiat balance' }, { status: 400 });
    }

    if (!profile.stripe_connect_id) {
      return NextResponse.json({ error: 'Bank account not linked (Stripe Connect ID missing)' }, { status: 400 });
    }

    // 1. Transfer funds from Platform Master Balance to the Connected Account
    // (In a real system, you might already have routed it there, or you push it now)
    const transfer = await stripe.transfers.create({
      amount: Math.round(withdrawAmount * 100), // in cents
      currency: 'usd',
      destination: profile.stripe_connect_id,
      description: `Z-Pay Withdrawal for ${user.id}`,
    });

    // Note: If the Connect account is on "manual payouts", you might also need to trigger a payout.
    // For Stripe Express, transfers often payout automatically if they are setup that way.
    // To explicitly trigger a payout immediately:
    // We would need to authenticate as the connected account, but `stripe.transfers` is the way money reaches them.

    // 2. Deduct from Z-Pay Fiat Ledger
    const newFiatBalance = (currentBalance - withdrawAmount).toFixed(2);
    await supabaseAdmin
      .from('profiles')
      .update({ fiat_balance: newFiatBalance })
      .eq('id', user.id);

    // 3. Log Fiat Transaction
    const sessionId = `payout_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await supabaseAdmin.from('fiat_transactions').insert({
      user_id: user.id,
      stripe_session_id: sessionId,
      type: 'offramp', // representing the withdrawal out of the system
      status: 'fulfilled',
      fiat_currency: 'usd',
      fiat_amount: withdrawAmount,
    });

    return NextResponse.json({ 
      message: 'Withdrawal successful! Funds transferred to your bank.',
      transferId: transfer.id,
      newFiatBalance
    });

  } catch (error: any) {
    console.error('Stripe Payout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
