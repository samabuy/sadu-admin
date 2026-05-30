import { createClient } from './supabase/server';
import { NextResponse } from 'next/server';
import type { Role } from './types';

export async function requireApiAdmin(): Promise<
  { user: { id: string }; role: Role } | NextResponse
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role ?? 'customer') as Role;
  if (role === 'customer') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return { user, role };
}
