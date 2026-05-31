'use client';

import { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/store/ProductGrid';
import { useLangStore } from '@/store/langStore';
import type { StoreProduct } from '@/types/store';

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
  { key: 'price-asc', label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
  { key: 'rating', label: 'Top Rated' },
];

function getPrice(p: StoreProduct) {
  if (p.sale_price && p.sale_price > 0) return p.sale_price;
  const avail = (p.sizes ?? []).filter((s) => s.inStock && s.price > 0);
  return avail.length > 0 ? Math.min(...avail.map((s) => s.price)) : p.base_price;
}

export function CollectionClient({ products, title, titleAr, lockGender }: Props) {
  const lang = useLangStore((s) => s.lang);
  const [gender, setGender] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = products;
    if (!lockGender && gender !== 'all') list = list.filter((p) => p.gender === gender);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_ar.includes(q) ||
        p.scent_family.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return getPrice(a) - getPrice(b);
      if (sort === 'price-desc') return getPrice(b) - getPrice(a);
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime();
    });
  }, [products, gender, sort, search, lockGender]);

  const pill = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: active ? 700 : 400,
    backgroundColor: active ? '#C9A84C' : 'transparent',
    color: active ? '#000' : 'rgba(246,239,226,0.6)',
    border: active ? 'none' : '1px solid rgba(201,163,91,0.2)',
    cursor: 'pointer',
    textTransform: 'capitalize',
    letterSpacing: '0.05em',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600, color: '#F6EFE2', marginBottom: 4 }}>
          {lang === 'ar' ? titleAr : title}
        </h1>
        <p style={{ color: 'rgba(246,239,226,0.38)', fontSize: 13 }}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28,
        borderBottom: '1px solid rgba(201,163,91,0.1)', paddingBottom: 18,
        flexWrap: 'wrap',
      }}>
        {/* Gender pills — only on "All" page */}
        {!lockGender && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {GENDERS.map((g) => (
              <button key={g} onClick={() => setGender(g)} style={pill(gender === g)}>
                {g === 'all' ? 'All' : g}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fragrances…"
          style={{
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.2)',
            color: '#F6EFE2', borderRadius: 4,
            padding: '7px 14px', fontSize: 12, outline: 'none', width: 176,
          }}
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          style={{
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.2)',
            color: 'rgba(246,239,226,0.7)', borderRadius: 4,
            padding: '7px 12px', fontSize: 12, outline: 'none',
            marginLeft: lockGender ? 'auto' : undefined,
          }}
        >
          {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      <ProductGrid products={filtered as unknown as StoreProduct[]} />
    </div>
  );
}
