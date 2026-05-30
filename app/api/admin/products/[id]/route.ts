import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin();
  if (auth instanceof NextResponse) return auth;
  if (auth.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Safety check — refuse if the product appears in any order
  const { count } = await supabase
    .from('order_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', id);

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: 'Product has orders', count },
      { status: 409 },
    );
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
