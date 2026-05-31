import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const collections = [
  { label: 'All Products', href: '/collections/all' },
  { label: 'Men', href: '/collections/men' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Unisex', href: '/collections/unisex' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
];

const services = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'SADU Club', href: '/sadu-club' },
  { label: 'My Account', href: '/account' },
  { label: 'Brands', href: '/brands' },
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
              Premium international fragrances — delivered across the UAE.
            </p>
            <a
              href="https://wa.me/971500000000"
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
              Collections
            </p>
            {collections.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}>
                {l.label}
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
              Services
            </p>
            {services.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}>
                {l.label}
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
              Contact
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
              UAE — All 7 Emirates
              <br />
              Free delivery on all orders
            </p>
            <a
              href="https://wa.me/971500000000"
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
            © {new Date().getFullYear()} SADU. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Made in the UAE 🇦🇪</p>
        </div>
      </div>
    </footer>
  );
}
