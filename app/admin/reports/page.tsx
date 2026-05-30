import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { ReportsClient } from './ReportsClient';

export default async function ReportsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: revenueByDay },
    { data: topProducts },
    { data: byPaymentMethod },
    { data: byEmirate },
  ] = await Promise.all([
    supabase.from('orders')
      .select('created_at,total')
      .gte('created_at', thirtyDaysAgo)
      .eq('payment_status', 'confirmed')
      .order('created_at', { ascending: true }),
    supabase.from('orders')
      .select('items')
      .eq('payment_status', 'confirmed'),
    supabase.from('orders')
      .select('payment_method,total')
      .eq('payment_status', 'confirmed'),
    supabase.from('orders')
      .select('emirate,total')
      .eq('payment_status', 'confirmed'),
  ]);

  // Aggregate revenue by day
  const dailyRevenue: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyRevenue[d] = 0;
  }
  revenueByDay?.forEach((o) => {
    const d = o.created_at.split('T')[0];
    if (d in dailyRevenue) dailyRevenue[d] = (dailyRevenue[d] ?? 0) + Number(o.total);
  });

  // Top products from order items
  const productRevenue: Record<string, { name: string; revenue: number }> = {};
  topProducts?.forEach((order) => {
    const items = Array.isArray(order.items) ? order.items as Record<string, unknown>[] : [];
    items.forEach((item) => {
      const id = String(item.product_id ?? '');
      const name = String(item.product_name_en ?? 'Unknown');
      if (!productRevenue[id]) productRevenue[id] = { name, revenue: 0 };
      productRevenue[id]!.revenue += Number(item.total_price ?? 0);
    });
  });
  const topProductsList = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // By payment method
  const paymentMethodData: Record<string, number> = {};
  byPaymentMethod?.forEach((o) => {
    const m = String(o.payment_method ?? 'unknown');
    paymentMethodData[m] = (paymentMethodData[m] ?? 0) + Number(o.total);
  });

  // By emirate
  const emirateData: Record<string, number> = {};
  byEmirate?.forEach((o) => {
    const e = String(o.emirate ?? 'Unknown');
    emirateData[e] = (emirateData[e] ?? 0) + Number(o.total);
  });

  return (
    <ReportsClient
      dailyRevenue={Object.entries(dailyRevenue).map(([date, total]) => ({ date, total }))}
      topProducts={topProductsList}
      paymentMethods={Object.entries(paymentMethodData).map(([name, value]) => ({ name, value }))}
      emirates={Object.entries(emirateData).map(([name, value]) => ({ name, value }))}
    />
  );
}
