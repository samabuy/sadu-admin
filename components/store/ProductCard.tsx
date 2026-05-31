'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';
import type { StoreProduct } from '@/types/store';

interface Props {
  product: StoreProduct;
}

export function ProductCard({ product }: Props) {
  const [mounted, setMounted] = useState(false);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const lang = useLangStore((s) => s.lang);

  useEffect(() => setMounted(true), []);

  const displayLang = mounted ? lang : 'en';
  const name = displayLang === 'ar' ? product.name_ar : product.name_en;

  const availableSizes = (product.sizes ?? []).filter((s) => s.inStock && s.price > 0);
  const displayPrice =
    availableSizes.length > 0
      ? Math.min(...availableSizes.map((s) => s.price))
      : product.base_price;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    const size = availableSizes[0];
    if (!size) return;
    addItem({
      productId: product.id,
      productNameEn: product.name_en,
      productNameAr: product.name_ar,
      imageUrl: product.image_url ?? '',
      size: size.label,
      price: size.price,
      quantity: 1,
      slug: product.slug,
    });
    setAdding(true);
    setTimeout(() => setAdding(false), 1400);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      style={{
        backgroundColor: '#12100E',
        border: '1px solid rgba(201,163,91,0.12)',
        borderRadius: 12,
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          backgroundColor: '#1C1915',
          overflow: 'hidden',
        }}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={name}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
            className="group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 14px),
                repeating-linear-gradient(-45deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 14px)
              `,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                color: 'var(--gold)',
                opacity: 0.4,
                letterSpacing: '0.08em',
              }}
            >
              SADU 314
            </span>
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.is_new_arrival && (
            <span
              style={{
                backgroundColor: 'var(--gold)',
                color: '#000',
                fontSize: 9,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: '0.06em',
              }}
            >
              NEW
            </span>
          )}
          {product.is_best_seller && (
            <span
              style={{
                backgroundColor: 'rgba(63,125,88,0.9)',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: '0.06em',
              }}
            >
              BESTSELLER
            </span>
          )}
          {product.is_limited_edition && (
            <span
              style={{
                backgroundColor: 'rgba(181,71,71,0.9)',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: '0.06em',
              }}
            >
              LIMITED
            </span>
          )}
        </div>

        {/* Quick add button */}
        {availableSizes.length > 0 && (
          <button
            onClick={quickAdd}
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: adding ? 'rgba(63,125,88,0.95)' : 'var(--gold)',
              color: '#000',
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              opacity: 0,
              transition: 'opacity 0.2s, background-color 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
            className="group-hover:opacity-100"
          >
            <ShoppingBag size={12} />
            {adding ? '✓ Added' : 'Add'}
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        {product.brand && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 5,
            }}
          >
            {product.brand}
          </p>
        )}
        <p
          style={{
            fontFamily:
              displayLang === 'ar'
                ? "'Cairo', sans-serif"
                : "'Cormorant Garamond', serif",
            fontSize: displayLang === 'ar' ? 15 : 18,
            fontWeight: displayLang === 'ar' ? 600 : 500,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 8,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}
        >
          {name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: 'var(--gold)', fontSize: 14, fontWeight: 600 }}>
            AED {displayPrice.toLocaleString()}
          </p>
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} fill="var(--gold)" color="var(--gold)" />
              <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
