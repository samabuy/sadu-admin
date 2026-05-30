import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminOrManager } from '@/lib/auth';
import { StatCard } from '@/components/StatCard';
import { DeliveryBadge, PaymentBadge } from '@/components/StatusBadge';
import { ShoppingBag, TrendingUp, Truck, Package, Plus, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  await requireAdminOrManager();
  const supabase = createAdminClient();

  const today = new Date().toISOString().split('T')[0];

  const [
    { count: todayOrders },
    { data: revenueData },
    { count: pendingDeliveries },
    { count: activeProducts },
    { data: recentOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('orders').select('total').eq('payment_status', 'confirmed'),
    supabase.from('orders').select('*', { count: 'exact', head: true })
      .in('delivery_status', ['received', 'payment_confirmed', 'preparing', 'packed', 'courier_assigned', 'out_for_delivery']),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('id,order_number,customer_name,total,payment_status,delivery_status,created_at')
      .order('created_at', { ascending: false }).limit(10),
    supabase.from('products').select('id,name_en,name_ar').eq('is_active', true).limit(5),
  ]);

  const totalRevenue = revenueData?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Today's Orders" value={todayOrders ?? 0} icon={<ShoppingBag size={20} />} />
        <StatCard label="Total Revenue" value={`AED ${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20} />} />
        <StatCard label="Pending Deliveries" value={pendingDeliveries ?? 0} icon={<Truck size={20} />} />
        <StatCard label="Active Products" value={activeProducts ?? 0} icon={<Package size={20} />} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent orders */}
        <div
          className="col-span-2 rounded-xl"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs" style={{ color: 'var(--gold)' }}>View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Order', 'Customer', 'Total', 'Payment', 'Delivery'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                      No orders yet
                    </td>
                  </tr>
                )}
                {recentOrders?.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs" style={{ color: 'var(--gold)' }}>
                        #{order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{order.customer_name}</td>
                    <td className="px-6 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      AED {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-3"><PaymentBadge status={order.payment_status} /></td>
                    <td className="px-6 py-3"><DeliveryBadge status={order.delivery_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg w-full"
                style={{ backgroundColor: 'var(--gold)', color: '#000', fontWeight: 600 }}
              >
                <Plus size={16} /> Add Product
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg w-full"
                style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}
              >
                <ShoppingBag size={16} /> View All Orders
              </Link>
            </div>
          </div>

          {/* Low stock */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Products (No Stock)</h2>
            </div>
            {lowStock?.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>All good</p>
            ) : (
              <div className="space-y-2">
                {lowStock?.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}`}
                    className="block text-xs truncate"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {p.name_en}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
