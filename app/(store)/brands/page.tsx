import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Brands | SADU 314' };

export default async function BrandsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true)
    .not('brand', 'is', null);

  // Aggregate unique brands with product counts
  const brandMap = new Map<string, number>();
  for (const p of products ?? []) {
    if (p.brand) brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + 1);
  }
  const brands = Array.from(brandMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 40,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          Brands
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {brands.length} curated brands
        </p>
      </div>

      {brands.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              color: 'var(--text-secondary)',
            }}
          >
            No brands yet
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {brands.map(({ name, count }) => (
            <Link
              key={name}
              href={`/collections/all?brand=${encodeURIComponent(name)}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px 24px',
                backgroundColor: '#12100E',
                border: '1px solid rgba(201,163,91,0.12)',
                borderRadius: 12,
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {name}
              </p>
              <p style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>
                {count} {count === 1 ? 'product' : 'products'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
