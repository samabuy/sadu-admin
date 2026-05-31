'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, LogOut, User, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLangStore } from '@/store/langStore';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type AuthTab = 'login' | 'signup';

interface OrderRow {
  id: string;
  order_number: string;
  total: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
  items: { product_name_en: string; size: string; quantity: number }[];
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#12100E',
  border: '1px solid rgba(201,163,91,0.2)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  outline: 'none',
};

const STATUS_COLORS: Record<string, string> = {
  received: '#9A8F7A',
  payment_confirmed: '#3F7D58',
  preparing: '#C9A84C',
  packed: '#C9A84C',
  courier_assigned: '#6495ED',
  out_for_delivery: '#6495ED',
  delivered: '#3F7D58',
  cancelled: '#B54747',
  pending: '#9A8F7A',
  confirmed: '#3F7D58',
  failed: '#B54747',
};

export default function AccountPage() {
  const lang = useLangStore((s) => s.lang);
  const supabase = createClient();

  const [tab, setTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user?.email) loadOrders(data.user.email);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) loadOrders(session.user.email);
    });
    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders(userEmail: string) {
    setLoadingOrders(true);
    const { data } = await supabase
      .from('orders')
      .select('id,order_number,total,payment_status,delivery_status,created_at,items')
      .eq('customer_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(20);
    setOrders((data ?? []) as OrderRow[]);
    setLoadingOrders(false);
  }

  async function handleLogin() {
    setError(''); setSuccess('');
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  }

  async function handleSignup() {
    setError(''); setSuccess('');
    if (!name || !email || !password) { setError('All fields are required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess('Account created! Check your email to confirm, then log in.');
    setTab('login');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setOrders([]);
  }

  if (!mounted) return null;

  /* ── Logged in ─────────────────────────────────────────────────────────── */
  if (user) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 36,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,163,91,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={22} style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <p style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>
                {user.user_metadata?.full_name ?? 'My Account'}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 7,
              border: '1px solid rgba(154,143,122,0.25)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            {lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
          </button>
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 20,
          }}
        >
          {lang === 'ar' ? 'طلباتي' : 'My Orders'}
        </h2>

        {loadingOrders && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader2 size={24} style={{ color: 'var(--gold)', margin: '0 auto' }} className="animate-spin" />
          </div>
        )}

        {!loadingOrders && orders.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              backgroundColor: '#12100E',
              borderRadius: 12,
              border: '1px solid rgba(201,163,91,0.1)',
            }}
          >
            <ShoppingBag size={40} style={{ color: 'var(--text-secondary)', opacity: 0.4, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
              {lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </p>
            <Link
              href="/collections/all"
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--gold)',
                color: '#000',
                padding: '10px 24px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {lang === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </Link>
          </div>
        )}

        {!loadingOrders && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#12100E',
                  border: '1px solid rgba(201,163,91,0.12)',
                  borderRadius: 12,
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <Link
                      href={`/track-order?order=${order.order_number}`}
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--gold)',
                        textDecoration: 'none',
                      }}
                    >
                      {order.order_number}
                    </Link>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                      {new Date(order.created_at).toLocaleDateString('en-AE', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--gold)', fontSize: 16, fontWeight: 700 }}>
                      AED {Number(order.total).toLocaleString()}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        backgroundColor: `${STATUS_COLORS[order.delivery_status] ?? '#9A8F7A'}20`,
                        color: STATUS_COLORS[order.delivery_status] ?? 'var(--text-secondary)',
                        textTransform: 'capitalize',
                        marginTop: 4,
                      }}
                    >
                      {order.delivery_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                {Array.isArray(order.items) && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {(order.items as OrderRow['items'])
                      .map((i) => `${i.product_name_en} (${i.size} ×${i.quantity})`)
                      .join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Guest (login/signup) ──────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '72px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {lang === 'ar' ? 'حسابي' : 'My Account'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {lang === 'ar'
            ? 'سجّل الدخول لمتابعة طلباتك'
            : 'Sign in to view your orders and profile'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: 28, borderBottom: '1px solid rgba(201,163,91,0.1)' }}>
        {(['login', 'signup'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: 14,
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? 'var(--gold)' : 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {t === 'login'
              ? lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'
              : lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tab === 'signup' && (
          <input
            style={inputStyle}
            placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          style={inputStyle}
          placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          style={inputStyle}
          placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleSignup())}
        />

        {error && (
          <p style={{ color: 'var(--error)', fontSize: 13, padding: '8px 12px', backgroundColor: 'rgba(181,71,71,0.08)', borderRadius: 6 }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: 'var(--success)', fontSize: 13, padding: '8px 12px', backgroundColor: 'rgba(63,125,88,0.08)', borderRadius: 6 }}>
            {success}
          </p>
        )}

        <button
          onClick={tab === 'login' ? handleLogin : handleSignup}
          disabled={loading}
          style={{
            padding: '13px',
            borderRadius: 8,
            backgroundColor: loading ? 'rgba(201,168,76,0.5)' : 'var(--gold)',
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {tab === 'login'
            ? lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'
            : lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
