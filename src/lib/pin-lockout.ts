/**
 * pin-lockout.ts
 *
 * Progressive PIN lockout stored in Supabase (persists across server restarts).
 *
 * Lockout schedule:
 *   1-4 fails  : warning only
 *   5 fails    : 15-minute lockout
 *   10 fails   : 1-hour lockout
 *   15 fails   : 6-hour lockout
 *   20+ fails  : 24-hour lockout  (raises security alert)
 *
 * On success  : lockout record is cleared entirely.
 * The check is always done server-side before bcrypt.compare() so even
 * timing-based enumeration is blocked.
 */

import { supabaseAdmin } from './supabase';
import { raiseAlert } from './security-alerts';

export interface PinLockoutStatus {
  locked: boolean;
  retryAfterMs: number;     // 0 if not locked
  attemptsLeft: number;     // until next lockout tier
  failedAttempts: number;
  lockedUntil?: Date;
}

// Progressive lockout thresholds: [fail_count, lockout_duration_ms]
const LOCKOUT_TIERS: [number, number][] = [
  [5,  15 * 60 * 1000],       //  5 fails → 15 min
  [10, 60 * 60 * 1000],       // 10 fails → 1 hour
  [15, 6  * 60 * 60 * 1000],  // 15 fails → 6 hours
  [20, 24 * 60 * 60 * 1000],  // 20 fails → 24 hours
];

function getLockoutDuration(failedAttempts: number): number {
  let duration = 0;
  for (const [threshold, ms] of LOCKOUT_TIERS) {
    if (failedAttempts >= threshold) duration = ms;
  }
  return duration;
}

function getAttemptsLeftBeforeNextTier(failedAttempts: number): number {
  for (const [threshold] of LOCKOUT_TIERS) {
    if (failedAttempts < threshold) return threshold - failedAttempts;
  }
  return 0; // Maxed out
}

/**
 * Checks the current lockout status for a user.
 * Call this BEFORE verifying the PIN.
 */
export async function checkPinLockout(userId: string): Promise<PinLockoutStatus> {
  const { data, error } = await supabaseAdmin
    .from('pin_lockouts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[pin-lockout] DB error checking lockout:', error.message);
    // Fail open — don't block user on DB errors (log the error separately)
    return { locked: false, retryAfterMs: 0, attemptsLeft: 5, failedAttempts: 0 };
  }

  if (!data) {
    return { locked: false, retryAfterMs: 0, attemptsLeft: 5, failedAttempts: 0 };
  }

  const now = new Date();
  if (data.locked_until && new Date(data.locked_until) > now) {
    const retryAfterMs = new Date(data.locked_until).getTime() - now.getTime();
    return {
      locked: true,
      retryAfterMs,
      attemptsLeft: 0,
      failedAttempts: data.failed_attempts,
      lockedUntil: new Date(data.locked_until),
    };
  }

  // Lockout expired — treat as unlocked but keep the count
  return {
    locked: false,
    retryAfterMs: 0,
    attemptsLeft: getAttemptsLeftBeforeNextTier(data.failed_attempts),
    failedAttempts: data.failed_attempts,
  };
}

/**
 * Records a failed PIN attempt. Applies a lockout if a threshold is crossed.
 * Returns the updated lockout status.
 */
export async function recordPinFailure(userId: string): Promise<PinLockoutStatus> {
  // Upsert: increment failed_attempts, possibly set locked_until
  const { data: existing } = await supabaseAdmin
    .from('pin_lockouts')
    .select('failed_attempts')
    .eq('user_id', userId)
    .maybeSingle();

  const newCount = (existing?.failed_attempts ?? 0) + 1;
  const lockDuration = getLockoutDuration(newCount);
  const lockedUntil = lockDuration > 0
    ? new Date(Date.now() + lockDuration).toISOString()
    : null;

  await supabaseAdmin
    .from('pin_lockouts')
    .upsert(
      {
        user_id:         userId,
        failed_attempts: newCount,
        locked_until:    lockedUntil,
        last_attempt_at: new Date().toISOString(),
        updated_at:      new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  // Raise a security alert on serious lockout tier (≥5 fails)
  if (newCount === 5 || newCount === 10 || newCount === 15 || newCount === 20) {
    raiseAlert(userId, 'pin_brute_force', {
      failed_attempts: newCount,
      locked_until: lockedUntil,
      severity: newCount >= 20 ? 'critical' : newCount >= 10 ? 'high' : 'medium',
    }).catch(console.error);
  }

  const status: PinLockoutStatus = {
    locked: lockDuration > 0,
    retryAfterMs: lockDuration,
    attemptsLeft: Math.max(0, getAttemptsLeftBeforeNextTier(newCount)),
    failedAttempts: newCount,
  };
  if (lockedUntil) status.lockedUntil = new Date(lockedUntil);

  return status;
}

/**
 * Clears the lockout record on successful PIN entry.
 */
export async function clearPinLockout(userId: string): Promise<void> {
  await supabaseAdmin
    .from('pin_lockouts')
    .delete()
    .eq('user_id', userId);
}

/**
 * Formats a retry-after duration into a human-readable string.
 */
export function formatLockoutDuration(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}
