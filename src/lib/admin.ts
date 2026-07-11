/**
 * admin.ts – Server-side admin role check + admin audit logging.
 *
 * Replaces the hardcoded ADMIN_EMAILS arrays spread across admin routes.
 * Admin status is stored in profiles.is_admin (boolean, default false).
 *
 * Run supabase_admin_role_migration.sql  → adds is_admin column
 * Run supabase_security_migration.sql    → adds admin_audit_log table
 */

import { supabaseAdmin } from './supabase';

// ── Role check ────────────────────────────────────────────────────────────────

/**
 * Returns true if the given user ID has admin privileges.
 * Uses the service-role client so RLS doesn't block the lookup.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error || !data) return false;
  return data.is_admin === true;
}

/**
 * Convenience helper that returns a 403 JSON response object
 * for use in route handlers.
 */
export function adminForbiddenResponse() {
  return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });
}

// ── Audit logging ─────────────────────────────────────────────────────────────

export interface AdminActionLog {
  action:      string;        // e.g. 'resolve_dispute', 'view_logs', 'ban_user'
  targetId?:   string;        // ID of the affected resource
  targetType?: string;        // 'contract' | 'user' | 'transaction' | 'alert'
  details?:    Record<string, unknown>;
  ipAddress?:  string;
  userAgent?:  string;
}

/**
 * Logs an admin action to the admin_audit_log table.
 * Call this after every successful admin operation.
 * Fire-and-forget: await logAdminAction(...).catch(console.error)
 */
export async function logAdminAction(
  adminId: string,
  log: AdminActionLog
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('admin_audit_log')
    .insert({
      admin_id:    adminId,
      action:      log.action,
      target_id:   log.targetId ?? null,
      target_type: log.targetType ?? null,
      details:     log.details ?? {},
      ip_address:  log.ipAddress ?? null,
      user_agent:  log.userAgent ?? null,
    });

  if (error) {
    // Log to console so it's visible in Vercel logs even if DB insert fails
    console.error('[admin-audit] Failed to write audit log:', error.message, log);
  }
}

/**
 * Helper to extract IP and User-Agent from a Next.js Request object.
 */
export function extractRequestMeta(req: Request): { ipAddress?: string; userAgent?: string } {
  const forwarded = req.headers.get('x-forwarded-for');
  const ipAddress = forwarded ? forwarded.split(',')[0].trim() : undefined;
  const userAgent = req.headers.get('user-agent') ?? undefined;
  return { ipAddress, userAgent };
}
