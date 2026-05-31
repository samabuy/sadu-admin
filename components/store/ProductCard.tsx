'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';
import type { StoreProduct, Size } from '@/types/store';
import { SizeSelector } from './SizeSelector';

interface Props {
  product: StoreProduct;
}

export function ProductCard({ product }: Props) {
  const [mounted, setMounted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const lang = useLangStore((s) => s.lang);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (showQuickView && !selectedSize) {
      const firstAvail = (product.sizes ?? []).find((s) => s.inStock);
      setSelectedSize(firstAvail ?? null);
    }
    if (!showQuickView) setAdding(false);
  }, [showQuickView, product.sizes, selectedSize]);

  const displayLang = mounted ? lang : 'en';
  const name = displayLang === 'ar' ? product.name_ar : product.name_en;
  const availableSizes = (product.sizes ?? []).filter((s) => s.inStock && s.price > 0);
  const isOutOfStock = availableSizes.length === 0;

  const lowestInStock = availableSizes.length > 0 ? Math.min(...availableSizes.map((s) => s.price)) : product.base_price;
  const hasSale = Boolean(product.sale_price && product.sale_price > 0 && product.sale_price < lowestInStock);
  const displayPrice = hasSale ? product.sale_price! : lowestInStock;

  function handleAddFromQuickView() {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      productNameEn: product.name_en,
      productNameAr: product.name_ar,
      imageUrl: product.image_url ?? '',
      size: selectedSize.label,
      price: selectedSize.price > 0 ? selectedSize.price : displayPrice,
      quantity: 1,
      slug: product.slug,
    });
    setAdding(true);
    setTimeout(() => { setAdding(false); setShowQuickView(false); }, 1400);
  }

  return (
    <>
      <div className="group" style={{ position: 'relative' }}>
        <Link
          href={`/products/${product.slug}`}
          style={{
            display: 'block',
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.12)',
            borderRadius: 8,
            overflow: 'hidden',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}
        >
          {/* Image area */}
          <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#1C1915', overflow: 'hidden' }}>
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={name}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                className="group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundImage: [
                    'repeating-linear-gradient(45deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 14px)',
                    'repeating-linear-gradient(-45deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 14px)',
                  ].join(', '),
                }}
              >
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#C9A84C', opacity: 0.4 }}>SADU</span>
              </div>
            )}

            {/* Badges — top left */}
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 1 }}>
              {hasSale && (
                <span style={{ backgroundColor: '#C9A84C', color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 3, letterSpacing: '0.06em' }}>
                  SALE
                </span>
              )}
              {product.is_new_arrival && !hasSale && (
                <span style={{ backgroundColor: '#C9A84C', color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 3, letterSpacing: '0.06em' }}>
                  NEW
                </span>
              )}
              {product.is_best_seller && !hasSale && !product.is_new_arrival && (
                <span style={{ backgroundColor: 'rgba(63,125,88,0.92)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>
                  BESTSELLER
                </span>
              )}
              {isOutOfStock && (
                <span style={{ backgroundColor: 'rgba(20,18,16,0.88)', color: 'rgba(246,239,226,0.55)', fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Quick View overlay */}
            <div
              className="opacity-0 group-hover:opacity-100"
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.28)',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: 14,
                transition: 'opacity 0.2s',
              }}
            >
              <button
                onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '8px 20px',
                  borderRadius: 3,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Quick View
              </button>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '12px 14px 14px' }}>
            <p
              style={{
                fontFamily: displayLang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
                fontSize: displayLang === 'ar' ? 14 : 17,
                fontWeight: 600,
                color: '#F6EFE2',
                lineHeight: 1.3,
                marginBottom: 6,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              } as React.CSSProperties}
            >
              {name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#C9A84C', fontSize: 14, fontWeight: 700 }}>
                AED {displayPrice.toLocaleString()}
              </span>
              {hasSale && (
                <span style={{ color: 'rgba(246,239,226,0.3)', fontSize: 12, textDecoration: 'line-through' }}>
                  AED {lowestInStock.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowQuickView(false)}
        >
          <div
            style={{
              backgroundColor: '#12100E',
              border: '1px solid rgba(201,163,91,0.2)',
              borderRadius: 12,
              width: '100%',
              maxWidth: 740,
              maxHeight: '90vh',
              overflow: 'auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowQuickView(false)}
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: '#F6EFE2',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>

            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#1C1915', borderRadius: '12px 0 0 12px', overflow: 'hidden' }}>
              {product.image_url ? (
                <Image src={product.image_url} alt={name} fill style={{ objectFit: 'cover' }} sizes="370px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#C9A84C', opacity: 0.4 }}>SADU</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div style={{ padding: '28px 24px 24px', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#F6EFE2', lineHeight: 1.25, marginBottom: 6 }}>
                {product.name_en}
              </p>
              <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'rgba(246,239,226,0.5)', marginBottom: 16, direction: 'rtl', textAlign: 'right' }}>
                {product.name_ar}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ color: '#C9A84C', fontSize: 20, fontWeight: 700 }}>
                  AED {displayPrice.toLocaleString()}
                </span>
                {hasSale && (
                  <span style={{ color: 'rgba(246,239,226,0.3)', fontSize: 14, textDecoration: 'line-through' }}>
                    AED {lowestInStock.toLocaleString()}
                  </span>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(201,163,91,0.1)', paddingTop: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(246,239,226,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Select Size
                </p>
                <SizeSelector
                  sizes={product.sizes ?? []}
                  selected={selectedSize?.label ?? null}
                  onSelect={setSelectedSize}
                />
              </div>

              <div style={{ marginTop: 'auto' }}>
                {isOutOfStock ? (
                  <div style={{ padding: '12px', backgroundColor: 'rgba(181,71,71,0.1)', border: '1px solid rgba(181,71,71,0.2)', borderRadius: 6, color: '#B54747', fontSize: 13, textAlign: 'center' }}>
                    Out of stock
                  </div>
                ) : (
                  <button
                    onClick={handleAddFromQuickView}
                    disabled={!selectedSize}
                    style={{
                      width: '100%', padding: '13px',
                      backgroundColor: adding ? 'rgba(63,125,88,0.9)' : '#C9A84C',
                      color: '#000', fontSize: 12, fontWeight: 700,
                      border: 'none', borderRadius: 6,
                      cursor: selectedSize ? 'pointer' : 'not-allowed',
                      opacity: selectedSize ? 1 : 0.5,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'background-color 0.2s',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {adding ? <Check size={14} /> : <ShoppingBag size={14} />}
                    {adding ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                )}

                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => setShowQuickView(false)}
                  style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'rgba(246,239,226,0.45)', fontSize: 12, textDecoration: 'underline' }}
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
