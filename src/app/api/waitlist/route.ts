import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_secret'))
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey
);

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function generateInviteCode(): string {
  // Format: ZPAY-XXXX-XXXX  (uppercase alphanumeric, easy to type)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0,O,1,I)
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ZPAY-${seg()}-${seg()}`;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from('waitlists')
      .select('id, invite_code, invite_sent')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      // Already registered — resend their code
      const code = existing.invite_code;
      if (code) {
        await sendInviteEmail(normalizedEmail, code);
        return NextResponse.json({ success: true, resent: true });
      }
      return NextResponse.json({ success: true, already: true });
    }

    // Generate a unique code
    let inviteCode = generateInviteCode();
    // Ensure uniqueness (retry on collision, extremely rare)
    for (let i = 0; i < 3; i++) {
      const { data: collision } = await supabase
        .from('waitlists')
        .select('id')
        .eq('invite_code', inviteCode)
        .single();
      if (!collision) break;
      inviteCode = generateInviteCode();
    }

    // Insert into waitlists table
    const { error: insertError } = await supabase
      .from('waitlists')
      .insert([{
        email: normalizedEmail,
        invite_code: inviteCode,
        invite_sent: true,
        created_at: new Date().toISOString(),
      }]);

    if (insertError) {
      // If already exists (unique constraint violation code 23505)
      const isDuplicate = 
        insertError.code === '23505' || 
        insertError.message?.includes('duplicate key') || 
        insertError.message?.includes('unique constraint') ||
        insertError.message?.includes('waitlists_email_key');

      if (isDuplicate) {
        return NextResponse.json({ success: true, already: true });
      }

      console.error('Waitlist insert error:', insertError);
      return NextResponse.json({ error: 'Unable to submit request. Please try again.' }, { status: 500 });
    }

    // Send the invite email
    await sendInviteEmail(normalizedEmail, inviteCode);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Waitlist API error:', err);
    return NextResponse.json({ error: 'Unable to submit request. Please try again.' }, { status: 500 });
  }
}

async function sendInviteEmail(email: string, code: string) {
  try {
    if (!resend) {
      console.log(`[Waitlist] Saved ${email} with code ${code} (Resend not configured)`);
      return;
    }
    await resend.emails.send({
      from: 'ZPAY <noreply@zpayrouter.me>',
      to: email,
      subject: `Your ZPAY Private Beta Access Code`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your ZPAY Beta Access Code</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#f5f5f5,#737373);border-radius:16px;line-height:56px;font-size:28px;font-weight:900;color:#000;letter-spacing:-2px;">Z</div>
      <div style="margin-top:12px;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">ZPAY</div>
    </div>

    <!-- Card -->
    <div style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:40px 32px;text-align:center;">

      <div style="display:inline-block;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);border-radius:100px;padding:6px 16px;margin-bottom:28px;">
        <span style="color:#34d399;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Private Beta Access</span>
      </div>

      <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">You're in. 🎉</h1>
      <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;">
        Welcome to the ZPAY private beta. Use the code below to create your account and start transacting on Stellar.
      </p>

      <!-- Code block -->
      <div style="background:#000;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px 24px;margin-bottom:32px;">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">Your Access Code</div>
        <div style="font-size:32px;font-weight:900;color:#D4AF37;letter-spacing:4px;font-family:'Courier New',monospace;">${code}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:12px;">Keep this code safe — it's yours to use once</div>
      </div>

      <!-- CTA Button -->
      <a href="https://zpayrouter.me/auth/signup?code=${code}" style="display:inline-block;background:#ffffff;color:#000000;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:100px;padding:16px 40px;">
        Activate My Account →
      </a>

      <p style="margin:28px 0 0;font-size:12px;color:rgba(255,255,255,0.2);">
        Or enter the code manually at <span style="color:rgba(255,255,255,0.4);">zpayrouter.me/auth/signup</span>
      </p>
    </div>

    <!-- Features -->
    <div style="display:flex;gap:16px;margin-top:24px;flex-wrap:wrap;">
      ${[
        ['⚡', '~3s Settlement', 'Stellar network speed'],
        ['🔒', 'Soroban Escrow', 'Trustless contracts'],
        ['🤖', 'AI Agents', 'X-402 autonomous payments'],
      ].map(([icon, title, sub]) => `
        <div style="flex:1;min-width:140px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:16px;text-align:center;">
          <div style="font-size:20px;margin-bottom:6px;">${icon}</div>
          <div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:2px;">${title}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.35);">${sub}</div>
        </div>
      `).join('')}
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;margin:0;">
        © ${new Date().getFullYear()} ZPAY Technologies · Built on Stellar<br>
        <a href="https://x.com/Zpayroute" style="color:rgba(255,255,255,0.3);text-decoration:none;">@Zpayroute</a>
      </p>
    </div>

  </div>
</body>
</html>
      `,
    });
  } catch (err) {
    console.error('Resend email error:', err);
    // Don't throw — entry is saved, email failure is non-fatal
  }
}
