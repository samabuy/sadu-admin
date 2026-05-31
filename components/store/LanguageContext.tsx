'use client';

import { createContext, useContext } from 'react';
import { useLangStore } from '@/store/langStore';

type Lang = 'ar' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
  fontFamily: string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ar',
  setLang: () => {},
  t: (ar) => ar,
  dir: 'rtl',
  fontFamily: "'Cairo', sans-serif",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLangStore();
  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontFamily = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, fontFamily }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
