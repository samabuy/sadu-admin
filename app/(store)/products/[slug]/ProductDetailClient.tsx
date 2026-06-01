'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, Minus, Plus, Check, ChevronDown, Eye } from 'lucide-react';
import { SizeSelector } from '@/components/store/SizeSelector';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';
import type { StoreProduct, Size } from '@/types/store';

interface Props {
  product: StoreProduct;
}

export function ProductDetailClient({ product }: Props) {
  const lang = useLangStore((s) => s.lang);
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState<Size | null>(
    () => (product.sizes ?? []).find((s) => s.inStock) ?? null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('description');
  const [shippingOpen, setShippingOpen] = useState(false);
  const [watchers, setWatchers] = useState(0);
  const [mainImage, setMainImage] = useState(product.image_url ?? '');

  useEffect(() => {
    setWatchers(Math.floor(Math.random() * 7) + 2);
  }, []);

  const name = lang === 'ar' ? product.name_ar : product.name_en;

  const availableSizes = (product.sizes ?? []).filter((s) => s.inStock && s.price > 0);
  const inStockSizes = (product.sizes ?? []).filter((s) => s.inStock);
  const isOutOfStock = inStockSizes.length === 0;

  const lowestPrice = availableSizes.length > 0 ? Math.min(...availableSizes.map((s) => s.price)) : product.base_price;
  const hasSale = Boolean(product.sale_price && product.sale_price > 0 && product.sale_price < lowestPrice);
  const displayPrice = selectedSize?.price && selectedSize.price > 0
    ? (hasSale && product.sale_price! < selectedSize.price ? product.sale_price! : selectedSize.price)
    : (hasSale ? product.sale_price! : lowestPrice);

  const galleryImages = [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.gallery_urls ?? []),
  ].filter(Boolean);

  function addToCart() {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      productNameEn: product.name_en,
      productNameAr: product.name_ar,
      imageUrl: product.image_url ?? '',
      size: selectedSize.label,
      price: displayPrice,
      quantity: qty,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waText = encodeURIComponent(
    `أريد طلب: ${product.name_ar} - ${selectedSize?.label ?? ''} (${lang === 'ar' ? 'الكمية' : 'Qty'}: ${qty})`,
  );

  const topNotes = (product.product_notes ?? []).filter((n) => n.note_type === 'top');
  const heartNotes = (product.product_notes ?? []).filter((n) => n.note_type === 'heart');
  const baseNotes = (product.product_notes ?? []).filter((n) => n.note_type === 'base');

  const PATTERN_BG = [
    'repeating-linear-gradient(45deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 16px)',
    'repeating-linear-gradient(-45deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 16px)',
  ].join(', ');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>

      {/* ── Left: Image + Gallery ─────────────────────────── */}
      <div>
        {/* Main image */}
        <div style={{
          position: 'relative', aspectRatio: '3/4',
          borderRadius: 12, overflow: 'hidden',
          backgroundColor: '#12100E',
          border: '1px solid rgba(201,163,91,0.12)',
          marginBottom: 12,
        }}>
          {mainImage ? (
            <Image src={mainImage} alt={name} fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundImage: PATTERN_BG }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: '#C9A84C', opacity: 0.3 }}>SADU</span>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {hasSale && <span style={{ backgroundColor: '#C9A84C', color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 3 }}>SALE</span>}
            {product.is_new_arrival && !hasSale && <span style={{ backgroundColor: '#C9A84C', color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 3 }}>NEW</span>}
            {product.is_best_seller && <span style={{ backgroundColor: 'rgba(63,125,88,0.92)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 3 }}>BESTSELLER</span>}
            {product.is_limited_edition && <span style={{ backgroundColor: 'rgba(181,71,71,0.9)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 3 }}>LIMITED</span>}
          </div>
        </div>

        {/* Thumbnail gallery */}
        {galleryImages.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {galleryImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setMainImage(url)}
                style={{
                  position: 'relative', width: 68, height: 90,
                  borderRadius: 6, overflow: 'hidden',
                  border: mainImage === url ? '2px solid #C9A84C' : '1px solid rgba(201,163,91,0.15)',
                  backgroundColor: '#12100E', cursor: 'pointer', padding: 0,
                  transition: 'border-color 0.15s',
                }}
              >
                <Image src={url} alt={`${name} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="68px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Details ───────────────────────────────── */}
      <div>
        {/* Name */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: '#F6EFE2', lineHeight: 1.2, marginBottom: 6 }}>
          {product.name_en}
        </h1>
        <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 17, fontWeight: 600, color: 'rgba(246,239,226,0.55)', marginBottom: 16, direction: 'rtl', textAlign: 'right' }}>
          {product.name_ar}
        </p>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#C9A84C', fontFamily: "'Cormorant Garamond', serif" }}>
            AED {displayPrice.toLocaleString()}
          </span>
          {hasSale && (
            <span style={{ fontSize: 18, color: 'rgba(246,239,226,0.3)', textDecoration: 'line-through', fontFamily: "'Cormorant Garamond', serif" }}>
              AED {lowestPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(201,163,91,0.12)', marginBottom: 20 }} />

        {/* Size selector */}
        {(product.sizes ?? []).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(246,239,226,0.45)', marginBottom: 10 }}>
              {lang === 'ar' ? 'الحجم' : 'Size'}
              {selectedSize && (
                <span style={{ marginLeft: 8, color: '#C9A84C', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  — AED {displayPrice.toLocaleString()}
                </span>
              )}
            </p>
            <SizeSelector sizes={product.sizes ?? []} selected={selectedSize?.label ?? null} onSelect={setSelectedSize} />
          </div>
        )}

        {/* Stock indicator */}
        {isOutOfStock ? (
          <p style={{ color: '#B54747', fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
            {lang === 'ar' ? 'غير متوفر حالياً' : 'Out of stock'}
          </p>
        ) : inStockSizes.length <= 3 ? (
          <p style={{ color: '#C9A84C', fontSize: 12, marginBottom: 16, fontWeight: 600 }}>
            ⚡ Only {inStockSizes.length} item{inStockSizes.length !== 1 ? 's' : ''} in stock!
          </p>
        ) : null}

        {/* Quantity */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(246,239,226,0.45)', marginBottom: 10 }}>
            {lang === 'ar' ? 'الكمية' : 'Quantity'}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: '6px 0 0 6px', border: '1px solid rgba(201,163,91,0.25)', backgroundColor: 'transparent', color: '#F6EFE2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Minus size={13} />
            </button>
            <div style={{ width: 48, height: 36, border: '1px solid rgba(201,163,91,0.25)', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#F6EFE2' }}>
              {qty}
            </div>
            <button onClick={() => setQty((q) => q + 1)} style={{ width: 36, height: 36, borderRadius: '0 6px 6px 0', border: '1px solid rgba(201,163,91,0.25)', backgroundColor: 'transparent', color: '#F6EFE2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button
            onClick={addToCart}
            disabled={!selectedSize || isOutOfStock}
            style={{
              width: '100%', padding: '14px',
              borderRadius: 6,
              backgroundColor: added ? 'rgba(63,125,88,0.9)' : '#C9A84C',
              color: '#000', fontSize: 13, fontWeight: 700,
              border: 'none',
              cursor: (!selectedSize || isOutOfStock) ? 'not-allowed' : 'pointer',
              opacity: (!selectedSize || isOutOfStock) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background-color 0.2s',
              letterSpacing: '0.05em',
            }}
          >
            {added ? <Check size={15} /> : <ShoppingBag size={15} />}
            {added
              ? (lang === 'ar' ? 'تمت الإضافة ✓' : 'Added to Cart ✓')
              : (lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart')}
          </button>

          <a
            href={`https://wa.me/971554955153?text=${waText}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              width: '100%', padding: '13px',
              borderRadius: 6,
              border: '1px solid rgba(37,211,102,0.3)',
              backgroundColor: 'rgba(37,211,102,0.05)',
              color: '#25D366', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              textDecoration: 'none',
            }}
          >
            <MessageCircle size={15} />
            {lang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
          </a>
        </div>

        {/* Social proof */}
        {watchers > 0 && (
          <p style={{ fontSize: 12, color: 'rgba(246,239,226,0.45)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Eye size={13} style={{ color: '#C9A84C' }} />
            {watchers} {lang === 'ar' ? 'أشخاص يشاهدون هذا المنتج الآن' : `people watching this product now!`}
          </p>
        )}

        {/* Description + Notes tabs */}
        <div style={{ borderTop: '1px solid rgba(201,163,91,0.1)', paddingTop: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 18, borderBottom: '1px solid rgba(201,163,91,0.08)' }}>
            {[
              { id: 'description', en: 'Description', ar: 'الوصف' },
              { id: 'notes', en: 'Scent Notes', ar: 'مكونات العطر' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '9px 16px', fontSize: 12,
                  fontWeight: tab === t.id ? 600 : 400,
                  color: tab === t.id ? '#C9A84C' : 'rgba(246,239,226,0.5)',
                  borderBottom: `2px solid ${tab === t.id ? '#C9A84C' : 'transparent'}`,
                  backgroundColor: 'transparent', border: 'none',
                  borderBottomStyle: 'solid', borderBottomWidth: 2,
                  borderBottomColor: tab === t.id ? '#C9A84C' : 'transparent',
                  cursor: 'pointer', transition: 'color 0.15s',
                }}
              >
                {lang === 'ar' ? t.ar : t.en}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div>
              <p style={{ color: 'rgba(246,239,226,0.65)', fontSize: 14, lineHeight: 1.85 }}>
                {lang === 'ar'
                  ? (product.description_ar ?? product.description_en ?? 'A signature fragrance from SADU.')
                  : (product.description_en ?? 'A signature fragrance from SADU.')}
              </p>
              {product.scent_story_en && (
                <p style={{ color: 'rgba(246,239,226,0.5)', fontSize: 13, lineHeight: 1.85, marginTop: 14, fontStyle: 'italic' }}>
                  {lang === 'ar' ? (product.scent_story_ar ?? product.scent_story_en) : product.scent_story_en}
                </p>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'Top Notes', labelAr: 'نوتات القمة', notes: topNotes },
                { label: 'Heart Notes', labelAr: 'نوتات القلب', notes: heartNotes },
                { label: 'Base Notes', labelAr: 'نوتات القاعدة', notes: baseNotes },
              ].map(({ label, labelAr, notes }) =>
                notes.length > 0 ? (
                  <div key={label}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
                      {lang === 'ar' ? labelAr : label}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {notes.map((n) => (
                        <span key={n.note_name_en} style={{ padding: '4px 12px', borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,163,91,0.18)', color: 'rgba(246,239,226,0.6)', fontSize: 12 }}>
                          {lang === 'ar' ? n.note_name_ar : n.note_name_en}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
              {topNotes.length === 0 && heartNotes.length === 0 && baseNotes.length === 0 && (
                <p style={{ color: 'rgba(246,239,226,0.4)', fontSize: 14 }}>Scent notes coming soon.</p>
              )}
            </div>
          )}
        </div>

        {/* Shipping accordion */}
        <div style={{ borderTop: '1px solid rgba(201,163,91,0.1)' }}>
          <button
            onClick={() => setShippingOpen(!shippingOpen)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0', backgroundColor: 'transparent', border: 'none',
              color: 'rgba(246,239,226,0.65)', cursor: 'pointer', fontSize: 12,
              fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            {lang === 'ar' ? 'سياسة الشحن' : 'Shipping Policy'}
            <ChevronDown size={14} style={{ transform: shippingOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#C9A84C' }} />
          </button>
          {shippingOpen && (
            <div style={{ paddingBottom: 20, color: 'rgba(246,239,226,0.55)', fontSize: 13, lineHeight: 1.85 }}>
              <p style={{ marginBottom: 8 }}>🚚 {lang === 'ar' ? 'التوصيل مجاني لجميع الطلبات في الإمارات.' : 'Free delivery on all orders across the UAE.'}</p>
              <p style={{ marginBottom: 8 }}>⏱ {lang === 'ar' ? 'يصلك خلال 2-5 أيام عمل.' : '2–5 business days delivery.'}</p>
              <p style={{ marginBottom: 8 }}>📦 {lang === 'ar' ? 'تغليف فاخر مع رسالة هدية اختيارية.' : 'Luxury packaging with optional gift message.'}</p>
              <p>↩ {lang === 'ar' ? 'الإرجاع مقبول خلال 7 أيام للمنتجات غير المفتوحة.' : '7-day returns on unopened products.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
