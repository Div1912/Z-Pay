import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { pollAttestation, completeStellarMint } from '@/lib/cctp';

/**
 * POST /api/cctp/verify
 *
 * Manual verification trigger for a CCTP deposit intent.
 * The user (or our frontend) can call this to check status.
 * The webhook cron also handles this automatically.
 *
 * Body: { intent_id }
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { intent_id } = await request.json();
  if (!intent_id) return NextResponse.json({ error: 'intent_id is required' }, { status: 400 });

  // Fetch intent
  const { data: intent, error: fetchError } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .select('*')
    .eq('id', intent_id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !intent) {
    return NextResponse.json({ error: 'Intent not found' }, { status: 404 });
  }

  if (intent.status === 'completed') {
    return NextResponse.json({ status: 'completed', message: 'Already credited to your wallet.' });
  }

  if (intent.status === 'failed') {
    return NextResponse.json({ status: 'failed', error: intent.error_message });
  }

  if (intent.status === 'pending') {
    return NextResponse.json({
      status:  'pending',
      message: 'Waiting for you to submit your source-chain transaction hash.',
    });
  }

  // For 'submitted' or 'attested' — poll Circle
  if (!intent.cctp_message_hash) {
    // Message hash not yet available — need to extract it from source tx receipt
    // This is normally done by our webhook listening to the source chain events.
    // For now, return status.
    return NextResponse.json({
      status:  'submitted',
      message: 'Transaction submitted. Waiting for Circle to confirm the source-chain burn (5–20 min).',
    });
  }

  const attestation = await pollAttestation(intent.cctp_message_hash);

  if (attestation.status !== 'complete') {
    return NextResponse.json({
      status:  'submitted',
      message: 'Circle is confirming the source-chain burn. Please check back in a few minutes.',
    });
  }

  // Attestation complete — mint on Stellar
  try {
    await supabaseAdmin
      .from('cctp_deposit_intents')
      .update({ status: 'attested', updated_at: new Date().toISOString() })
      .eq('id', intent.id);

    const stellarTxHash = await completeStellarMint(
      attestation.attestation!,
      attestation.message!,
      intent.stellar_address
    );

    // Credit to stellar_deposits
    const { data: deposit } = await supabaseAdmin
      .from('stellar_deposits')
      .insert({
        user_id:           intent.user_id,
        tx_hash:           stellarTxHash,
        amount:            intent.amount_usdc ?? 0,
        asset:             'USDC',
        from_address:      `${intent.source_chain}:bridge`,
        deposit_type:      'cctp_usdc',
        source_chain:      intent.source_chain,
        source_tx_hash:    intent.source_tx_hash,
        bridge_status:     'completed',
        cctp_message_hash: intent.cctp_message_hash,
        bridge_tx_hash:    stellarTxHash,
        credited:          true,
      })
      .select('id')
      .single();

    await supabaseAdmin
      .from('cctp_deposit_intents')
      .update({
        status:             'completed',
        stellar_deposit_id: deposit?.id ?? null,
        updated_at:         new Date().toISOString(),
      })
      .eq('id', intent.id);

    return NextResponse.json({
      status:          'completed',
      stellar_tx_hash: stellarTxHash,
      message:         'USDC successfully bridged and credited to your Z-Pay wallet!',
    });
  } catch (err: any) {
    console.error('[cctp/verify] Stellar mint error:', err.message);

    await supabaseAdmin
      .from('cctp_deposit_intents')
      .update({
        status:        'failed',
        error_message: err.message,
        updated_at:    new Date().toISOString(),
      })
      .eq('id', intent.id);

    return NextResponse.json({ error: 'Bridge completion failed. Our team has been notified.' }, { status: 500 });
  }
}

/**
 * GET /api/cctp/verify?intent_id=...
 * Returns the current status of an intent without triggering a poll.
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const intentId = searchParams.get('intent_id');
  if (!intentId) return NextResponse.json({ error: 'intent_id required' }, { status: 400 });

  const { data: intent } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .select('id, status, source_chain, amount_usdc, source_tx_hash, created_at, updated_at, error_message')
    .eq('id', intentId)
    .eq('user_id', user.id)
    .single();

  if (!intent) return NextResponse.json({ error: 'Intent not found' }, { status: 404 });

  return NextResponse.json(intent);
}
