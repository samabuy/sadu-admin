'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  base_price: number;
  image_url: string | null;
  scent_family: string;
  is_best_seller: boolean;
  is_new_arrival: boolean;
}

type Lang = 'en' | 'ar';

// ─── Translation content ──────────────────────────────────────────────────────

const t = {
  en: {
    dir: 'ltr' as const,
    nav: {
      story: 'Our Story',
      collection: 'Collection',
      club: 'SADU Club',
      app: 'Download App',
    },
    hero: {
      tagline: 'Crafted from Desert Heritage',
      sub: 'Luxury Arabian perfumery rooted in the art of SADU — where ancient weaving patterns meet modern elegance.',
      cta: 'Explore Collection',
      cta2: 'Our Story',
    },
    story: {
      title: 'The Art of SADU',
      p1: 'Born from the UNESCO-recognized craft of Sadu weaving, our perfumes carry the soul of the Arabian desert. Each fragrance is a thread in a tapestry of heritage — bold, intricate, timeless.',
      p2: 'We blend rare oud, amber, and desert florals sourced from across the Arab world, crafting scents that honour the women who wove the stories of their tribes into every pattern.',
      p3: 'SADU 314 is not merely a perfume brand — it is a living tribute to Emirati culture, identity, and craftsmanship.',
    },
    featured: {
      title: 'Featured Collection',
      sub: 'Discover our most celebrated fragrances',
      bestSeller: 'Best Seller',
      newArrival: 'New Arrival',
      aed: 'AED',
    },
    club: {
      title: 'SADU Club',
      sub: 'A loyalty programme as rare as the fragrances we craft',
      tiers: [
        {
          name: 'Silver Thread',
          nameAr: 'الخيط الفضي',
          points: '0 - 999 pts',
          perks: ['5% off every order', 'Birthday gift', 'Early access to new arrivals'],
          color: '#9CA3AF',
          featured: false,
        },
        {
          name: 'Gold Weave',
          nameAr: 'النسج الذهبي',
          points: '1,000 - 4,999 pts',
          perks: ['10% off every order', 'Free shipping always', 'Exclusive members events', 'Personalised engraving'],
          color: '#C9A84C',
          featured: true,
        },
        {
          name: 'Royal Loom',
          nameAr: 'النول الملكي',
          points: '5,000+ pts',
          perks: ['15% off every order', 'Dedicated concierge', 'Annual Majlis invitation', 'Limited-edition exclusives', 'Same-day delivery'],
          color: '#E8D5A3',
          featured: false,
        },
      ],
      join: 'Join the Club',
    },
    download: {
      title: 'Take SADU with You',
      sub: 'Shop, track orders, earn loyalty points, and explore our full collection — all from your phone.',
      ios: 'App Store',
      android: 'Google Play',
      soon: 'Coming Soon',
    },
    footer: {
      tagline: 'Luxury Arabian Perfumery',
      links: ['Privacy Policy', 'Terms of Service', 'Contact Us'],
      copy: '2025 SADU 314. All rights reserved.',
      made: 'Made with pride in the UAE',
    },
  },
  ar: {
    dir: 'rtl' as const,
    nav: {
      story: 'قصتنا',
      collection: 'المجموعة',
      club: 'نادي سادو',
      app: 'حمّل التطبيق',
    },
    hero: {
      tagline: 'مستوحى من تراث الصحراء',
      sub: 'عطور فاخرة بعربية أصيلة، متجذّرة في فن السدو — حيث تلتقي أنماط النسج القديمة بالأناقة الحديثة.',
      cta: 'استعرض المجموعة',
      cta2: 'قصتنا',
    },
    story: {
      title: 'فن السدو',
      p1: 'وُلدنا من رحم حرفة السدو المعترف بها من اليونسكو؛ عطورنا تحمل روح الصحراء العربية. كل عطر خيط في نسيج من الموروث — جريء، معقّد، خالد.',
      p2: 'نمزج العود النادر والعنبر وزهور الصحراء المُستقاة من أنحاء العالم العربي، لنصنع روائح تُكرّم المرأة التي نسجت قصص قبيلتها في كل نقش.',
      p3: 'سادو 314 ليست مجرد علامة عطور — بل تحية حيّة للثقافة الإماراتية وهويتها وحرفيّتها.',
    },
    featured: {
      title: 'المجموعة المميزة',
      sub: 'اكتشف أبرز عطورنا',
      bestSeller: 'الأكثر مبيعاً',
      newArrival: 'وصل حديثاً',
      aed: 'د.إ',
    },
    club: {
      title: 'نادي سادو',
      sub: 'برنامج ولاء نادر كالعطور التي نصنعها',
      tiers: [
        {
          name: 'الخيط الفضي',
          nameAr: 'Silver Thread',
          points: '0 - 999 نقطة',
          perks: ['خصم 5% على كل طلب', 'هدية عيد الميلاد', 'وصول مبكر للمنتجات الجديدة'],
          color: '#9CA3AF',
          featured: false,
        },
        {
          name: 'النسج الذهبي',
          nameAr: 'Gold Weave',
          points: '1000 - 4999 نقطة',
          perks: ['خصم 10% على كل طلب', 'شحن مجاني دائماً', 'فعاليات حصرية للأعضاء', 'نقش شخصي مجاني'],
          color: '#C9A84C',
          featured: true,
        },
        {
          name: 'النول الملكي',
          nameAr: 'Royal Loom',
          points: '5000+ نقطة',
          perks: ['خصم 15% على كل طلب', 'خدمة كونسيرج مخصصة', 'دعوة مجلس سنوية', 'إصدارات محدودة حصرية', 'توصيل في نفس اليوم'],
          color: '#E8D5A3',
          featured: false,
        },
      ],
      join: 'انضم للنادي',
    },
    download: {
      title: 'احمل سادو معك',
      sub: 'تسوّق، تتبّع طلباتك، اجمع نقاط الولاء، واستكشف مجموعتنا الكاملة — من هاتفك.',
      ios: 'App Store',
      android: 'Google Play',
      soon: 'قريباً',
    },
    footer: {
      tagline: 'عطور عربية فاخرة',
      links: ['سياسة الخصوصية', 'شروط الخدمة', 'تواصل معنا'],
      copy: '2025 سادو 314. جميع الحقوق محفوظة.',
      made: 'صُنع بفخر في الإمارات',
    },
  },
};

