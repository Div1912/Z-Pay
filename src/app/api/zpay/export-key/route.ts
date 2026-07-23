import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { safeDecryptSecret } from '@/lib/crypto';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optionally verify a PIN in the request body for extra security
  const { pin } = await request.json().catch(() => ({ pin: null }));

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('app_pin, stellar_secret')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  if (data.app_pin) {
    const dbPin = String(data.app_pin).trim();
    const providedPin = String(pin || '').trim();
    if (providedPin !== dbPin) {
      console.log('PIN mismatch. DB:', dbPin, 'Provided:', providedPin);
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 403 });
    }
  }

  if (!data.stellar_secret) {
    return NextResponse.json({ error: 'No secret key found' }, { status: 404 });
  }

  const decryptedKey = safeDecryptSecret(data.stellar_secret);

  if (!decryptedKey) {
    return NextResponse.json({ error: 'Failed to decrypt secret key (missing encryption key)' }, { status: 500 });
  }

  return NextResponse.json({ secretKey: decryptedKey });
}
