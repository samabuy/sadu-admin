'use client';

import { useState, useEffect } from 'react';
import { useLangStore } from '@/store/langStore';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function StoreShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const lang = useLangStore((s) => s.lang);

  useEffect(() => setMounted(true), []);

  return (
    <div
      data-store=""
      dir={mounted && lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#080706',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
