import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifySecurityEvent } from '@/lib/notify';
import { authLimiter } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate-limit PIN changes to prevent brute-force
  if (!authLimiter.check(`pin-change:${user.id}`)) {
    return NextResponse.json({ error: 'Too many PIN change attempts. Please wait a minute.' }, { status: 429 });
  }

  const { current_pin, new_pin } = await request.json();

  if (!new_pin || new_pin.length !== 4 || !/^\d{4}$/.test(new_pin)) {
    return NextResponse.json({ error: 'PIN must be exactly 4 digits' }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('app_pin')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Verify existing PIN if one is set (supports both plaintext legacy and bcrypt hashed)
  if (profile.app_pin) {
    if (!current_pin) {
      return NextResponse.json({ error: 'Current PIN is required to change PIN' }, { status: 400 });
    }
    const isHashedPin = profile.app_pin.startsWith('$2');
    const currentValid = isHashedPin
      ? await bcrypt.compare(current_pin, profile.app_pin)
      : profile.app_pin === current_pin;
    if (!currentValid) {
      return NextResponse.json({ error: 'Current PIN is incorrect' }, { status: 401 });
    }
  }

  // Always store the new PIN as a bcrypt hash
  const hashedPin = await bcrypt.hash(new_pin, 10);

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ app_pin: hashedPin })
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update PIN' }, { status: 500 });
  }

  authLimiter.reset(`pin-change:${user.id}`);

  // Fire security alert (fire-and-forget)
  notifySecurityEvent(user.id, 'pin_changed').catch(console.error);

  return NextResponse.json({ success: true, message: 'PIN updated successfully' });
}
