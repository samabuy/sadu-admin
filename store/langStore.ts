import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LangStore {
  lang: 'en' | 'ar';
  toggle: () => void;
  setLang: (lang: 'en' | 'ar') => void;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      toggle: () => set({ lang: get().lang === 'en' ? 'ar' : 'en' }),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'sadu-lang' },
  ),
);
