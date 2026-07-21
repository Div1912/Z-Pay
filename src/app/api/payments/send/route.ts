import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPayment, PLATFORM_MERCHANT_WALLET } from '@/lib/stellar';
import { getExchangeRate } from '@/lib/fx-service';
import { notifyPayment } from '@/lib/notify';
import { logInfo, logError, logWarn } from '@/lib/logger';
import { safeDecryptSecret } from '@/lib/crypto';
import { paymentLimiter, authLimiter } from '@/lib/rate-limit';
import { checkPinLockout, recordPinFailure, clearPinLockout, formatLockoutDuration } from '@/lib/pin-lockout';
import bcrypt from 'bcryptjs';

const ROUTE = '/api/payments/send';

// Daily send limit per user (in XLM). Approx ₹50,000 at current rates.
const DAILY_LIMIT_XLM = 3000;

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting: max 10 payment attempts per user per minute
  if (!paymentLimiter.check(user.id)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before trying again.' },
      { status: 429 }
    );
  }

  const { recipient, amount, note, pin, purpose, currency, memo: customMemo } = await request.json();
  if (!recipient || !amount) {
    return NextResponse.json({ error: 'Recipient and amount are required' }, { status: 400 });
  }

  const { data: senderProfile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!senderProfile?.stellar_secret) {
    return NextResponse.json({ error: 'Sender Stellar account not found' }, { status: 404 });
  }

  if (senderProfile.app_pin) {
    if (!pin) {
      return NextResponse.json({ error: 'PIN is required to authorize payment' }, { status: 400 });
    }
    // Rate-limit PIN attempts to prevent brute-force
    if (!authLimiter.check(`pin:${user.id}`)) {
      return NextResponse.json({ error: 'Too many PIN attempts. Please wait a minute.' }, { status: 429 });
    }

    // 5. PIN verification with progressive lockout
    const lockoutStatus = await checkPinLockout(user.id);
    if (lockoutStatus.locked) {
      return NextResponse.json({
        error: `Too many failed PIN attempts. Please try again in ${formatLockoutDuration(lockoutStatus.retryAfterMs)}.`,
        locked_until: lockoutStatus.lockedUntil,
      }, { status: 429 });
    }

    const isHashedPin = senderProfile.app_pin.startsWith('$2');
    const pinValid = isHashedPin
      ? await bcrypt.compare(pin, senderProfile.app_pin)
      : senderProfile.app_pin === pin;

    if (!pinValid) {
      const updated = await recordPinFailure(user.id);
      const msg = updated.locked
        ? `Incorrect PIN. Your account is locked for ${formatLockoutDuration(updated.retryAfterMs)}.`
        : `Incorrect PIN. ${updated.attemptsLeft} attempt${updated.attemptsLeft !== 1 ? 's' : ''} remaining before lockout.`;
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    // Correct PIN — clear lockout and silently upgrade plaintext to bcrypt
    await clearPinLockout(user.id);
    if (!isHashedPin) {
      const hashed = await bcrypt.hash(pin, 10);
      await supabaseAdmin.from('profiles').update({ app_pin: hashed }).eq('id', user.id);
    }
    authLimiter.reset(`pin:${user.id}`);
  }

  try {
    let recipientAddress = recipient;
    let recipientProfile = null;
    let isCrossChain = false;
    let crossChainDestination = 'ethereum';

    if (recipient.startsWith('0x') && recipient.length === 42) {
      isCrossChain = true;
      // We could detect base vs ethereum here based on user input, but defaulting to ethereum
    } else if (recipient.includes('@Zp') || !recipient.startsWith('G')) {
      const username = recipient.replace('@Zp', '');
      const { data: recProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('universal_id', username)
        .single();

      if (!recProfile) {
        return NextResponse.json({ error: 'Recipient Universal ID not found' }, { status: 404 });
      }
      recipientAddress = recProfile.stellar_address;
      recipientProfile = recProfile;
    }

    if (recipientProfile?.id === senderProfile.id || recipientAddress === senderProfile.stellar_address) {
      return NextResponse.json({ error: 'You cannot send money to yourself' }, { status: 400 });
    }

    const { data: recentTx } = await supabaseAdmin
      .from('transactions')
      .select('id')
      .eq('sender_id', senderProfile.id)
      .eq('recipient_id', recipientProfile?.id || null)
      .eq('amount', parseFloat(amount))
      .gt('created_at', new Date(Date.now() - 10000).toISOString())
      .limit(1);

    if (recentTx && recentTx.length > 0) {
      return NextResponse.json({ error: 'Possible duplicate transaction detected. Please wait 10 seconds.' }, { status: 400 });
    }

    const sourceCurrency = currency || senderProfile.preferred_currency || 'XLM';
    const xlmRate = await getExchangeRate(sourceCurrency, 'XLM');
    const xlmAmount = (parseFloat(amount) * xlmRate).toFixed(7);

    // Daily limit check: sum today's outgoing XLM and enforce cap
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data: todayTxs } = await supabaseAdmin
      .from('transactions')
      .select('note')
      .eq('sender_id', senderProfile.id)
      .gte('created_at', todayStart.toISOString());

    const todayXlmSent = (todayTxs || []).reduce((sum, tx) => {
      const match = tx.note?.match(/^XLM:(\d+\.?\d*)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);

    if (todayXlmSent + parseFloat(xlmAmount) > DAILY_LIMIT_XLM) {
      return NextResponse.json(
        { error: `Daily send limit reached (${DAILY_LIMIT_XLM} XLM). Try again tomorrow.` },
        { status: 400 }
      );
    }

    const senderName = senderProfile.universal_id || 'unknown';
    const recipientName = recipientProfile?.universal_id || recipient.replace('@Zp', '');
    let memo = customMemo;
    if (!memo) {
      if (purpose) {
        memo = `${purpose}|${senderName}>${recipientName}`;
      } else if (note) {
        memo = `${note}|${senderName}>${recipientName}`;
      } else {
        memo = `${senderName}>${recipientName}`;
      }
      memo = memo.substring(0, 28);
    }

    const secret = safeDecryptSecret(senderProfile.stellar_secret);
    if (!secret) {
      return NextResponse.json({ error: 'Wallet temporarily unavailable. Please try again shortly.' }, { status: 503 });
    }

    if (isCrossChain) {
      // 1. Send the USDC/XLM to the Z-Pay Treasury wallet to simulate the burn.
      const txHash = await sendPayment(
        secret,
        PLATFORM_MERCHANT_WALLET,
        xlmAmount,
        { memo: 'CCTP-BURN' }
      );

      // 2. Insert into cctp_outbound_intents
      await supabaseAdmin.from('cctp_outbound_intents').insert({
        user_id: user.id,
        sender_stellar_address: senderProfile.stellar_address,
        recipient_evm_address: recipientAddress,
        amount_usdc: parseFloat(amount),
        destination_chain: crossChainDestination,
        status: 'pending_burn',
        stellar_burn_tx_hash: txHash
      });

      // 3. Insert transaction history record
      await supabaseAdmin.from('transactions').insert({
        sender_id: senderProfile.id,
        sender_universal_id: senderProfile.universal_id,
        recipient_universal_id: recipientAddress,
        amount: parseFloat(amount),
        currency: sourceCurrency,
        tx_hash: txHash,
        status: 'completed',
        note: `Cross-Chain Transfer to ${recipientAddress.substring(0, 6)}...`,
        purpose: purpose || 'CCTP Outbound',
      });

      logInfo('cctp_outbound_success', {
        route: ROUTE,
        user_id: user.id,
        meta: { amount, currency: sourceCurrency, tx_hash: txHash, recipient: recipientAddress },
      }).catch(() => {});

      return NextResponse.json({ 
        success: true, 
        tx_hash: txHash,
        amount_sent: parseFloat(amount),
        currency: sourceCurrency,
        xlm_amount: parseFloat(xlmAmount)
      });
    }

    const txHash = await sendPayment(
      secret,
      recipientAddress,
      xlmAmount,
      { memo }
    );

    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        sender_id: senderProfile.id,
        recipient_id: recipientProfile?.id || null,
        sender_universal_id: senderProfile.universal_id,
        recipient_universal_id: recipientProfile?.universal_id || recipient,
        amount: parseFloat(amount),
        currency: sourceCurrency,
        tx_hash: txHash,
        status: 'completed',
        note: `XLM:${xlmAmount}`,
        purpose: purpose || null,
      });

    if (txError) console.error('History recording error:', txError);

    // Fire-and-forget email notifications to both parties
    if (recipientProfile?.id) {
      await notifyPayment({
        senderId: senderProfile.id,
        recipientId: recipientProfile.id,
        senderUniversalId: senderProfile.universal_id || '',
        recipientUniversalId: recipientProfile.universal_id || '',
        amount: parseFloat(amount),
        currency: sourceCurrency,
        txHash,
        note: note || purpose || undefined,
      }).catch(console.error);
    }

    logInfo('payment_success', {
      route: ROUTE,
      user_id: user.id,
      meta: { amount, currency: sourceCurrency, xlm_amount: xlmAmount, tx_hash: txHash, recipient: recipientName },
    }).catch(() => {});

    return NextResponse.json({ 
      success: true, 
      tx_hash: txHash,
      amount_sent: parseFloat(amount),
      currency: sourceCurrency,
      xlm_amount: parseFloat(xlmAmount)
    });
  } catch (error: any) {
    let errMsg = error.message || 'Payment failed';
    
    // Extract precise Stellar network errors if available
    if (error.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      if (codes.operations && codes.operations.includes('op_no_destination')) {
        errMsg = 'The receiving wallet is not active yet. You must send at least 1 XLM (approx ₹180) to activate it for the first time.';
      } else if (codes.operations && codes.operations.includes('op_underfunded')) {
        errMsg = 'You do not have enough XLM available to cover this payment and the network reserve.';
      } else if (codes.operations && codes.operations.includes('op_low_reserve')) {
        errMsg = 'The receiving wallet would drop below the minimum network reserve.';
      } else {
        errMsg = `Stellar Network Error: ${codes.transaction || codes.operations?.join(', ')}`;
      }
    }

    logError('payment_failed', error, { route: ROUTE, user_id: user.id }).catch(() => {});
    console.error('Payment error:', error.response?.data || error);
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }
}
