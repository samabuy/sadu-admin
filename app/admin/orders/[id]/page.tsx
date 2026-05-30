import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminOrManager } from '@/lib/auth';
import { OrderDetailClient } from './OrderDetailClient';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await requireAdminOrManager();
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (!order) notFound();

  return <OrderDetailClient order={order} role={session.role} />;
}
