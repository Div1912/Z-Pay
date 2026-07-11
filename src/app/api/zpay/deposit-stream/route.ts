import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { horizonServer } from '@/lib/stellar';

/**
 * GET /api/zpay/deposit-stream
 *
 * Server-Sent Events (SSE) endpoint that streams real-time Stellar payment
 * events for the authenticated user's stellar_address.
 *
 * The client opens an EventSource to this URL. When a payment or
 * create_account operation arrives at the user's address, we:
 *  1. Upsert it into stellar_deposits (idempotent via tx_hash UNIQUE).
 *  2. Send an SSE event: { type: 'deposit', amount, asset, from, tx_hash }.
 *
 * The stream closes after 4 minutes (Vercel edge timeout) — the client
 * should auto-reconnect via EventSource's built-in retry behaviour.
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stellar_address')
    .eq('id', user.id)
    .single();

  if (!profile?.stellar_address) {
    return NextResponse.json({ error: 'Stellar address not found' }, { status: 404 });
  }

  const stellarAddress = profile.stellar_address;

  // Set up SSE response headers
  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller closed
        }
      };

      // Send a heartbeat immediately so the client knows the connection is open
      send({ type: 'connected', address: stellarAddress });

      // Close handler
      const closeStream = () => {
        if (!isClosed) {
          isClosed = true;
          try { controller.close(); } catch { /* already closed */ }
        }
      };

      // Auto-close after 4 minutes (Vercel function timeout safety)
      const timeout = setTimeout(closeStream, 4 * 60 * 1000);

      let stopStreaming: (() => void) | undefined;

      try {
        // Check if the account exists on-chain first
        let accountActive = false;
        try {
          await horizonServer.loadAccount(stellarAddress);
          accountActive = true;
        } catch {
          send({ type: 'inactive_account', message: 'Account not yet activated. Send ≥1 XLM to activate.' });
        }

        if (accountActive) {
          // Stream incoming payments for this account
          stopStreaming = horizonServer
            .payments()
            .forAccount(stellarAddress)
            .cursor('now')
            .stream({
              onmessage: async (payment: any) => {
                // Only handle receive-side operations
                const isReceived =
                  (payment.type === 'payment' && payment.to === stellarAddress) ||
                  (payment.type === 'create_account' && payment.account === stellarAddress);

                if (!isReceived) return;

                const amount =
                  payment.type === 'create_account'
                    ? payment.starting_balance
                    : payment.amount;

                const asset =
                  payment.type === 'create_account' || payment.asset_type === 'native'
                    ? 'XLM'
                    : payment.asset_code;

                const fromAddress =
                  payment.type === 'create_account'
                    ? payment.funder
                    : payment.from;

                const txHash = payment.transaction_hash;

                // Upsert into stellar_deposits (idempotent)
                const { error: upsertErr } = await supabaseAdmin
                  .from('stellar_deposits')
                  .upsert(
                    {
                      user_id: user.id,
                      tx_hash: txHash,
                      amount: parseFloat(amount),
                      asset,
                      from_address: fromAddress,
                      credited: true,
                    },
                    { onConflict: 'tx_hash', ignoreDuplicates: true }
                  );

                if (upsertErr) {
                  console.error('[deposit-stream] upsert error:', upsertErr.message);
                }

                // Push SSE event to the client
                send({
                  type: 'deposit',
                  amount,
                  asset,
                  from: fromAddress,
                  tx_hash: txHash,
                  timestamp: new Date().toISOString(),
                });
              },
              onerror: (err: any) => {
                console.error('[deposit-stream] Horizon stream error:', err);
                send({ type: 'error', message: 'Stream error. Please reconnect.' });
                closeStream();
              },
            }) as unknown as () => void;
        }
      } catch (err: any) {
        console.error('[deposit-stream] setup error:', err.message);
        send({ type: 'error', message: 'Failed to connect to Stellar network.' });
        closeStream();
      }

      // Cleanup on stream close
      return () => {
        clearTimeout(timeout);
        isClosed = true;
        if (typeof stopStreaming === 'function') {
          try { stopStreaming(); } catch { /* ignore */ }
        }
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering (Vercel)
    },
  });
}
