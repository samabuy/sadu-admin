'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { useLangStore } from '@/store/langStore';

const collections = [
  { en: 'All Products', ar: 'جميع المنتجات', href: '/collections/all' },
  { en: 'Men', ar: 'رجال', href: '/collections/men' },
  { en: 'Women', ar: 'نساء', href: '/collections/women' },
  { en: 'Unisex', ar: 'للجميع', href: '/collections/unisex' },
  { en: 'New Arrivals', ar: 'وصل حديثاً', href: '/collections/new-arrivals' },
];

const services = [
  { en: 'Track Order', ar: 'تتبع الطلب', href: '/track-order' },
  { en: 'SADU Club', ar: 'نادي سدو', href: '/sadu-club' },
  { en: 'My Account', ar: 'حسابي', href: '/account' },
  { en: 'Brands', ar: 'الماركات', href: '/brands' },
];

const linkStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: 13,
  display: 'block',
  marginBottom: 10,
  textDecoration: 'none',
  transition: 'color 0.15s',
};

export function Footer() {
  const lang = useLangStore((s) => s.lang);
  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;

  return (
    <footer
      style={{
        backgroundColor: '#080706',
        borderTop: '1px solid rgba(201,163,91,0.12)',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: 12 }}>
              <Image
                src="/logos/sadu-logo.png"
                alt="SADU"
                width={52}
                height={52}
              />
            </Link>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 13,
                lineHeight: 1.75,
                marginBottom: 20,
              }}
            >
              {t('أفضل العطور العالمية — تُوصَّل لجميع أنحاء الإمارات.', 'Premium international fragrances — delivered across the UAE.')}
            </p>
            <a
              href="https://wa.me/971554955153"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '9px 16px',
                borderRadius: 8,
                backgroundColor: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.2)',
                color: '#25D366',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
          </div>

          {/* Collections */}
          <div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {t('المجموعات', 'COLLECTIONS')}
            </p>
            {collections.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}>
                {t(l.ar, l.en)}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {t('الخدمات', 'SERVICES')}
            </p>
            {services.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}>
                {t(l.ar, l.en)}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {t('تواصل معنا', 'CONTACT')}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
              UAE — All 7 Emirates
            </p>
            <a
              href="https://wa.me/971554955153"
              style={{
                display: 'inline-block',
                marginTop: 10,
                color: 'var(--gold)',
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              +971 50 000 0000
            </a>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(201,163,91,0.08)',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            © {new Date().getFullYear()} SADU. {t('جميع الحقوق محفوظة', 'All rights reserved')}.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Made in the UAE 🇦🇪</p>
        </div>
      </div>
    </footer>
  );
}
