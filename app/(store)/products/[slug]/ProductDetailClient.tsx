'use client';

import { useState } from 'react';
import { ShoppingBag, MessageCircle, Minus, Plus, Check } from 'lucide-react';
import { SizeSelector } from '@/components/store/SizeSelector';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';
import type { StoreProduct, Size } from '@/types/store';

interface Tab { id: string; labelEn: string; labelAr: string }
const TABS: Tab[] = [
  { id: 'description', labelEn: 'Description', labelAr: 'الوصف' },
  { id: 'notes', labelEn: 'Scent Notes', labelAr: 'مكونات العطر' },
  { id: 'shipping', labelEn: 'Shipping', labelAr: 'الشحن' },
];

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
  const [tab, setTab] = useState('description');
  const [added, setAdded] = useState(false);

  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const price = selectedSize?.price && selectedSize.price > 0 ? selectedSize.price : product.base_price;
  const inStockSizes = (product.sizes ?? []).filter((s) => s.inStock);

  function addToCart() {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      productNameEn: product.name_en,
      productNameAr: product.name_ar,
      imageUrl: product.image_url ?? '',
      size: selectedSize.label,
      price,
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

  return (
    <div>
      {/* Size + Qty */}
      {(product.sizes ?? []).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: 10,
            }}
          >
            {lang === 'ar' ? 'الحجم' : 'Size'}
            {selectedSize && (
              <span style={{ marginLeft: 8, color: 'var(--gold)' }}>
                — AED {price.toLocaleString()}
              </span>
            )}
          </p>
          <SizeSelector
            sizes={product.sizes ?? []}
            selected={selectedSize?.label ?? null}
            onSelect={setSelectedSize}
          />
        </div>
      )}

      {/* Stock indicator */}
      {inStockSizes.length === 0 && (
        <p
          style={{
            color: 'var(--error)',
            fontSize: 13,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {lang === 'ar' ? 'غير متوفر حالياً' : 'Out of stock'}
        </p>
      )}
      {inStockSizes.length > 0 && inStockSizes.length <= 2 && (
        <p
          style={{
            color: 'var(--warning)',
            fontSize: 12,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {lang === 'ar' ? 'كميات محدودة' : 'Limited stock remaining'}
        </p>
      )}

      {/* Quantity */}
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: 10,
          }}
        >
          {lang === 'ar' ? 'الكمية' : 'Quantity'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px 0 0 8px',
              border: '1px solid rgba(201,163,91,0.25)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Minus size={14} />
          </button>
          <div
            style={{
              width: 48,
              height: 36,
              border: '1px solid rgba(201,163,91,0.25)',
              borderLeft: 'none',
              borderRight: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {qty}
          </div>
          <button
            onClick={() => setQty((q) => q + 1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '0 8px 8px 0',
              border: '1px solid rgba(201,163,91,0.25)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <button
          onClick={addToCart}
          disabled={!selectedSize || inStockSizes.length === 0}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 8,
            backgroundColor: added ? 'rgba(63,125,88,0.9)' : 'var(--gold)',
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            cursor: (!selectedSize || inStockSizes.length === 0) ? 'not-allowed' : 'pointer',
            opacity: (!selectedSize || inStockSizes.length === 0) ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background-color 0.2s',
          }}
        >
          {added ? <Check size={16} /> : <ShoppingBag size={16} />}
          {added
            ? lang === 'ar' ? 'تمت الإضافة ✓' : 'Added to Cart ✓'
            : lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
        </button>

        <a
          href={`https://wa.me/971500000000?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 8,
            border: '1px solid rgba(37,211,102,0.35)',
            backgroundColor: 'rgba(37,211,102,0.05)',
            color: '#25D366',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <MessageCircle size={16} />
          {lang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
        </a>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 40, borderTop: '1px solid rgba(201,163,91,0.12)', paddingTop: 28 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid rgba(201,163,91,0.1)' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? 'var(--gold)' : 'var(--text-secondary)',
                borderBottom: tab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottomStyle: 'solid',
                borderBottomWidth: 2,
                borderBottomColor: tab === t.id ? 'var(--gold)' : 'transparent',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              {lang === 'ar' ? t.labelAr : t.labelEn}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div>
            {product.description_en || product.description_ar ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.85 }}>
                {lang === 'ar' ? (product.description_ar ?? product.description_en) : (product.description_en ?? product.description_ar)}
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                A signature fragrance from SADU.
              </p>
            )}
            {product.scent_story_en && (
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  lineHeight: 1.85,
                  marginTop: 16,
                  fontStyle: 'italic',
                }}
              >
                {lang === 'ar'
                  ? (product.scent_story_ar ?? product.scent_story_en)
                  : product.scent_story_en}
              </p>
            )}
          </div>
        )}

        {tab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Top Notes', labelAr: 'نوتات القمة', notes: topNotes },
              { label: 'Heart Notes', labelAr: 'نوتات القلب', notes: heartNotes },
              { label: 'Base Notes', labelAr: 'نوتات القاعدة', notes: baseNotes },
            ].map(({ label, labelAr, notes }) =>
              notes.length > 0 ? (
                <div key={label}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      marginBottom: 8,
                    }}
                  >
                    {lang === 'ar' ? labelAr : label}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {notes.map((n) => (
                      <span
                        key={n.note_name_en}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          backgroundColor: 'rgba(201,168,76,0.08)',
                          border: '1px solid rgba(201,163,91,0.2)',
                          color: 'var(--text-secondary)',
                          fontSize: 12,
                        }}
                      >
                        {lang === 'ar' ? n.note_name_ar : n.note_name_en}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
            {topNotes.length === 0 && heartNotes.length === 0 && baseNotes.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Scent notes coming soon.
              </p>
            )}
          </div>
        )}

        {tab === 'shipping' && (
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.85 }}>
            <p style={{ marginBottom: 12 }}>🚚 {lang === 'ar' ? 'التوصيل مجاني لجميع الطلبات في الإمارات.' : 'Free delivery on all orders across the UAE.'}</p>
            <p style={{ marginBottom: 12 }}>⏱ {lang === 'ar' ? 'يصلك خلال 2-5 أيام عمل.' : '2–5 business days delivery.'}</p>
            <p style={{ marginBottom: 12 }}>📦 {lang === 'ar' ? 'تغليف فاخر مع رسالة هدية اختيارية.' : 'Luxury packaging with optional gift message.'}</p>
            <p>↩ {lang === 'ar' ? 'الإرجاع مقبول خلال 7 أيام للمنتجات غير المفتوحة.' : '7-day returns on unopened products.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
