import { LoginForm } from './LoginForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Role } from '@/lib/types';

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    const role = (profile?.role ?? 'customer') as Role;
    if (role !== 'customer') redirect('/admin/dashboard');
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--main-bg)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4"
            style={{ backgroundColor: 'var(--gold)', color: '#000' }}
          >
            S
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>SADU Admin</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Internal dashboard</p>
        </div>

        {params.error === 'access_denied' && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm text-center"
            style={{ backgroundColor: 'rgba(181,71,71,0.15)', color: 'var(--error)', border: '1px solid rgba(181,71,71,0.3)' }}
          >
            Access denied. Your account does not have admin privileges.
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
