import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const { is_active } = await req.json() as { is_active: boolean };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
