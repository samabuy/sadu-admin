'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';
import { createClient } from '@/lib/supabase/client';

const EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
  'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
];

function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SADU-${date}-${rand}`;
}

interface ContactForm {
  name: string; phone: string; email: string;
}
interface DeliveryForm {
  address: string; area: string; emirate: string; notes: string;
}
interface PaymentForm {
  method: 'cod' | 'card';
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#12100E',
  border: '1px solid rgba(201,163,91,0.2)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  color: 'var(--text-secondary)',
  fontSize: 12,
  fontWeight: 500,
  marginBottom: 6,
};

const STEPS_EN = ['Contact', 'Delivery', 'Payment'];
const STEPS_AR = ['التواصل', 'التوصيل', 'الدفع'];

export default function CheckoutPage() {
  const router = useRouter();
  const lang = useLangStore((s) => s.lang);
  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;
  const STEPS = lang === 'ar' ? STEPS_AR : STEPS_EN;
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [contact, setContact] = useState<ContactForm>({ name: '', phone: '', email: '' });
  const [delivery, setDelivery] = useState<DeliveryForm>({ address: '', area: '', emirate: 'Dubai', notes: '' });
  const [payment] = useState<PaymentForm>({ method: 'cod' });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const total = getTotal();

  function validateContact() {
    if (!contact.name.trim()) return 'Full name is required';
    if (!contact.phone.trim()) return 'Phone number is required';
    if (!contact.email.trim() || !contact.email.includes('@')) return 'Valid email is required';
    return null;
  }

  function validateDelivery() {
    if (!delivery.address.trim()) return 'Delivery address is required';
    if (!delivery.emirate) return 'Please select an emirate';
    return null;
  }

  function next() {
    setError('');
    if (step === 0) {
      const err = validateContact();
      if (err) { setError(err); return; }
    }
    if (step === 1) {
      const err = validateDelivery();
      if (err) { setError(err); return; }
    }
    setStep((s) => s + 1);
  }

  async function placeOrder() {
    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const orderNumber = generateOrderNumber();

    const orderItems = items.map((item) => ({
      product_id: item.productId,
      product_name_en: item.productNameEn,
      product_name_ar: item.productNameAr,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      image_url: item.imageUrl || null,
    }));

    const { error: dbErr } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: contact.name,
      customer_phone: contact.phone,
      customer_email: contact.email,
      delivery_address: `${delivery.address}${delivery.area ? ', ' + delivery.area : ''}`,
      emirate: delivery.emirate,
      notes: delivery.notes || null,
      payment_method: payment.method,
      payment_status: 'pending',
      delivery_status: 'received',
      subtotal: total,
      delivery_fee: 0,
      discount_amount: 0,
      total,
      items: orderItems,
    } as never);

    if (dbErr) {
      setError(dbErr.message);
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/order-confirmation/${orderNumber}`);
  }

  const summaryTotal = total;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 36,
        }}
      >
        {t('إتمام الشراء', 'Checkout')}
      </h1>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor:
                    i < step ? 'var(--gold)' : i === step ? 'rgba(201,168,76,0.15)' : 'rgba(154,143,122,0.1)',
                  border: i < step ? 'none' : i === step ? '2px solid var(--gold)' : '1px solid rgba(154,143,122,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {i < step ? (
                  <Check size={14} color="#000" strokeWidth={2.5} />
                ) : (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: i === step ? 'var(--gold)' : 'var(--text-secondary)',
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: i === step ? 600 : 400,
                  color: i === step ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: i < step ? 'var(--gold)' : 'rgba(154,143,122,0.15)',
                  margin: '0 12px',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* Form */}
        <div>
          {/* Step 0 — Contact */}
          {step === 0 && (
            <div
              style={{
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.15)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 20,
                }}
              >
                {t('بيانات التواصل', 'Contact Information')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t('الاسم الكامل', 'Full Name')} *</label>
                  <input
                    style={inputStyle}
                    placeholder={t('اسمك الكامل', 'Your full name')}
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('رقم الهاتف', 'Phone Number')} *</label>
                  <input
                    style={inputStyle}
                    placeholder="+971 50 000 0000"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('البريد الإلكتروني', 'Email Address')} *</label>
                  <input
                    type="email"
                    style={inputStyle}
                    placeholder="your@email.com"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Delivery */}
          {step === 1 && (
            <div
              style={{
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.15)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 20,
                }}
              >
                {t('عنوان التوصيل', 'Delivery Details')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Emirate *</label>
                  <select
                    style={inputStyle}
                    value={delivery.emirate}
                    onChange={(e) => setDelivery({ ...delivery, emirate: e.target.value })}
                  >
                    {EMIRATES.map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Area / Community</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. JBR, Downtown, Marina"
                    value={delivery.area}
                    onChange={(e) => setDelivery({ ...delivery, area: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('العنوان الكامل', 'Full Address')} *</label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="Building name, floor, apartment number…"
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Order Notes (optional)</label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="Gift message, special instructions…"
                    value={delivery.notes}
                    onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div
              style={{
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.15)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 20,
                }}
              >
                {t('طريقة الدفع', 'Payment Method')}
              </h2>

              {/* COD (active) */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: '2px solid var(--gold)',
                  backgroundColor: 'rgba(201,168,76,0.06)',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '2px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--gold)' }} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>
                    {t('الدفع عند الاستلام', 'Cash on Delivery')}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    Pay when your order arrives
                  </p>
                </div>
              </div>

              {/* Card (placeholder — coming soon) */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: '1px solid rgba(154,143,122,0.2)',
                  opacity: 0.45,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '1px solid rgba(154,143,122,0.4)',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>
                    Credit / Debit Card
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    Coming soon — Tap Payments integration
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p
              style={{
                color: 'var(--error)',
                fontSize: 13,
                marginTop: 12,
                padding: '10px 14px',
                backgroundColor: 'rgba(181,71,71,0.08)',
                borderRadius: 6,
              }}
            >
              {error}
            </p>
          )}

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {step > 0 && (
              <button
                onClick={() => { setStep((s) => s - 1); setError(''); }}
                style={{
                  flex: 1,
                  padding: '13px',
                  borderRadius: 8,
                  border: '1px solid rgba(201,163,91,0.25)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {t('رجوع', 'Back')}
              </button>
            )}

            {step < 2 ? (
              <button
                onClick={next}
                style={{
                  flex: 2,
                  padding: '13px',
                  borderRadius: 8,
                  backgroundColor: 'var(--gold)',
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {t('التالي', 'Continue')} <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={placeOrder}
                disabled={submitting}
                style={{
                  flex: 2,
                  padding: '13px',
                  borderRadius: 8,
                  backgroundColor: submitting ? 'rgba(201,168,76,0.5)' : 'var(--gold)',
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> {t('جارٍ تأكيد الطلب…', 'Placing Order…')}</>
                ) : (
                  <>{t('تأكيد الطلب', 'Place Order')} — AED {summaryTotal.toLocaleString()}</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div
          style={{
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.12)',
            borderRadius: 12,
            padding: 20,
            position: 'sticky',
            top: 80,
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}
          >
            Your Order
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.productNameEn}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                    {item.size} × {item.quantity}
                  </p>
                </div>
                <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                  AED {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(201,163,91,0.1)', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Delivery</span>
              <span style={{ color: 'var(--success)', fontSize: 13 }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>Total</span>
              <span style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 700 }}>
                AED {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
