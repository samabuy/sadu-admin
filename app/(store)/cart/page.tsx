'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal, getCount } = useCartStore();
  const lang = useLangStore((s) => s.lang);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading cart…</p>
      </div>
    );
  }

  const total = getTotal();
  const count = getCount();

  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <ShoppingBag
          size={56}
          style={{ color: 'var(--text-secondary)', opacity: 0.4, margin: '0 auto 24px' }}
        />
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          {lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
          {lang === 'ar'
            ? 'استكشف مجموعتنا من العطور الفاخرة'
            : 'Explore our luxury fragrance collection'}
        </p>
        <Link
          href="/collections/all"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--gold)',
            color: '#000',
            padding: '13px 32px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          {lang === 'ar' ? 'تسوق الآن' : 'Shop Now'}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}
      >
        {lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 36 }}>
        {count} {count === 1 ? (lang === 'ar' ? 'منتج' : 'item') : (lang === 'ar' ? 'منتجات' : 'items')}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* Items list */}
        <div style={{ gridColumn: 'span 2' }} className="lg:col-span-2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}`}
                style={{
                  display: 'flex',
                  gap: 20,
                  padding: '20px 0',
                  borderBottom:
                    idx < items.length - 1 ? '1px solid rgba(201,163,91,0.1)' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                {/* Image */}
                <Link href={`/products/${item.slug}`} style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: 88,
                      height: 110,
                      borderRadius: 8,
                      overflow: 'hidden',
                      backgroundColor: '#12100E',
                      border: '1px solid rgba(201,163,91,0.1)',
                      position: 'relative',
                    }}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productNameEn}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="88px"
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: 10, color: 'var(--gold)', opacity: 0.4 }}>
                          SADU
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/products/${item.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: 2,
                        direction: 'rtl',
                        textAlign: 'right',
                      }}
                    >
                      {item.productNameAr}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        marginBottom: 6,
                      }}
                    >
                      {item.productNameEn}
                    </p>
                  </Link>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 12 }}>
                    {lang === 'ar' ? 'الحجم:' : 'Size:'} {item.size}
                  </p>

                  {/* Qty + Remove */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '6px 0 0 6px',
                          border: '1px solid rgba(201,163,91,0.2)',
                          backgroundColor: 'transparent',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <div
                        style={{
                          width: 40,
                          height: 30,
                          border: '1px solid rgba(201,163,91,0.2)',
                          borderLeft: 'none',
                          borderRight: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                        }}
                      >
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '0 6px 6px 0',
                          border: '1px solid rgba(201,163,91,0.2)',
                          backgroundColor: 'transparent',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      style={{
                        color: 'var(--error)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                      }}
                    >
                      <Trash2 size={13} />
                      {lang === 'ar' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: 'var(--gold)', fontSize: 16, fontWeight: 700 }}>
                    AED {(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 2 }}>
                      AED {item.price.toLocaleString()} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            backgroundColor: '#12100E',
            border: '1px solid rgba(201,163,91,0.15)',
            borderRadius: 12,
            padding: 24,
            position: 'sticky',
            top: 80,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}
          >
            {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                {lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
              </span>
              <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>
                AED {total.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                {lang === 'ar' ? 'رسوم التوصيل' : 'Delivery'}
              </span>
              <span style={{ color: 'var(--success)', fontSize: 13, fontWeight: 500 }}>
                {lang === 'ar' ? 'مجاني' : 'Free'}
              </span>
            </div>
            <div
              style={{
                borderTop: '1px solid rgba(201,163,91,0.12)',
                paddingTop: 12,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>
                {lang === 'ar' ? 'الإجمالي' : 'Total'}
              </span>
              <span style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 700 }}>
                AED {total.toLocaleString()}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '13px',
              borderRadius: 8,
              backgroundColor: 'var(--gold)',
              color: '#000',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 10,
            }}
          >
            {lang === 'ar' ? 'الدفع' : 'Proceed to Checkout'}
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/collections/all"
            style={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: 13,
              textDecoration: 'none',
              padding: '8px',
            }}
          >
            {lang === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </div>
  );
}
