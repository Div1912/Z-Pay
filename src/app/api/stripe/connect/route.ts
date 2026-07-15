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

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_connect_id, email, full_name')
      .eq('id', user.id)
      .single();

    let accountId = profile?.stripe_connect_id;

    // 1. Create a Stripe Connect Account if one doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // Can be dynamic
        email: profile?.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
      });

      accountId = account.id;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_connect_id: accountId })
        .eq('id', user.id);
    }

    // 2. Create an Account Link for Onboarding
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard/withdraw?status=refresh`,
      return_url: `${origin}/dashboard/withdraw?status=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Stripe Connect Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
