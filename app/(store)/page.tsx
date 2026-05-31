import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/store/ProductGrid';
import type { StoreProduct } from '@/types/store';

export const dynamic = 'force-dynamic';

const PRODUCT_SELECT = `
  id, name_en, name_ar, slug, description_en, description_ar,
  scent_story_en, scent_story_ar, base_price, sale_price,
  category, scent_family, gender, occasion, strength,
  longevity, projection, season, sizes, image_url, gallery_urls,
  is_best_seller, is_new_arrival, is_limited_edition, is_active,
  rating, review_count, created_at,
  product_notes(id, note_type, note_name_en, note_name_ar)
`;

const CATEGORIES = [
  { label: 'Men', labelAr: 'رجال', href: '/collections/men', icon: '♂' },
  { label: 'Women', labelAr: 'نساء', href: '/collections/women', icon: '♀' },
  { label: 'Unisex', labelAr: 'للجميع', href: '/collections/unisex', icon: '✦' },
  { label: 'New Arrivals', labelAr: 'وصل حديثاً', href: '/collections/new-arrivals', icon: '★' },
];

const PATTERN_BG = `
  repeating-linear-gradient(45deg, rgba(201,168,76,0.035) 0px, rgba(201,168,76,0.035) 1px, transparent 1px, transparent 16px),
  repeating-linear-gradient(-45deg, rgba(201,168,76,0.035) 0px, rgba(201,168,76,0.035) 1px, transparent 1px, transparent 16px)
`.trim();

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: bestsellers }, { data: newArrivals }] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: PATTERN_BG,
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ textAlign: 'center', padding: '80px 24px', maxWidth: 760, position: 'relative', zIndex: 1 }}>
          {/* Arabic headline */}
          <p
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--gold)',
              marginBottom: 16,
              opacity: 0.9,
            }}
          >
            أرقى العطور العالمية... تُوصَّل إليك في الإمارات
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(38px, 6vw, 72px)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              marginBottom: 24,
            }}
          >
            SADU
          </h1>

          <p
            style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: 560,
              margin: '0 auto 48px',
            }}
          >
            Discover the world&apos;s finest fragrances — from Dior and Tom Ford to Xerjoff and
            Amouage — delivered to your door across all 7 Emirates.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/collections/all"
              style={{
                backgroundColor: 'var(--gold)',
                color: '#080706',
                padding: '14px 36px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Explore Collection
            </Link>
            <Link
              href="/sadu-club"
              style={{
                border: '1px solid rgba(201,163,91,0.4)',
                color: 'var(--gold)',
                padding: '14px 36px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              SADU Club
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(to top, #080706, transparent)',
            pointerEvents: 'none',
          }}
        />
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          Shop by Collection
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 20px',
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.12)',
                borderRadius: 12,
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'border-color 0.2s, background-color 0.2s',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 28, color: 'var(--gold)', opacity: 0.7 }}>{cat.icon}</span>
              <div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}
                >
                  {cat.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {cat.labelAr}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      {bestsellers && bestsellers.length > 0 && (
        <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 28,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Bestsellers
            </h2>
            <Link
              href="/collections/all"
              style={{ color: 'var(--gold)', fontSize: 13, textDecoration: 'none' }}
            >
              View all →
            </Link>
          </div>
          <ProductGrid products={bestsellers as unknown as StoreProduct[]} />
        </section>
      )}

      {/* ── New Arrivals ─────────────────────────────────────────────────── */}
      {newArrivals && newArrivals.length > 0 && (
        <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 28,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              New Arrivals
            </h2>
            <Link
              href="/collections/new-arrivals"
              style={{ color: 'var(--gold)', fontSize: 13, textDecoration: 'none' }}
            >
              View all →
            </Link>
          </div>
          <ProductGrid products={newArrivals as unknown as StoreProduct[]} />
        </section>
      )}

      {/* ── SADU Club Teaser ─────────────────────────────────────────────── */}
      <section
        style={{
          margin: '16px 24px 80px',
          maxWidth: 1200,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 16,
          padding: '64px 40px',
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
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
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
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 40,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 16,
            position: 'relative',
          }}
        >
          Join SADU Club
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 1.75,
            maxWidth: 480,
            margin: '0 auto 36px',
            position: 'relative',
          }}
        >
          Earn points with every purchase. Unlock exclusive tiers — from Silver Thread to
          Gold Loom — with benefits as rare as the fragrances we carry.
        </p>
        <Link
          href="/sadu-club"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--gold)',
            color: '#080706',
            padding: '13px 32px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.04em',
            position: 'relative',
          }}
        >
          Discover the Club
        </Link>
      </section>
    </div>
  );
}
