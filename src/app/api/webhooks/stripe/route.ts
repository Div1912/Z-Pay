import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
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
    switch (event.type) {
      case 'crypto.onramp_session.updated': {
        const session = event.data.object as any;
        console.log(`Onramp session updated: ${session.id}, status: ${session.status}`);

        await supabaseAdmin
          .from('fiat_transactions')
          .update({ 
            status: session.status,
            fiat_amount: session.transaction_details?.destination_amount
          })
          .eq('stripe_session_id', session.id);
        break;
      }
      case 'crypto.onramp_session.fulfilled': {
        const session = event.data.object as any;
        console.log(`Onramp session fulfilled: ${session.id}`);

        await supabaseAdmin
          .from('fiat_transactions')
          .update({ status: 'fulfilled' })
          .eq('stripe_session_id', session.id);
        
        // At this point, the crypto is in the user's wallet
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
