import { NextRequest, NextResponse } from 'next/server';
import { processBatch, getReconciliationStatus } from '@/lib/zub/reconciliation';
import { checkSolvency } from '@/lib/zub/ledger';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * POST /api/zub/reconciliation
 *
 * Triggers a reconciliation batch run.
 * Called by Vercel Cron or an external cron job every 60 seconds.
 * Protected by CRON_SECRET.
 *
 * GET /api/zub/reconciliation
 * Returns the current status of the reconciliation queue (monitoring).
 */
export async function POST(req: NextRequest) {
  // Protect with CRON_SECRET if set in env
  if (CRON_SECRET) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const result = await processBatch();
    const solvency = await checkSolvency();

    return NextResponse.json({
      success: true,
      batch: result,
      solvency: {
        solvent: solvency.solvent,
        total_ledger_usdc: solvency.total_ledger_usdc,
        total_vault_reserve_usdc: solvency.total_vault_reserve_usdc,
        deficit_usdc: solvency.deficit_usdc,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[zub/reconciliation] Batch error:', err.message);
    return NextResponse.json(
      { error: 'Reconciliation batch failed', details: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Protect with CRON_SECRET if set
  if (CRON_SECRET) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const [status, solvency] = await Promise.all([
    getReconciliationStatus(),
    checkSolvency(),
  ]);

  return NextResponse.json({
    queue: status,
    solvency: {
      solvent: solvency.solvent,
      total_ledger_usdc: solvency.total_ledger_usdc,
      total_vault_reserve_usdc: solvency.total_vault_reserve_usdc,
      deficit_usdc: solvency.deficit_usdc,
    },
    timestamp: new Date().toISOString(),
  });
}
