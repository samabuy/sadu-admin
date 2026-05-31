'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { OrderTimeline } from '@/components/store/OrderTimeline';
import { useLangStore } from '@/store/langStore';
import type { DeliveryStatus } from '@/lib/types';

interface OrderResult {
  order_number: string;
  customer_name: string;
  delivery_status: DeliveryStatus;
  payment_status: string;
  payment_method: string;
  emirate: string;
  delivery_address: string;
  total: number;
  created_at: string;
  items: Array<{
    product_name_en: string;
    product_name_ar: string;
    size: string;
    quantity: number;
    unit_price: number;
  }>;
}

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const lang = useLangStore((s) => s.lang);

  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const initial = searchParams.get('order');
    if (initial) {
      setOrderNumber(initial);
      doFetch(initial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doFetch(num?: string) {
    const query = (num ?? orderNumber).trim().toUpperCase();
    if (!query) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('order_number,customer_name,delivery_status,payment_status,payment_method,emirate,delivery_address,total,created_at,items')
      .eq('order_number', query)
      .single();

    setLoading(false);
    if (!data) { setNotFound(true); return; }
    setOrder(data as OrderResult);
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '56px 24px' }}>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 40,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}
      >
        {lang === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 36 }}>
        {lang === 'ar'
          ? 'أدخل رقم طلبك لمعرفة حالته الحالية'
          : 'Enter your order number to see its current status'}
      </p>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && doFetch()}
          placeholder="SADU-20260101-1234"
          style={{
            flex: 1,
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.2)',
            color: 'var(--text-primary)',
            borderRadius: 8,
            padding: '13px 16px',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
          }}
        />
        <button
          onClick={() => doFetch()}
          disabled={loading}
          style={{
            padding: '13px 24px',
            borderRadius: 8,
            backgroundColor: 'var(--gold)',
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {lang === 'ar' ? 'بحث' : 'Track'}
        </button>
      </div>

      {/* Not found */}
      {notFound && (
        <div
          style={{
            padding: '24px',
            borderRadius: 12,
            backgroundColor: 'rgba(181,71,71,0.08)',
            border: '1px solid rgba(181,71,71,0.2)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--error)', fontSize: 14, fontWeight: 500 }}>
            {lang === 'ar'
              ? 'لم يتم العثور على الطلب. تأكد من رقم الطلب.'
              : 'Order not found. Please double-check your order number.'}
          </p>
        </div>
      )}

      {/* Order found */}
      {order && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header */}
          <div
            style={{
              backgroundColor: '#12100E',
              border: '1px solid rgba(201,163,91,0.15)',
              borderRadius: 12,
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}>Order Number</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: 'var(--gold)' }}>
                {order.order_number}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}>Customer</p>
              <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>
                {order.customer_name}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                {new Date(order.created_at).toLocaleDateString('en-AE', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div
            style={{
              backgroundColor: '#12100E',
              border: '1px solid rgba(201,163,91,0.15)',
              borderRadius: 12,
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              {lang === 'ar' ? 'حالة الطلب' : 'Order Status'}
            </h2>
            <OrderTimeline currentStatus={order.delivery_status} lang={lang} />
          </div>

          {/* Items */}
          <div
            style={{
              backgroundColor: '#12100E',
              border: '1px solid rgba(201,163,91,0.15)',
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              {lang === 'ar' ? 'المنتجات' : 'Items'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingBottom: 10,
                    borderBottom: i < order.items.length - 1 ? '1px solid rgba(201,163,91,0.08)' : 'none',
                  }}
                >
                  <div>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>
                      {lang === 'ar' ? item.product_name_ar : item.product_name_en}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                    AED {(item.unit_price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(201,163,91,0.1)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>Total</span>
              <span style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 700 }}>
                AED {Number(order.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
