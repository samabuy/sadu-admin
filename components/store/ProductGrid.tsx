import type { StoreProduct } from '@/types/store';
import { ProductCard } from './ProductCard';

function Skeleton() {
  return (
    <div
      style={{
        backgroundColor: '#12100E',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(201,163,91,0.08)',
      }}
    >
      <div
        style={{
          aspectRatio: '3/4',
          backgroundColor: '#1a1714',
          background:
            'linear-gradient(90deg, #1a1714 0%, #221e18 50%, #1a1714 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.6s ease-in-out infinite',
        }}
      />
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            height: 9,
            backgroundColor: '#1f1c18',
            borderRadius: 4,
            marginBottom: 8,
            width: '38%',
          }}
        />
        <div
          style={{
            height: 13,
            backgroundColor: '#1f1c18',
            borderRadius: 4,
            marginBottom: 6,
            width: '85%',
          }}
        />
        <div
          style={{ height: 13, backgroundColor: '#1f1c18', borderRadius: 4, width: '65%' }}
        />
      </div>
    </div>
  );
}

interface Props {
  products: StoreProduct[];
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({ products, loading = false, emptyMessage }: Props) {
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: 20,
  };

  if (loading) {
    return (
      <div style={grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            color: 'var(--text-secondary)',
            marginBottom: 8,
          }}
        >
          No products found
        </p>
        {emptyMessage && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{emptyMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div style={grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
