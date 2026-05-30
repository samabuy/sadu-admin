import { Sidebar } from '@/components/Sidebar';
import { createClient } from '@/lib/supabase/server';
import type { Role } from '@/lib/types';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // No user → render children as-is (login page shows without sidebar)
  if (!user) {
    return <>{children}</>;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  const role = (profile?.role ?? 'customer') as Role;

  // Customer role → no sidebar (they'll see the login page or access-denied)
  if (role === 'customer') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      <Sidebar email={profile?.email ?? user.email ?? ''} role={role} />
      <main className="flex-1 ml-60 overflow-auto" style={{ backgroundColor: 'var(--main-bg)' }}>
        {children}
      </main>
    </div>
  );
}
