import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminOrManager } from '@/lib/auth';
import { OrdersClient } from './OrdersClient';

export default async function OrdersPage() {
  const session = await requireAdminOrManager();
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('id,order_number,customer_name,customer_phone,total,payment_method,payment_status,delivery_status,created_at')
    .order('created_at', { ascending: false });

  return <OrdersClient orders={orders ?? []} role={session.role} />;
}
