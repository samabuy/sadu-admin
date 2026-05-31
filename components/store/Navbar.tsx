'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';

const NAV_LINKS = [
  { en: 'Men', ar: 'رجال', href: '/collections/men' },
  { en: 'Women', ar: 'نساء', href: '/collections/women' },
  { en: 'Unisex', ar: 'للجميع', href: '/collections/unisex' },
  { en: 'Brands', ar: 'الماركات', href: '/brands' },
  { en: 'New Arrivals', ar: 'وصل حديثاً', href: '/collections/new-arrivals' },
  { en: 'Track Order', ar: 'تتبع الطلب', href: '/track-order' },
  { en: 'SADU Club', ar: 'نادي سدو', href: '/sadu-club' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const count = useCartStore((s) => s.getCount());
  const { lang, toggle } = useLangStore();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartCount = mounted ? count : 0;
  const activeLang = mounted ? lang : 'en';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(8,7,6,0.96)' : '#080706',
        borderBottom: '1px solid rgba(201,163,91,0.1)',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background-color 0.25s',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: '0.06em',
              }}
            >
              SADU
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active ? 'var(--gold)' : 'var(--text-secondary)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    padding: '6px 11px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                >
                  {activeLang === 'ar' ? link.ar : link.en}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Lang toggle */}
            <button
              onClick={toggle}
              style={{
                color: 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid rgba(201,163,91,0.2)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {mounted ? (lang === 'en' ? 'عربي' : 'EN') : 'عربي'}
            </button>

            {/* Account */}
            <Link
              href="/account"
              style={{ padding: 8, color: 'var(--text-secondary)', display: 'flex' }}
            >
              <User size={19} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              style={{ padding: 8, color: 'var(--text-primary)', position: 'relative', display: 'flex' }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    backgroundColor: 'var(--gold)',
                    color: '#000',
                    fontSize: 9,
                    fontWeight: 800,
                    borderRadius: '50%',
                    width: 15,
                    height: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                padding: 8,
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
              }}
              className="flex md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: '#080706',
            borderTop: '1px solid rgba(201,163,91,0.08)',
            padding: '8px 0 16px',
          }}
          className="md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 24px',
                color:
                  pathname === link.href ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: 15,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(201,163,91,0.05)',
              }}
            >
              {activeLang === 'ar' ? link.ar : link.en}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
