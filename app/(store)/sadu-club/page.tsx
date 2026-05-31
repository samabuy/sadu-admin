import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SADU Club | Loyalty Programme' };

const TIERS = [
  {
    name: 'Silver Thread',
    nameAr: 'الخيط الفضي',
    range: '0 – 999 pts',
    color: '#C0C0C0',
    bg: 'rgba(192,192,192,0.06)',
    border: 'rgba(192,192,192,0.2)',
    benefits: [
      'Early access to new arrivals',
      'Birthday fragrance sample',
      'Loyalty points on every order',
    ],
  },
  {
    name: 'Bronze Weave',
    nameAr: 'نسج البرونز',
    range: '1,000 – 2,499 pts',
    color: '#CD7F32',
    bg: 'rgba(205,127,50,0.06)',
    border: 'rgba(205,127,50,0.2)',
    benefits: [
      'All Silver Thread benefits',
      '5% discount on orders',
      'Free gift wrapping',
      'Priority customer support',
    ],
  },
  {
    name: 'Gold Loom',
    nameAr: 'النول الذهبي',
    range: '2,500 – 4,999 pts',
    color: '#C9A84C',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,163,91,0.3)',
    popular: true,
    benefits: [
      'All Bronze Weave benefits',
      '10% discount on all orders',
      'Free express delivery',
      'Exclusive fragrance previews',
      'Quarterly luxury gift',
    ],
  },
  {
    name: 'Pearl Pattern',
    nameAr: 'نقش اللؤلؤ',
    range: '5,000 – 9,999 pts',
    color: '#E8E0D0',
    bg: 'rgba(232,224,208,0.06)',
    border: 'rgba(232,224,208,0.2)',
    benefits: [
      'All Gold Loom benefits',
      '15% discount on all orders',
      'Dedicated personal stylist',
      'Bespoke fragrance consultation',
      'Invitations to exclusive events',
    ],
  },
  {
    name: 'Desert Diamond',
    nameAr: 'ماس الصحراء',
    range: '10,000+ pts',
    color: '#B9F2FF',
    bg: 'rgba(185,242,255,0.05)',
    border: 'rgba(185,242,255,0.18)',
    benefits: [
      'All Pearl Pattern benefits',
      '20% lifetime discount',
      'Custom-blended private fragrance',
      'Invitation to SADU atelier tours',
      'First access to limited editions',
      'Complimentary annual gift set',
    ],
  },
];

const PATTERN_BG = `
  repeating-linear-gradient(45deg, rgba(201,168,76,0.035) 0px, rgba(201,168,76,0.035) 1px, transparent 1px, transparent 16px),
  repeating-linear-gradient(-45deg, rgba(201,168,76,0.035) 0px, rgba(201,168,76,0.035) 1px, transparent 1px, transparent 16px)
`.trim();

export default function SaduClubPage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '80px 24px',
          backgroundImage: PATTERN_BG,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 16,
            }}
          >
            Loyalty Programme
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            SADU Club
          </h1>
          <p
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--gold)',
              marginBottom: 20,
              opacity: 0.85,
            }}
          >
            نادي سدو
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 16,
              lineHeight: 1.8,
              marginBottom: 36,
            }}
          >
            A loyalty programme as rare as the fragrances we craft. Earn points
            with every purchase and ascend through five exclusive tiers — each
            unlocking privileges woven from heritage and luxury.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/account"
              style={{
                backgroundColor: 'var(--gold)',
                color: '#080706',
                padding: '13px 32px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Join Now
            </Link>
            <Link
              href="/collections/all"
              style={{
                border: '1px solid rgba(201,163,91,0.35)',
                color: 'var(--gold)',
                padding: '13px 32px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Shop & Earn
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          How It Works
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {[
            { step: '01', icon: '🛍️', title: 'Shop', desc: 'Earn 1 point for every AED 1 spent on any order' },
            { step: '02', icon: '⭐', title: 'Accumulate', desc: 'Points never expire. They accumulate with every purchase' },
            { step: '03', icon: '🏆', title: 'Ascend', desc: 'Reach new tiers to unlock exclusive benefits and privileges' },
            { step: '04', icon: '🎁', title: 'Redeem', desc: 'Use points for discounts, exclusive products, and gifts' },
          ].map(({ step, icon, title, desc }) => (
            <div
              key={step}
              style={{
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.1)',
                borderRadius: 12,
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--gold)', opacity: 0.6 }}>
                STEP {step}
              </span>
              <div style={{ fontSize: 32, margin: '12px 0 8px' }}>{icon}</div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                {title}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Membership Tiers
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                backgroundColor: tier.bg,
                border: `1px solid ${tier.border}`,
                borderRadius: 14,
                padding: '24px 20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {tier.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--gold)',
                    color: '#000',
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '3px 12px',
                    borderRadius: 20,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MOST POPULAR
                </span>
              )}

              {/* Tier name */}
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: tier.color,
                    marginBottom: 2,
                  }}
                >
                  {tier.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 13,
                    color: tier.color,
                    opacity: 0.7,
                    marginBottom: 6,
                  }}
                >
                  {tier.nameAr}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    backgroundColor: 'rgba(154,143,122,0.1)',
                    padding: '3px 10px',
                    borderRadius: 20,
                    display: 'inline-block',
                  }}
                >
                  {tier.range}
                </p>
              </div>

              {/* Benefits */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tier.benefits.map((benefit) => (
                  <div key={benefit} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: tier.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.5 }}>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download app CTA */}
      <section
        style={{
          margin: '0 24px 80px',
          maxWidth: 1100,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 16,
          padding: '56px 40px',
          backgroundColor: '#12100E',
          border: '1px solid rgba(201,163,91,0.15)',
          backgroundImage: PATTERN_BG,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 16,
            }}
          >
            Mobile App
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 14,
            }}
          >
            Get the SADU App
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 15,
              lineHeight: 1.75,
              maxWidth: 460,
              margin: '0 auto 32px',
            }}
          >
            Track your points, browse exclusive member drops, and manage your
            orders — all from the SADU mobile app.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 10,
                backgroundColor: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,163,91,0.25)',
                color: 'var(--text-secondary)',
                fontSize: 13,
              }}
            >
              🍎 App Store — Coming Soon
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 10,
                backgroundColor: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,163,91,0.25)',
                color: 'var(--text-secondary)',
                fontSize: 13,
              }}
            >
              🤖 Google Play — Coming Soon
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
