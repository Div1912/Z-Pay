import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSupportedChains, generateDepositInstructions } from '@/lib/cctp';

/**
 * GET /api/cctp/deposit-address
 *
 * Returns CCTP deposit instructions for the authenticated user.
 * Query params:
 *   chain (default: 'base') — source chain to bridge FROM
 *
 * Response:
 *   { instructions, intent_id, supported_chains }
 *
 * The intent_id is created in cctp_deposit_intents so the webhook can
 * poll for completion even if the user closes the browser.
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain') ?? 'base';

  // Fetch user's Stellar address and universal ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stellar_address, universal_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stellar_address) {
    return NextResponse.json({ error: 'Stellar wallet not found. Complete onboarding first.' }, { status: 404 });
  }

  const instructions = generateDepositInstructions(
    chain,
    profile.stellar_address,
    profile.universal_id ?? user.id
  );

  if (!instructions) {
    return NextResponse.json({
      error: `Chain "${chain}" is not supported. Supported: ${getSupportedChains().map(c => c.chain).join(', ')}`,
    }, { status: 400 });
  }

  // Create a pending intent record (the webhook will poll this)
  const { data: intent, error: intentError } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .insert({
      user_id:         user.id,
      stellar_address: profile.stellar_address,
      source_chain:    chain,
      status:          'pending',
    })
    .select('id')
    .single();

  if (intentError) {
    console.error('[cctp/deposit-address] Failed to create intent:', intentError.message);
  }

  return NextResponse.json({
    intent_id:        intent?.id ?? null,
    instructions,
    supported_chains: getSupportedChains().map(c => ({
      chain:       c.chain,
      displayName: c.chain === 'base' ? 'Base (Coinbase L2)' : 'Ethereum',
      domain:      c.domain,
      minUsdc:     c.minUsdc,
      maxUsdc:     c.maxUsdc,
    })),
    note: 'CCTP Stellar support is in active development by Circle. This interface is ready for when it launches.',
  });
}

/**
 * POST /api/cctp/deposit-address
 *
 * User submits their source-chain transaction hash after broadcasting the
 * depositForBurn() transaction. We update the intent and start watching
 * for Circle's attestation.
 *
 * Body: { intent_id, source_tx_hash, amount_usdc }
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { intent_id, source_tx_hash, amount_usdc } = await request.json();

  if (!intent_id || !source_tx_hash) {
    return NextResponse.json({ error: 'intent_id and source_tx_hash are required' }, { status: 400 });
  }

  if (amount_usdc !== undefined && (isNaN(amount_usdc) || amount_usdc <= 0)) {
    return NextResponse.json({ error: 'Invalid amount_usdc' }, { status: 400 });
  }

  // Verify the intent belongs to this user
  const { data: intent, error: fetchError } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .select('*')
    .eq('id', intent_id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !intent) {
    return NextResponse.json({ error: 'Intent not found' }, { status: 404 });
  }

  if (intent.status !== 'pending') {
    return NextResponse.json({ error: `Intent is already ${intent.status}` }, { status: 400 });
  }

  // Update intent with source tx hash — webhook will now poll for attestation
  const { error: updateError } = await supabaseAdmin
    .from('cctp_deposit_intents')
    .update({
      source_tx_hash,
      amount_usdc:  amount_usdc ?? null,
      status:       'submitted',
      updated_at:   new Date().toISOString(),
    })
    .eq('id', intent_id);

  if (updateError) {
    console.error('[cctp/deposit-address] Update error:', updateError.message);
    return NextResponse.json({ error: 'Failed to update intent' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Transaction submitted. We will credit your wallet once Circle attests the transfer (typically 5–20 minutes).',
    intent_id,
    status: 'submitted',
  });
}
