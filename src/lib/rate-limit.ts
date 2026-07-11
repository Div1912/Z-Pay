/**
 * rate-limit.ts – In-memory sliding-window rate limiter.
 *
 * Usage:
 *   const limiter = createRateLimiter(10, 60_000); // 10 requests per 60 s
 *   if (!limiter.check(userId)) return 429;
 *
 * NOTE: This is per-process. On multi-instance deployments (e.g. multiple
 * Vercel edge replicas), use a Redis-based limiter instead. For the current
 * single-region deployment this is sufficient.
 */

interface LimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  /** Returns true if the request is allowed, false if rate limit exceeded. */
  check(key: string): boolean;
  /** Reset the counter for a key (e.g. after a successful auth). */
  reset(key: string): void;
}

/**
 * Creates a new rate limiter instance.
 * @param maxRequests Maximum number of requests allowed per window.
 * @param windowMs    Window duration in milliseconds.
 */
export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  const store = new Map<string, LimitEntry>();

  // Periodic cleanup to prevent unbounded memory growth
  // (runs every 5 minutes, removes expired entries)
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (now > entry.resetAt) store.delete(key);
      }
    }, 5 * 60_000).unref?.();
  }

  return {
    check(key: string): boolean {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }

      if (entry.count >= maxRequests) return false;
      entry.count++;
      return true;
    },

    reset(key: string): void {
      store.delete(key);
    },
  };
}

// ── Pre-built limiters for common use-cases ──────────────────────────────────

/** Auth-adjacent actions: PIN changes, claim, etc. – 5 per minute per user */
export const authLimiter = createRateLimiter(5, 60_000);

/** Payment sends – 10 per minute per user */
export const paymentLimiter = createRateLimiter(10, 60_000);

/** General API reads – 60 per minute per user */
export const readLimiter = createRateLimiter(60, 60_000);
