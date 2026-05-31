'use client';

import { useState, useEffect } from 'react';
import { useLangStore } from '@/store/langStore';
import { LanguageProvider } from './LanguageContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function StoreShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const lang = useLangStore((s) => s.lang);

  useEffect(() => setMounted(true), []);

  const activeLang = mounted ? lang : 'ar';
  const dir = activeLang === 'ar' ? 'rtl' : 'ltr';
  const fontFamily = activeLang === 'ar'
    ? "'Cairo', sans-serif"
    : "'Cormorant Garamond', 'Inter', sans-serif";

  return (
    <LanguageProvider>
      <div
        data-store=""
        dir={dir}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#080706',
          color: 'var(--text-primary)',
          fontFamily,
        }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
