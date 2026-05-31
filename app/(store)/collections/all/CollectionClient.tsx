'use client';

import { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/store/ProductGrid';
import { useLangStore } from '@/store/langStore';
import type { StoreProduct } from '@/types/store';
import { SlidersHorizontal, X } from 'lucide-react';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating';

interface Props {
  products: StoreProduct[];
  title: string;
  titleAr: string;
  lockGender?: string;
}

const GENDERS = ['all', 'men', 'women', 'unisex'];
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
];

function getPrice(p: StoreProduct) {
  const avail = (p.sizes ?? []).filter((s) => s.inStock && s.price > 0);
  return avail.length > 0 ? Math.min(...avail.map((s) => s.price)) : p.base_price;
}

export function CollectionClient({ products, title, titleAr, lockGender }: Props) {
  const lang = useLangStore((s) => s.lang);
  const [gender, setGender] = useState(lockGender ?? 'all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products;

    if (gender !== 'all') list = list.filter((p) => p.gender === gender);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_ar.includes(q) ||
          (p.brand ?? '').toLowerCase().includes(q) ||
          p.scent_family.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return getPrice(a) - getPrice(b);
      if (sort === 'price-desc') return getPrice(b) - getPrice(a);
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime();
    });
  }, [products, gender, sort, search]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 40,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          {lang === 'ar' ? titleAr : title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fragrances…"
          style={{
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.2)',
            color: 'var(--text-primary)',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            outline: 'none',
            width: 200,
          }}
        />

        {/* Gender pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                padding: '7px 16px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: gender === g ? 600 : 400,
                backgroundColor: gender === g ? 'var(--gold)' : 'rgba(201,163,91,0.06)',
                color: gender === g ? '#000' : 'var(--text-secondary)',
                border: gender === g ? 'none' : '1px solid rgba(201,163,91,0.15)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {g === 'all' ? 'All' : g}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          style={{
            marginLeft: 'auto',
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.2)',
            color: 'var(--text-secondary)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            outline: 'none',
          }}
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <ProductGrid products={filtered as unknown as StoreProduct[]} />
    </div>
  );
}
