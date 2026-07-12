import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { createStellarAccount, registerUniversalId } from '@/lib/stellar';
import { notifyWelcome } from '@/lib/notify';
import { encryptSecret } from '@/lib/crypto';
import { authLimiter } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';

// Safely encrypt — if the env key is missing, store plaintext with a warning
// so that signup works but sends a loud server-side alert.
function safeEncryptSecret(secretKey: string): string {
  try {
    return encryptSecret(secretKey);
  } catch (err: any) {
    if (err.message?.includes('STELLAR_SECRET_ENCRYPTION_KEY')) {
      console.error(
        '[CRITICAL] STELLAR_SECRET_ENCRYPTION_KEY is not set in environment variables! ' +
        'Storing Stellar secret as PLAINTEXT — set the env var immediately and run migrate-encrypt-secrets.ts. ' +
        'See docs/key-lifecycle.md'
      );
      // Return plaintext so account creation succeeds; the missing env var alert above is sent to server logs.
      return secretKey;
    }
    throw err;
  }
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username, full_name, phone_number, app_pin, preferred_currency } = await request.json();
  if (!username || !full_name || !phone_number || !app_pin) {
    return NextResponse.json({ error: 'All fields are mandatory' }, { status: 400 });
  }

  // Rate-limit account creation
  if (!authLimiter.check(`claim:${user.id}`)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }

  // Check username availability
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('universal_id')
    .eq('universal_id', username)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
  }

  // Check phone number uniqueness
  const { data: phoneExists } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('phone_number', phone_number)
    .maybeSingle();

  if (phoneExists) {
    return NextResponse.json({ error: 'An account with this phone number already exists' }, { status: 400 });
  }

  try {
    // 1. Create Stellar account
    const { publicKey, secretKey } = await createStellarAccount();

    // 2. Register on Soroban
    const txHash = await registerUniversalId(username, publicKey);

    // 3. Encrypt secret and hash PIN before storing
    const encryptedSecret = safeEncryptSecret(secretKey);
    const hashedPin = await bcrypt.hash(app_pin, 10);

    // 4. Update Supabase profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        universal_id: username,
        stellar_address: publicKey,
        stellar_secret: encryptedSecret,
        full_name,
        phone_number,
        app_pin: hashedPin,
        preferred_currency: preferred_currency || 'USDC'
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Fire welcome email (fire-and-forget, works for both manual and Google signup)
    notifyWelcome(user.id, username, full_name).catch(console.error);

    return NextResponse.json({
      success: true,
      username,
      stellar_address: publicKey,
      tx_hash: txHash,
    });
  } catch (error: any) {
    console.error('Claim error:', error);
    // Never leak internal error messages (crypto config, DB internals, etc.) to the client
    const isSafeMessage = (
      typeof error.message === 'string' &&
      !error.message.includes('[crypto]') &&
      !error.message.includes('STELLAR_') &&
      !error.message.includes('SUPABASE') &&
      !error.message.includes('stack')
    );
    const clientMsg = isSafeMessage ? error.message : 'Account setup failed. Please try again or contact support.';
    return NextResponse.json({ error: clientMsg }, { status: 500 });
  }
}