// ─── Fallback products ─────────────────────────────────────────────────────────

const FALLBACK_PRODUCTS: Product[] = [
  { id: '1', name_en: 'Desert Oud', name_ar: 'عود الصحراء', base_price: 450, image_url: null, scent_family: 'Woody', is_best_seller: true, is_new_arrival: false },
  { id: '2', name_en: 'Amber Dunes', name_ar: 'كثبان العنبر', base_price: 380, image_url: null, scent_family: 'Oriental', is_best_seller: false, is_new_arrival: true },
  { id: '3', name_en: 'Sadu Noir', name_ar: 'سادو نوار', base_price: 520, image_url: null, scent_family: 'Chypre', is_best_seller: true, is_new_arrival: false },
  { id: '4', name_en: 'Rose of Arabia', name_ar: 'وردة الجزيرة', base_price: 390, image_url: null, scent_family: 'Floral', is_best_seller: false, is_new_arrival: true },
];

// ─── SADU geometric SVG pattern ───────────────────────────────────────────────

function SaduPattern({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="sadu-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect x="30" y="0" width="30" height="30" transform="rotate(45 30 15)" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <rect x="0" y="30" width="30" height="30" transform="rotate(45 0 45)" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="#C9A84C" strokeWidth="0.4" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="#C9A84C" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sadu-geo)" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const copy = t[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) return;
      const res = await fetch(
        `${url}/rest/v1/products?select=id,name_en,name_ar,base_price,image_url,scent_family,is_best_seller,is_new_arrival&is_active=eq.true&or=(is_best_seller.eq.true,is_new_arrival.eq.true)&limit=4`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } },
      );
      if (!res.ok) return;
      const data: Product[] = await res.json();
      if (Array.isArray(data) && data.length > 0) setProducts(data);
    } catch {
      // use fallback silently
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const toggleLang = () => setLang(l => (l === 'en' ? 'ar' : 'en'));

  return (
    <div
      dir={copy.dir}
      lang={lang}
      style={{
        backgroundColor: '#080706',
        color: '#F6EFE2',
        fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .anim-fade-up   { animation: fadeUp 0.8s ease both; }
        .anim-fade-up-2 { animation: fadeUp 0.8s 0.15s ease both; }
        .anim-fade-up-3 { animation: fadeUp 0.8s 0.30s ease both; }
        .anim-fade-up-4 { animation: fadeUp 0.8s 0.45s ease both; }
        .anim-float     { animation: float 4s ease-in-out infinite; }
        .gold-shimmer {
          background: linear-gradient(90deg, #C9A84C 0%, #F6EFE2 40%, #C9A84C 60%, #C9A84C 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(201,168,76,0.15); }
        .btn-gold {
          background: #C9A84C; color: #080706; border: none; cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          font-weight: 600; letter-spacing: 0.05em;
        }
        .btn-gold:hover { background: #D4B85A; transform: scale(1.03); }
        .btn-outline {
          background: transparent; color: #C9A84C; border: 1px solid #C9A84C; cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease; font-weight: 500;
        }
        .btn-outline:hover { background: rgba(201,168,76,0.1); transform: scale(1.03); }
        .nav-link {
          color: #F6EFE2; text-decoration: none; font-size: 0.9rem; letter-spacing: 0.04em;
          opacity: 0.85; transition: opacity 0.2s, color 0.2s; cursor: pointer;
          background: none; border: none;
        }
        .nav-link:hover { opacity: 1; color: #C9A84C; }
        .featured-badge { animation: pulse-gold 2s ease-in-out infinite; }
        .tier-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .tier-card:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(201,168,76,0.2); }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.8rem !important; }
          .section-title { font-size: 2rem !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 2rem', height: '70px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: scrolled ? 'rgba(8,7,6,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
          transition: 'background-color 0.4s ease, border-bottom 0.4s ease',
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px' }}
          aria-label="SADU 314 home"
        >
          <Image src="/logos/SADU314_transparent_256x256.png" alt="SADU 314 logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.08em' }}>
            SADU 314
          </span>
        </button>

        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button className="nav-link" onClick={() => scrollTo('story')}>{copy.nav.story}</button>
          <button className="nav-link" onClick={() => scrollTo('collection')}>{copy.nav.collection}</button>
          <button className="nav-link" onClick={() => scrollTo('club')}>{copy.nav.club}</button>
          <button className="nav-link" onClick={() => scrollTo('download')}>{copy.nav.app}</button>
          <button
            onClick={toggleLang}
            style={{
              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)',
              color: '#C9A84C', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em',
            }}
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(m => !m)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', flexDirection: 'column', gap: '5px' }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: '24px', height: '2px', backgroundColor: '#C9A84C', borderRadius: '2px' }} />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, right: 0,
          backgroundColor: 'rgba(8,7,6,0.97)', backdropFilter: 'blur(12px)',
          zIndex: 99, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
        }}>
          {[{ label: copy.nav.story, id: 'story' }, { label: copy.nav.collection, id: 'collection' },
            { label: copy.nav.club, id: 'club' }, { label: copy.nav.app, id: 'download' }].map(item => (
            <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}
              style={{ textAlign: copy.dir === 'rtl' ? 'right' : 'left', padding: '0.5rem 0' }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => { toggleLang(); setMenuOpen(false); }} style={{
            background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)',
            color: '#C9A84C', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 600, width: 'fit-content',
          }}>
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '120px 2rem 80px', overflow: 'hidden',
      }}>
        <SaduPattern opacity={0.05} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <p className="anim-fade-up" style={{
            fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#C9A84C', marginBottom: '1.5rem', fontFamily: "'Inter', sans-serif",
          }}>
            SADU 314
          </p>
          <h1 className="hero-title anim-fade-up-2 gold-shimmer" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '5rem', fontWeight: 300,
            lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: lang === 'ar' ? '0.02em' : '-0.02em',
          }}>
            {copy.hero.tagline}
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(246,239,226,0.72)',
            maxWidth: '560px', margin: '0 auto 2.5rem',
          }}>
            {copy.hero.sub}
          </p>
          <div className="anim-fade-up-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => scrollTo('collection')}
              style={{ padding: '14px 32px', borderRadius: '6px', fontSize: '0.9rem' }}>
              {copy.hero.cta}
            </button>
            <button className="btn-outline" onClick={() => scrollTo('story')}
              style={{ padding: '14px 32px', borderRadius: '6px', fontSize: '0.9rem' }}>
              {copy.hero.cta2}
            </button>
          </div>
          <div className="anim-float" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <Image src="/logos/SADU314_transparent_256x256.png" alt="SADU 314" width={120} height={120}
              style={{ objectFit: 'contain', opacity: 0.35 }} />
          </div>
        </div>
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.5,
        }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #C9A84C)' }} />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#C9A84C' }}>SCROLL</span>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section id="story" style={{ position: 'relative', padding: '120px 2rem', overflow: 'hidden', backgroundColor: '#0D0C0B' }}>
        <SaduPattern opacity={0.04} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
                Heritage
              </p>
              <h2 className="section-title" style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300,
                lineHeight: 1.2, marginBottom: '2rem', color: '#F6EFE2',
              }}>
                {copy.story.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[copy.story.p1, copy.story.p2, copy.story.p3].map((para, i) => (
                  <p key={i} style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'rgba(246,239,226,0.72)' }}>{para}</p>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '320px', height: '320px' }}>
                <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: '30px', border: '1px solid rgba(201,168,76,0.35)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: '80px', border: '1px solid rgba(201,168,76,0.5)', transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/logos/SADU314_transparent_256x256.png" alt="SADU 314" width={120} height={120} style={{ objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COLLECTION ── */}
      <section id="collection" style={{ padding: '120px 2rem', position: 'relative', overflow: 'hidden' }}>
        <SaduPattern opacity={0.035} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
              Fragrances
            </p>
            <h2 className="section-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: '#F6EFE2', marginBottom: '0.75rem' }}>
              {copy.featured.title}
            </h2>
            <p style={{ color: 'rgba(246,239,226,0.55)', fontSize: '0.95rem' }}>{copy.featured.sub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
              <div key={product.id} className="card-hover" style={{
                backgroundColor: '#0F0E0D', border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
              }}>
                <div style={{
                  position: 'relative', width: '100%', aspectRatio: '1',
                  backgroundColor: '#161412', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden',
                }}>
                  {product.image_url ? (
                    <Image src={product.image_url} alt={lang === 'ar' ? product.name_ar : product.name_en}
                      fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div style={{
                      width: '80px', height: '80px', border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5,
                    }}>
                      <Image src="/logos/SADU314_transparent_256x256.png" alt="" width={48} height={48}
                        style={{ objectFit: 'contain', opacity: 0.6 }} />
                    </div>
                  )}
                  {(product.is_best_seller || product.is_new_arrival) && (
                    <div className={product.is_best_seller ? 'featured-badge' : ''} style={{
                      position: 'absolute', top: '12px', left: '12px',
                      backgroundColor: product.is_best_seller ? '#C9A84C' : 'rgba(201,168,76,0.15)',
                      border: product.is_new_arrival ? '1px solid rgba(201,168,76,0.5)' : 'none',
                      color: product.is_best_seller ? '#080706' : '#C9A84C',
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px',
                    }}>
                      {product.is_best_seller ? copy.featured.bestSeller : copy.featured.newArrival}
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: '0.4rem' }}>
                    {product.scent_family}
                  </p>
                  <h3 style={{
                    fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
                    fontSize: '1.2rem', fontWeight: 500, color: '#F6EFE2', marginBottom: '0.75rem', lineHeight: 1.3,
                  }}>
                    {lang === 'ar' ? product.name_ar : product.name_en}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#C9A84C', fontWeight: 600, fontSize: '1.1rem' }}>
                      {copy.featured.aed} {product.base_price.toLocaleString()}
                    </span>
                    <button className="btn-outline" style={{ padding: '6px 14px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {lang === 'en' ? 'View' : 'عرض'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SADU CLUB ── */}
      <section id="club" style={{ padding: '120px 2rem', position: 'relative', overflow: 'hidden', backgroundColor: '#0D0C0B' }}>
        <SaduPattern opacity={0.04} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
              Loyalty
            </p>
            <h2 className="section-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: '#F6EFE2', marginBottom: '0.75rem' }}>
              {copy.club.title}
            </h2>
            <p style={{ color: 'rgba(246,239,226,0.55)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
              {copy.club.sub}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            {copy.club.tiers.map((tier, i) => (
              <div key={i} className="tier-card" style={{
                backgroundColor: '#0F0E0D',
                border: `1px solid ${tier.featured ? tier.color : 'rgba(201,168,76,0.12)'}`,
                borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  backgroundColor: tier.color, borderRadius: '16px 16px 0 0',
                }} />
                {tier.featured && (
                  <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    backgroundColor: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                    color: '#C9A84C', fontSize: '0.6rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px',
                  }}>
                    {lang === 'en' ? 'Popular' : 'الأكثر شيوعاً'}
                  </div>
                )}
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 500, color: tier.color, marginBottom: '0.25rem', marginTop: '0.5rem' }}>
                  {tier.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(246,239,226,0.4)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                  {tier.nameAr}
                </p>
                <div style={{
                  backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: '6px', padding: '8px 12px', marginBottom: '1.5rem',
                  fontSize: '0.8rem', color: 'rgba(246,239,226,0.6)', letterSpacing: '0.05em',
                }}>
                  {tier.points}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {tier.perks.map((perk, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: 'rgba(246,239,226,0.75)', lineHeight: 1.5 }}>
                      <span style={{ color: tier.color, marginTop: '2px', flexShrink: 0 }}>✦</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-gold" onClick={() => scrollTo('download')}
              style={{ padding: '16px 48px', borderRadius: '8px', fontSize: '1rem', letterSpacing: '0.06em' }}>
              {copy.club.join}
            </button>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD APP ── */}
      <section id="download" style={{ padding: '120px 2rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <SaduPattern opacity={0.04} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
            Mobile App
          </p>
          <h2 className="section-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 300, color: '#F6EFE2', marginBottom: '1rem' }}>
            {copy.download.title}
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(246,239,226,0.65)', marginBottom: '3rem' }}>
            {copy.download.sub}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[{ label: copy.download.ios, icon: 'iOS' }, { label: copy.download.android, icon: 'Android' }].map(btn => (
              <div key={btn.icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button className="btn-outline" disabled style={{
                  padding: '14px 32px', borderRadius: '10px', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5,
                  cursor: 'default', minWidth: '180px', justifyContent: 'center',
                }}>
                  {btn.label}
                </button>
                <span style={{
                  fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.1)',
                  padding: '2px 8px', borderRadius: '3px',
                }}>
                  {copy.download.soon}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', opacity: 0.35 }}>
            <div style={{
              width: '120px', height: '200px', border: '2px solid rgba(201,168,76,0.5)',
              borderRadius: '20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem',
            }}>
              <Image src="/logos/SADU314_transparent_256x256.png" alt="" width={60} height={60} style={{ objectFit: 'contain' }} />
              <div style={{ width: '60px', height: '3px', backgroundColor: 'rgba(201,168,76,0.4)', borderRadius: '2px' }} />
              <div style={{ width: '40px', height: '3px', backgroundColor: 'rgba(201,168,76,0.25)', borderRadius: '2px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" style={{
        backgroundColor: '#050504', borderTop: '1px solid rgba(201,168,76,0.12)',
        padding: '4rem 2rem 2rem', position: 'relative', overflow: 'hidden',
      }}>
        <SaduPattern opacity={0.025} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <Image src="/logos/SADU314_transparent_256x256.png" alt="SADU 314" width={36} height={36} style={{ objectFit: 'contain' }} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.08em' }}>
                  SADU 314
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(246,239,226,0.45)', letterSpacing: '0.1em' }}>
                {copy.footer.tagline}
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {copy.footer.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{ color: 'rgba(246,239,226,0.5)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(201,168,76,0.1)', marginBottom: '1.5rem' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(246,239,226,0.35)' }}>{copy.footer.copy}</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(246,239,226,0.35)' }}>{copy.footer.made}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
