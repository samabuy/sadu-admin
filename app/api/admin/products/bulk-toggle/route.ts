import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { ids, is_active } = await req.json() as { ids: string[]; is_active: boolean };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active })
    .in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, count: ids.length });
}
