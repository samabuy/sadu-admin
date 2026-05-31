import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/store/ProductGrid';

export const dynamic = 'force-dynamic';

import { ProductDetailClient } from './ProductDetailClient';
import type { Metadata } from 'next';
import type { StoreProduct } from '@/types/store';

const PRODUCT_SELECT = `
  id, name_en, name_ar, slug, description_en, description_ar,
  scent_story_en, scent_story_ar, base_price, sale_price,
  category, scent_family, gender, occasion, strength,
  longevity, projection, season, sizes, image_url, gallery_urls,
  is_best_seller, is_new_arrival, is_limited_edition, is_active,
  rating, review_count, created_at,
  product_notes(id, note_type, note_name_en, note_name_ar)
`;

const GENDER_COLLECTION: Record<string, { label: string; href: string }> = {
  men: { label: "Men's Fragrances", href: '/collections/men' },
  women: { label: "Women's Fragrances", href: '/collections/women' },
  unisex: { label: 'Unisex Fragrances', href: '/collections/unisex' },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('name_en,description_en')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'Product | SADU' };
  return {
    title: `${data.name_en} | SADU`,
    description: data.description_en ?? `${data.name_en} — Available at SADU`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) notFound();

  const { data: similar } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('scent_family', product.scent_family)
    .neq('id', product.id)
    .limit(4);

  const collection = GENDER_COLLECTION[product.gender as string] ?? { label: 'All Products', href: '/collections/all' };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px 0', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Home', href: '/' },
          { label: collection.label, href: collection.href },
          { label: product.name_en, href: '' },
        ].map((crumb, i, arr) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {crumb.href ? (
              <Link href={crumb.href} style={{ color: 'rgba(246,239,226,0.45)', fontSize: 12, textDecoration: 'none' }}>
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: 'rgba(246,239,226,0.75)', fontSize: 12 }}>{crumb.label}</span>
            )}
            {i < arr.length - 1 && <span style={{ color: 'rgba(201,163,91,0.35)', fontSize: 12 }}>›</span>}
          </span>
        ))}
      </div>

      {/* Product detail — image + info handled by client component */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px 48px' }}>
        <ProductDetailClient product={product as unknown as StoreProduct} />
      </div>

      {/* You may also like */}
      {similar && similar.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ borderTop: '1px solid rgba(201,163,91,0.1)', paddingTop: 40, marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: '#F6EFE2', marginBottom: 4 }}>
              You May Also Like
            </h2>
            <p style={{ color: 'rgba(246,239,226,0.38)', fontSize: 13 }}>More from the same scent family</p>
          </div>
          <ProductGrid products={similar as unknown as StoreProduct[]} />
        </section>
      )}
    </div>
  );
}
