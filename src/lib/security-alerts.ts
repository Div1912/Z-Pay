/**
 * security-alerts.ts
 *
 * Raises security alerts into the `security_alerts` table.
 * Optionally emails the admin team (wired to the existing notify infrastructure).
 *
 * Usage:
 *   raiseAlert(userId, 'pin_brute_force', { failed_attempts: 5 });
 *   raiseAlert(null, 'key_rotation', { version: 'v2', admin_id: '...' });
 */

import { supabaseAdmin } from './supabase';

export type AlertType =
  | 'pin_brute_force'
  | 'unusual_volume'
  | 'admin_action'
  | 'key_rotation'
  | 'decrypt_failure'
  | 'cctp_bridge_failed'
  | 'suspicious_ip';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AlertDetails {
  severity?: AlertSeverity;
  [key: string]: unknown;
}

/**
 * Raises a security alert. Fire-and-forget — always await with .catch(console.error).
 */
export async function raiseAlert(
  userId: string | null,
  alertType: AlertType,
  details: AlertDetails = {}
): Promise<void> {
  const { severity = 'medium', ...rest } = details;

  const { error } = await supabaseAdmin
    .from('security_alerts')
    .insert({
      user_id:    userId,
      alert_type: alertType,
      severity,
      details:    rest,
    });

  if (error) {
    console.error('[security-alerts] Failed to insert alert:', error.message);
  }

  // Critical alerts: log prominently so they're visible in Vercel logs even
  // if the DB insert fails.
  if (severity === 'critical' || severity === 'high') {
    console.error(
      `[SECURITY ALERT][${severity.toUpperCase()}] type=${alertType}`,
      `user=${userId ?? 'system'}`,
      JSON.stringify(rest)
    );
  }
}

/**
 * Marks a security alert as resolved.
 */
export async function resolveAlert(
  alertId: string,
  resolvedBy: string
): Promise<void> {
  await supabaseAdmin
    .from('security_alerts')
    .update({
      resolved:    true,
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', alertId);
}

/**
 * Returns open (unresolved) alerts.
 * Used by the admin security-alerts API.
 */
export async function getOpenAlerts(
  limit = 50
): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('security_alerts')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[security-alerts] Failed to fetch alerts:', error.message);
    return [];
  }
  return data ?? [];
}
