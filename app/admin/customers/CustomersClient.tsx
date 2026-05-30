'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { Search, Edit2, Check, X } from 'lucide-react';
import type { Role } from '@/lib/types';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  loyalty_points: number;
  loyalty_tier: string | null;
  created_at: string;
}

const inputStyle = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
};

export function CustomersClient({ customers: initial, role }: { customers: Customer[]; role: Role }) {
  const { show, ToastComponent } = useToast();
  const [customers, setCustomers] = useState(initial);
  const [search, setSearch] = useState('');
  const [editingPoints, setEditingPoints] = useState<{ id: string; value: number } | null>(null);
  const supabase = createClient();

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      !search ||
      (c.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone ?? '').includes(search),
    );
  }, [customers, search]);

  async function savePoints(id: string, points: number) {
    const { error } = await supabase.from('profiles').update({ loyalty_points: points }).eq('id', id);
    if (error) { show(error.message, 'error'); return; }
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, loyalty_points: points } : c));
    setEditingPoints(null);
    show('Loyalty points updated');
  }

  return (
    <div className="p-8">
      {ToastComponent}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Customers</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{customers.length} total accounts</p>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input style={{ ...inputStyle, paddingLeft: 32, width: '100%' }} placeholder="Name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name','Email','Phone','Role','Loyalty Points','Tier','Joined'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
              {role === 'admin' && <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={role === 'admin' ? 8 : 7} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No customers found</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{c.full_name ?? '—'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{c.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                    backgroundColor: c.role === 'admin' ? 'rgba(201,168,76,0.15)' : 'rgba(154,143,122,0.15)',
                    color: c.role === 'admin' ? 'var(--gold)' : 'var(--text-secondary)',
                  }}>{c.role}</span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {editingPoints?.id === c.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        style={{ ...inputStyle, width: 80, padding: '4px 8px' }}
                        value={editingPoints.value}
                        onChange={(e) => setEditingPoints({ id: c.id, value: Number(e.target.value) })}
                      />
                      <button onClick={() => savePoints(c.id, editingPoints.value)} style={{ color: 'var(--success)' }}><Check size={14} /></button>
                      <button onClick={() => setEditingPoints(null)} style={{ color: 'var(--error)' }}><X size={14} /></button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--gold)' }}>{c.loyalty_points ?? 0}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{c.loyalty_tier ?? '—'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                {role === 'admin' && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditingPoints({ id: c.id, value: c.loyalty_points ?? 0 })}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
