import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { getIntentStatus } from '@/lib/zub/attestation';

/**
 * GET /api/zub/intent/[id]
 *
 * Returns the current status of a spend intent.
 * Used by callers to poll for settlement confirmation.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Intent ID is required' }, { status: 400 });
  }

  const intent = await getIntentStatus(id, user.id);

  if (!intent) {
    return NextResponse.json({ error: 'Intent not found' }, { status: 404 });
  }

  return NextResponse.json({
    intent_id: id,
    status: intent.status,
    tx_hash: intent.tx_hash,
    error_message: intent.error_message,
  });
}
