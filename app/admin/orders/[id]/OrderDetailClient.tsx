'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DeliveryBadge, PaymentBadge } from '@/components/StatusBadge';
import { useToast } from '@/components/Toast';
import { Loader2, Printer } from 'lucide-react';
import type { DeliveryStatus, Role } from '@/lib/types';
import { DELIVERY_STATUS_LABELS } from '@/lib/types';

const inputStyle = {
  backgroundColor: 'var(--main-bg)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px',
  fontSize: 13, outline: 'none', width: '100%',
};
const cardStyle = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 };

export function OrderDetailClient({ order, role }: { order: Record<string, unknown>; role: Role }) {
  const router = useRouter();
  const { show, ToastComponent } = useToast();
  const supabase = createClient();

  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(order.delivery_status as DeliveryStatus);
  const [refundNotes, setRefundNotes] = useState(String(order.refund_notes ?? ''));
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function saveDelivery() {
    setSaving(true);
    const { error } = await supabase.from('orders')
      .update({ delivery_status: deliveryStatus, refund_notes: refundNotes })
      .eq('id', order.id as string);
    setSaving(false);
    error ? show(error.message, 'error') : show('Order updated');
  }

  async function cancelOrder() {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    const { error } = await supabase.from('orders')
      .update({ delivery_status: 'cancelled' })
      .eq('id', order.id as string);
    setCancelling(false);
    if (error) { show(error.message, 'error'); return; }
    show('Order cancelled');
    router.refresh();
  }

  const items = Array.isArray(order.items) ? order.items as Record<string, unknown>[] : [];

  return (
    <div className="p-8 max-w-5xl">
      {ToastComponent}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.back()} className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>← Back</button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Order #{String(order.order_number)}</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{new Date(String(order.created_at)).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>
            <Printer size={14} /> Print
          </button>
          {role === 'admin' && order.delivery_status !== 'cancelled' && (
            <button onClick={cancelOrder} disabled={cancelling} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'rgba(181,71,71,0.15)', color: 'var(--error)' }}>
              {cancelling && <Loader2 size={14} className="animate-spin" />} Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Customer info */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-xs mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Customer</h2>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{String(order.customer_name)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{String(order.customer_phone)}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{String(order.customer_email ?? '—')}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{String(order.delivery_address ?? '—')}</p>
          <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{String(order.emirate ?? '—')}</p>
        </div>

        {/* Payment info */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-xs mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Payment</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-secondary)' }}>Method</span>
              <span className="capitalize" style={{ color: 'var(--text-primary)' }}>{String(order.payment_method)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-secondary)' }}>Status</span>
              <PaymentBadge status={String(order.payment_status)} />
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ color: 'var(--text-primary)' }}>AED {Number(order.subtotal ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
              <span style={{ color: 'var(--text-primary)' }}>AED {Number(order.delivery_fee ?? 0).toLocaleString()}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Discount</span>
                <span style={{ color: 'var(--success)' }}>-AED {Number(order.discount_amount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1" style={{ borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Total</span>
              <span style={{ color: 'var(--gold)' }}>AED {Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery status */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-xs mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Delivery Status</h2>
          <div className="mb-2">
            <DeliveryBadge status={deliveryStatus} />
          </div>
          <select
            style={inputStyle}
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
            className="mb-3"
          >
            {(Object.entries(DELIVERY_STATUS_LABELS) as [DeliveryStatus, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Refund Notes</label>
          <textarea rows={2} style={inputStyle} value={refundNotes} onChange={(e) => setRefundNotes(e.target.value)} className="mb-3" />
          <button
            onClick={saveDelivery} disabled={saving}
            className="flex items-center gap-2 w-full justify-center py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--gold)', color: '#000' }}
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {saving ? 'Saving…' : 'Update'}
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={cardStyle}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Items ({items.length})</h2>
        <div className="space-y-3">
          {items.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No items</p>}
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--border)' }}>
                {item.image_url ? <img src={String(item.image_url)} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{String(item.product_name_en ?? '—')}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{String(item.size)} · Qty {String(item.quantity)}</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>AED {Number(item.total_price ?? 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
