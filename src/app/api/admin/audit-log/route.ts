import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdmin, adminForbiddenResponse } from '@/lib/admin';

/**
 * GET /api/admin/audit-log
 *
 * Returns paginated admin audit log entries.
 * Query params:
 *   page (default 1), limit (default 50, max 200)
 *   action (filter by action type)
 *   admin_id (filter by admin)
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!await isAdmin(user.id)) return adminForbiddenResponse();

  const { searchParams } = new URL(request.url);
  const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
  const limit  = Math.min(200, parseInt(searchParams.get('limit') ?? '50'));
  const action = searchParams.get('action');
  const adminId = searchParams.get('admin_id');
  const from = (page - 1) * limit;

  let query = supabaseAdmin
    .from('admin_audit_log')
    .select(`
      *,
      admin:profiles!admin_id(id, universal_id, full_name, email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (action)  query = query.eq('action', action);
  if (adminId) query = query.eq('admin_id', adminId);

  const { data, error, count } = await query;

  if (error) {
    console.error('[audit-log] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 });
  }

  return NextResponse.json({
    data:        data ?? [],
    total:       count ?? 0,
    page,
    limit,
    total_pages: Math.ceil((count ?? 0) / limit),
  });
}
