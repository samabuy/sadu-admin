import Link from 'next/link';
import { CheckCircle, MessageCircle, Package } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order Confirmed | SADU' };

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;

  const waText = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن طلبي رقم: ${orderNumber}`,
  );

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      {/* Success icon */}
      <div style={{ marginBottom: 28 }}>
        <CheckCircle
          size={72}
          style={{ color: 'var(--success)', margin: '0 auto' }}
          strokeWidth={1.5}
        />
      </div>

      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 40,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 12,
        }}
      >
        Order Confirmed!
      </h1>
      <p
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: 28,
        }}
      >
        تم تأكيد طلبك
      </p>

      {/* Order number */}
      <div
        style={{
          backgroundColor: '#12100E',
          border: '1px solid rgba(201,163,91,0.2)',
          borderRadius: 12,
          padding: '20px 28px',
          marginBottom: 32,
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 6 }}>
          Order Number
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--gold)',
            letterSpacing: '0.04em',
          }}
        >
          {orderNumber}
        </p>
      </div>

      {/* What happens next */}
      <div
        style={{
          backgroundColor: '#12100E',
          border: '1px solid rgba(201,163,91,0.12)',
          borderRadius: 12,
          padding: '24px 28px',
          marginBottom: 36,
          textAlign: 'left',
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
          What happens next?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: '📩', text: "You'll receive a confirmation on WhatsApp shortly" },
            { icon: '🛍️', text: 'Our team will prepare your order with luxury packaging' },
            { icon: '🚚', text: 'Free delivery across the UAE — 2 to 5 business days' },
            { icon: '📦', text: 'Track your order anytime using your order number' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
        <Link
          href={`/track-order?order=${orderNumber}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px',
            borderRadius: 8,
            backgroundColor: 'var(--gold)',
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <Package size={15} />
          Track My Order
        </Link>

        <a
          href={`https://wa.me/971500000000?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px',
            borderRadius: 8,
            border: '1px solid rgba(37,211,102,0.3)',
            backgroundColor: 'rgba(37,211,102,0.05)',
            color: '#25D366',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <MessageCircle size={15} />
          Contact Us on WhatsApp
        </a>

        <Link
          href="/collections/all"
          style={{
            display: 'block',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 13,
            textDecoration: 'none',
            padding: '10px',
          }}
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
