import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/store/ProductGrid';
import { HeroSlider } from '@/components/store/HeroSlider';
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

const GENDER_TILES = [
  { label: 'Men Perfumes', labelAr: 'عطور الرجال', href: '/collections/men', icon: '♂' },
  { label: 'Women Perfumes', labelAr: 'عطور النساء', href: '/collections/women', icon: '♀' },
  { label: 'Unisex', labelAr: 'للجميع', href: '/collections/unisex', icon: '✦' },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: deals }, { data: freshProducts }, { data: topRated }] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .ilike('scent_family', '%fresh%')
      .limit(8),
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(8),
  ]);

  const scentProducts = (freshProducts?.length ?? 0) >= 4 ? freshProducts : topRated;

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

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
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: '#F6EFE2', marginBottom: 2 }}>
                {tile.label}
              </p>
              <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: 'rgba(246,239,226,0.45)' }}>
                {tile.labelAr}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Stock Deals */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: '#F6EFE2', marginBottom: 4 }}>
              Best Stock Deals
            </h2>
            <p style={{ color: 'rgba(246,239,226,0.38)', fontSize: 13 }}>Top picks from our latest collection</p>
          </div>
          <Link href="/collections/all" style={{ color: '#C9A84C', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            View all →
          </Link>
        </div>
        <ProductGrid products={(deals ?? []) as unknown as StoreProduct[]} />
      </section>

      {/* Test Your Favorite Scents */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: '#C9A84C', marginBottom: 4 }}>
              Test Your Favorite Scents
            </h2>
            <p style={{ color: 'rgba(246,239,226,0.38)', fontSize: 13 }}>Discover fresh and vibrant fragrances</p>
          </div>
          <Link href="/collections/all" style={{ color: '#C9A84C', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            Explore all →
          </Link>
        </div>
        <ProductGrid products={(scentProducts ?? []) as unknown as StoreProduct[]} />
      </section>
    </div>
  );
}
