'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLangStore } from '@/store/langStore';

const NAV_LINKS = [
  { en: 'Home', ar: 'الرئيسية', href: '/' },
  { en: 'All Collections', ar: 'جميع المجموعات', href: '/collections/all' },
  { en: 'Men', ar: 'رجال', href: '/collections/men' },
  { en: 'Women', ar: 'نساء', href: '/collections/women' },
  { en: 'Unisex', ar: 'للجميع', href: '/collections/unisex' },
  { en: 'Brands', ar: 'الماركات', href: '/brands' },
  { en: 'New Arrivals', ar: 'وصل حديثاً', href: '/collections/new-arrivals' },
  { en: 'Track Order', ar: 'تتبع الطلب', href: '/track-order' },
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
  const activeLang = mounted ? lang : 'ar';

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Main header — sticky */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(8,7,6,0.97)' : '#080706',
        borderBottom: '1px solid rgba(201,163,91,0.1)',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background-color 0.25s',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 60 }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', marginRight: 16 }}>
              <Image src="/logos/sadu-logo.png" alt="SADU" width={44} height={44} priority />
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden lg:flex" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 0, display: 'flex' }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive(link.href) ? '#C9A84C' : 'rgba(246,239,226,0.68)',
                    fontSize: 12,
                    fontWeight: isActive(link.href) ? 600 : 400,
                    padding: '6px 10px',
                    borderRadius: 4,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em',
                    transition: 'color 0.15s',
                  }}
                >
                  {activeLang === 'ar' ? link.ar : link.en}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
              <button
                onClick={toggle}
                style={{
                  color: 'rgba(246,239,226,0.55)',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '4px 9px',
                  borderRadius: 4,
                  border: '1px solid rgba(201,163,91,0.2)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                }}
              >
                {mounted ? (lang === 'en' ? 'عربي' : 'EN') : 'عربي'}
              </button>

              <Link href="/account" style={{ padding: 8, color: 'rgba(246,239,226,0.7)', display: 'flex' }}>
                <User size={18} />
              </Link>

              <Link href="/cart" style={{ padding: 8, color: '#F6EFE2', position: 'relative', display: 'flex' }}>
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 3, right: 3,
                    backgroundColor: '#C9A84C', color: '#000',
                    fontSize: 9, fontWeight: 800, borderRadius: '50%',
                    width: 15, height: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex lg:hidden"
                style={{ padding: 8, color: '#F6EFE2', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden" style={{ backgroundColor: '#0C0B09', borderTop: '1px solid rgba(201,163,91,0.08)', padding: '4px 0 12px' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '11px 20px',
                  color: isActive(link.href) ? '#C9A84C' : 'rgba(246,239,226,0.7)',
                  fontSize: 14,
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
    </>
  );
}
