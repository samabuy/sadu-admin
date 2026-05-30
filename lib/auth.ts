import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

export type Role = 'admin' | 'manager' | 'customer';

export async function requireAdminOrManager(): Promise<{ id: string; email: string; role: Role }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  const role = (profile?.role ?? 'customer') as Role;
  if (role === 'customer') redirect('/admin?error=access_denied');

  return { id: user.id, email: profile?.email ?? user.email ?? '', role };
}

export async function requireAdmin(): Promise<{ id: string; email: string; role: Role }> {
  const session = await requireAdminOrManager();
  if (session.role !== 'admin') redirect('/admin/dashboard?error=admin_only');
  return session;
}
