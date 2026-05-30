'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Authentication failed'); setLoading(false); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role ?? 'customer';
    if (role === 'customer') {
      await supabase.auth.signOut();
      setError('Access denied. This account does not have admin privileges.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  }

  const inputStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontSize: 14,
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 space-y-4"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
    >
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          placeholder="admin@sadu.ae"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{ backgroundColor: 'var(--gold)', color: '#000', opacity: loading ? 0.7 : 1 }}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
