'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Tag, BarChart, LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Role } from '@/lib/types';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { href: '/admin/products', label: 'Products', icon: Package, roles: ['admin', 'manager'] },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, roles: ['admin', 'manager'] },
  { href: '/admin/customers', label: 'Customers', icon: Users, roles: ['admin', 'manager'] },
  { href: '/admin/discounts', label: 'Discounts', icon: Tag, roles: ['admin'] },
  { href: '/admin/reports', label: 'Reports', icon: BarChart, roles: ['admin'] },
] as const;

interface SidebarProps {
  email: string;
  role: Role;
}

export function Sidebar({ email, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/admin');
    router.refresh();
  }

  const visibleNav = NAV.filter((item) => item.roles.includes(role as never));

  return (
    <aside
      className="flex flex-col w-60 h-full fixed left-0 top-0 z-20"
      style={{ backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: 'var(--gold)', color: '#000' }}
        >
          S
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>SADU</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: active ? 'var(--gold)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="mb-3">
          <div className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{email}</div>
          <span
            className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block capitalize"
            style={{
              backgroundColor: role === 'admin' ? 'rgba(201,168,76,0.2)' : 'rgba(63,125,88,0.2)',
              color: role === 'admin' ? 'var(--gold)' : 'var(--success)',
            }}
          >
            {role}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
