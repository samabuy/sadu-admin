'use client';

import Link from 'next/link';
import { useLangStore } from '@/store/langStore';
import { ProductGrid } from './ProductGrid';
import type { StoreProduct } from '@/types/store';

const GENDER_TILES = [
  { en: "Men's Fragrances", ar: 'عطور الرجال', href: '/collections/men', icon: '♂' },
  { en: "Women's Fragrances", ar: 'عطور النساء', href: '/collections/women', icon: '♀' },
  { en: 'Unisex Fragrances', ar: 'عطور مشتركة', href: '/collections/unisex', icon: '✦' },
];

interface Props {
  deals: StoreProduct[];
  scentProducts: StoreProduct[];
}

export function HomeContent({ deals, scentProducts }: Props) {
  const lang = useLangStore((s) => s.lang);
  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;

  return (
    <div>
      {/* Gender Tiles */}
      <section style={{ padding: '48px 24px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="grid grid-cols-3 gap-4">
          {GENDER_TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '32px 16px',
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.18)',
                borderRadius: 8, textDecoration: 'none', textAlign: 'center',
                gap: 8, transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              <span style={{ fontSize: 22, color: '#C9A84C', opacity: 0.75 }}>{tile.icon}</span>
              <p style={{
                fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
                fontSize: 19, fontWeight: 600, color: '#F6EFE2', marginBottom: 2,
              }}>
                {t(tile.ar, tile.en)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{
              fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
              fontSize: 30, fontWeight: 600, color: '#F6EFE2', marginBottom: 4,
            }}>
              {t('أفضل المبيعات', 'Best Sellers')}
            </h2>
          </div>
          <Link href="/collections/all" style={{ color: '#C9A84C', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            {t('عرض الكل', 'View all')} →
          </Link>
        </div>
        <ProductGrid products={deals} />
      </section>

      {/* New Arrivals */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{
              fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
              fontSize: 30, fontWeight: 600, color: '#C9A84C', marginBottom: 4,
            }}>
              {t('وصل حديثاً', 'New Arrivals')}
            </h2>
          </div>
          <Link href="/collections/new-arrivals" style={{ color: '#C9A84C', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            {t('استكشف الكل', 'Explore all')} →
          </Link>
        </div>
        <ProductGrid products={scentProducts} />
      </section>

      {/* SADU Club teaser */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <Link href="/sadu-club" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '32px 40px', backgroundColor: '#12100E',
          border: '1px solid rgba(201,163,91,0.3)', borderRadius: 12, textDecoration: 'none',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p style={{
              fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
              fontSize: 26, fontWeight: 600, color: '#C9A84C', marginBottom: 6,
            }}>
              {t('انضم إلى نادي سدو', 'Join SADU Club')}
            </p>
            <p style={{ color: 'rgba(246,239,226,0.5)', fontSize: 13 }}>
              {t('اكسب نقاطاً مع كل عملية شراء', 'Earn points with every purchase')}
            </p>
          </div>
          <span style={{ color: '#C9A84C', fontSize: 22 }}>{lang === 'ar' ? '←' : '→'}</span>
        </Link>
      </section>
    </div>
  );
}
