import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/store/ProductGrid';
import { ProductDetailClient } from './ProductDetailClient';
import type { Metadata } from 'next';
import type { StoreProduct } from '@/types/store';

const PRODUCT_SELECT =
  'id,name_en,name_ar,slug,brand,category,scent_family,gender,base_price,image_url,is_active,is_best_seller,is_new_arrival,is_limited_edition,rating,review_count,description_en,description_ar,scent_story_en,scent_story_ar,notes,sizes,occasion,season';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('name_en,name_ar,description_en')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'Product | SADU 314' };
  return {
    title: `${data.name_en} | SADU 314`,
    description: data.description_en ?? `${data.name_en} — Luxury Arabian Perfume by SADU 314`,
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

  const PATTERN_BG = `
    repeating-linear-gradient(45deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 16px),
    repeating-linear-gradient(-45deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 16px)
  `.trim();

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 24px 0',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/collections/all' },
          { label: product.name_en, href: '#' },
        ].map((crumb, i, arr) => (
          <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i < arr.length - 1 ? (
              <Link
                href={crumb.href}
                style={{ color: 'var(--text-secondary)', fontSize: 12, textDecoration: 'none' }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{crumb.label}</span>
            )}
            {i < arr.length - 1 && (
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>›</span>
            )}
          </span>
        ))}
      </div>

      {/* Main product section */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 56,
          alignItems: 'start',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3/4',
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.12)',
          }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_en}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundImage: PATTERN_BG }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  color: 'var(--gold)',
                  opacity: 0.3,
                  letterSpacing: '0.08em',
                }}
              >
                SADU 314
              </span>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.is_new_arrival && (
              <span style={{ backgroundColor: 'var(--gold)', color: '#000', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>NEW</span>
            )}
            {product.is_best_seller && (
              <span style={{ backgroundColor: 'rgba(63,125,88,0.9)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>BESTSELLER</span>
            )}
            {product.is_limited_edition && (
              <span style={{ backgroundColor: 'rgba(181,71,71,0.9)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>LIMITED</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Brand */}
          {product.brand && (
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 10,
              }}
            >
              {product.brand}
            </p>
          )}

          {/* Arabic name */}
          <h1
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: 6,
              direction: 'rtl',
              textAlign: 'right',
            }}
          >
            {product.name_ar}
          </h1>

          {/* English name */}
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 400,
              color: 'var(--text-secondary)',
              lineHeight: 1.3,
              marginBottom: 20,
            }}
          >
            {product.name_en}
          </h2>

          {/* Price */}
          <p
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--gold)',
              marginBottom: 24,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            AED {product.base_price.toLocaleString()}
          </p>

          {/* Meta chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
            {[
              product.gender,
              product.category,
              product.scent_family,
            ]
              .filter(Boolean)
              .map((v) => (
                <span
                  key={v}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '4px 12px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(201,168,76,0.07)',
                    border: '1px solid rgba(201,163,91,0.2)',
                    color: 'var(--text-secondary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}
                </span>
              ))}
          </div>

          {/* Interactive part */}
          <ProductDetailClient product={product as unknown as StoreProduct} />
        </div>
      </div>

      {/* You may also like */}
      {similar && similar.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}
          >
            You May Also Like
          </h2>
          <ProductGrid products={similar as unknown as StoreProduct[]} />
        </section>
      )}
    </div>
  );
}
