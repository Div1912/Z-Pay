import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

// Use a dummy key if env var is missing during Next.js build time to prevent crashes
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-10-29.clover' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    // Cast event type to string to avoid TS errors on beta webhook types
    switch (event.type as string) {
      case 'crypto.onramp_session.updated': {
        const session = (event as any).data.object;
        
        await supabaseAdmin
          .from('fiat_transactions')
          .update({
            status: session.status,
            fiat_amount: session.transaction_details?.source_amount,
            crypto_amount: session.transaction_details?.destination_amount,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);
        break;
      }
      
      case 'crypto.onramp_session.fulfilled': {
        const session = (event as any).data.object;

        await supabaseAdmin
          .from('fiat_transactions')
          .update({
            status: 'fulfilled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
