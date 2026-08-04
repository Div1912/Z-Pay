import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code is required' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    const { data, error } = await supabase
      .from('waitlists')
      .select('id, email, invite_code, used')
      .eq('invite_code', normalizedCode)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, error: 'Invalid access code' }, { status: 200 });
    }

    if (data.used) {
      return NextResponse.json({ valid: false, error: 'This code has already been used' }, { status: 200 });
    }

    return NextResponse.json({ valid: true, email: data.email });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
