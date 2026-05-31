'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 0,
    titleEn: 'Discover Your Signature Scent',
    titleAr: 'اكتشف عطرك المميز',
    href: '/collections/all',
    bg: 'linear-gradient(135deg, #080706 0%, #1A130A 60%, #080706 100%)',
    glow: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(201,168,76,0.14) 0%, transparent 65%)',
  },
  {
    id: 1,
    titleEn: 'New Arrivals',
    titleAr: 'وصل حديثاً',
    href: '/collections/new-arrivals',
    bg: 'linear-gradient(135deg, #06080A 0%, #0D1419 60%, #06080A 100%)',
    glow: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(100,160,201,0.10) 0%, transparent 65%)',
  },
  {
    id: 2,
    titleEn: "Men's Collection",
    titleAr: 'مجموعة الرجال',
    href: '/collections/men',
    bg: 'linear-gradient(135deg, #070608 0%, #12101A 60%, #070608 100%)',
    glow: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(150,100,200,0.09) 0%, transparent 65%)',
  },
];

const PATTERN = [
  'repeating-linear-gradient(45deg, rgba(201,168,76,0.025) 0px, rgba(201,168,76,0.025) 1px, transparent 1px, transparent 20px)',
  'repeating-linear-gradient(-45deg, rgba(201,168,76,0.025) 0px, rgba(201,168,76,0.025) 1px, transparent 1px, transparent 20px)',
].join(', ');

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          position: 'relative',
          height: 'clamp(300px, 42vw, 500px)',
          background: slide.bg,
          transition: 'background 0.6s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: PATTERN, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: slide.glow, pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 40px', maxWidth: 700 }}>
          <p style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 14,
            color: '#C9A84C',
            marginBottom: 14,
            opacity: 0.9,
            letterSpacing: '0.04em',
          }}>
            {slide.titleAr}
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px, 5vw, 62px)',
            fontWeight: 600,
            color: '#F6EFE2',
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: '-0.01em',
          }}>
            {slide.titleEn}
          </h2>
          <Link
            href={slide.href}
            style={{
              display: 'inline-block',
              backgroundColor: '#C9A84C',
              color: '#000',
              padding: '12px 42px',
              borderRadius: 3,
              fontSize: 11,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Shop Now
          </Link>
        </div>

        {/* Prev / Next arrows */}
        {[{ dir: 'prev', side: 'left', icon: '‹' }, { dir: 'next', side: 'right', icon: '›' }].map(({ dir, side, icon }) => (
          <button
            key={dir}
            onClick={dir === 'prev' ? prev : next}
            style={{
              position: 'absolute',
              [side]: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(201,163,91,0.25)',
              color: '#C9A84C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              lineHeight: 1,
              zIndex: 2,
            }}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Dots */}
      <div style={{
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 6,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 22 : 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: i === current ? '#C9A84C' : 'rgba(201,163,91,0.35)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
