import { NextResponse } from 'next/server';
import { processPendingCctpIntents } from '@/lib/cctp';

/**
 * POST /api/cctp/webhook
 *
 * Background job that processes all pending CCTP deposit intents.
 * Should be called every 2 minutes via a Vercel Cron Job or external cron.
 *
 * Vercel cron config (in vercel.json):
 * {
 *   "crons": [
 *     { "path": "/api/cctp/webhook", "schedule": "every 2 minutes" }
 *   ]
 * }
 *
 * Security: protected by CRON_SECRET — set this as an env var and include
 * it as a Bearer token in the cron request header.
 */
export async function POST(request: Request) {
  // Validate cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (token !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    // In development, warn but allow through
    if (process.env.NODE_ENV === 'production') {
      console.warn('[cctp/webhook] CRON_SECRET not set — webhook is publicly accessible!');
    }
  }

  const startedAt = Date.now();
  console.log('[cctp/webhook] Starting CCTP intent processing...');

  const result = await processPendingCctpIntents();

  const duration = Date.now() - startedAt;
  console.log(`[cctp/webhook] Done in ${duration}ms:`, result);

  return NextResponse.json({
    success:   true,
    duration_ms: duration,
    ...result,
  });
}

/**
 * GET /api/cctp/webhook
 * Health check — can be called to confirm the endpoint is reachable.
 */
export async function GET() {
  return NextResponse.json({
    status:    'ok',
    service:   'Z-Pay CCTP Bridge Webhook',
    timestamp: new Date().toISOString(),
  });
}
