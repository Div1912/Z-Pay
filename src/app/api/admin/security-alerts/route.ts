import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { isAdmin, adminForbiddenResponse, logAdminAction, extractRequestMeta } from '@/lib/admin';
import { getOpenAlerts, resolveAlert } from '@/lib/security-alerts';

/**
 * GET /api/admin/security-alerts
 * Returns all open (unresolved) security alerts.
 */
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!await isAdmin(user.id)) return adminForbiddenResponse();

  const alerts = await getOpenAlerts(100);
  return NextResponse.json({ data: alerts, total: alerts.length });
}

/**
 * POST /api/admin/security-alerts
 * Body: { alert_id: string }  — marks alert as resolved.
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!await isAdmin(user.id)) return adminForbiddenResponse();

  const { alert_id } = await request.json();
  if (!alert_id) return NextResponse.json({ error: 'alert_id is required' }, { status: 400 });

  await resolveAlert(alert_id, user.id);

  const { ipAddress, userAgent } = extractRequestMeta(request);
  logAdminAction(user.id, {
    action:     'resolve_security_alert',
    targetId:   alert_id,
    targetType: 'alert',
    ipAddress,
    userAgent,
  }).catch(console.error);

  return NextResponse.json({ success: true });
}
