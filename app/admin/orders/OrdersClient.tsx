'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DeliveryBadge, PaymentBadge } from '@/components/StatusBadge';
import { Search, Download } from 'lucide-react';
import type { Role } from '@/lib/types';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  payment_method: string;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}

const inputStyle = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
};

export function OrdersClient({ orders, role }: { orders: Order[]; role: Role }) {
  const [search, setSearch] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !search ||
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_phone.includes(search) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase());
      const matchDelivery = deliveryFilter === 'all' || o.delivery_status === deliveryFilter;
      const matchPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;
      return matchSearch && matchDelivery && matchPayment;
    });
  }, [orders, search, deliveryFilter, paymentFilter]);

  function exportCsv() {
    const rows = [
      ['Order', 'Customer', 'Phone', 'Total', 'Payment Method', 'Payment Status', 'Delivery Status', 'Date'],
      ...filtered.map((o) => [
        o.order_number, o.customer_name, o.customer_phone,
        o.total, o.payment_method, o.payment_status, o.delivery_status,
        new Date(o.created_at).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sadu-orders-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{filtered.length} of {orders.length} orders</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input style={{ ...inputStyle, paddingLeft: 32, minWidth: 240 }} placeholder="Order #, name, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={inputStyle} value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value)}>
          <option value="all">All delivery</option>
          {['received','payment_confirmed','preparing','packed','courier_assigned','out_for_delivery','delivered','cancelled'].map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <select style={inputStyle} value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="all">All payment</option>
          {['pending','confirmed','failed','refunded'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Order #','Customer','Phone','Total','Method','Payment','Delivery','Date'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No orders found</td></tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs" style={{ color: 'var(--gold)' }}>#{o.order_number}</Link>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-primary)' }}>{o.customer_name}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{o.customer_phone}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>AED {Number(o.total).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{o.payment_method}</td>
                <td className="px-4 py-3"><PaymentBadge status={o.payment_status} /></td>
                <td className="px-4 py-3"><DeliveryBadge status={o.delivery_status as never} /></td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
