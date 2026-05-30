'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { ActiveBadge } from '@/components/StatusBadge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { DiscountCode } from '@/lib/types';

const inputStyle = {
  backgroundColor: 'var(--main-bg)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px',
  fontSize: 13, outline: 'none', width: '100%',
};
const labelStyle = { color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4, display: 'block' as const };

const EMPTY = { code: '', discount_type: 'percentage' as const, discount_value: 10, max_uses: '', expires_at: '' };

export function DiscountsClient({ codes: initial }: { codes: DiscountCode[] }) {
  const { show, ToastComponent } = useToast();
  const supabase = createClient();
  const [codes, setCodes] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [creating, setCreating] = useState(false);

  function setF(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function createCode() {
    if (!form.code.trim()) { show('Code is required', 'error'); return; }
    setCreating(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: true,
      used_count: 0,
    };
    const { data, error } = await supabase.from('discount_codes').insert(payload).select().single();
    setCreating(false);
    if (error) { show(error.message, 'error'); return; }
    setCodes((prev) => [data, ...prev]);
    setForm(EMPTY);
    show('Discount code created');
  }

  async function toggleCode(id: string, current: boolean) {
    const { error } = await supabase.from('discount_codes').update({ is_active: !current }).eq('id', id);
    if (error) { show(error.message, 'error'); return; }
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
  }

  async function deleteCode(id: string) {
    if (!confirm('Delete this discount code?')) return;
    const { error } = await supabase.from('discount_codes').delete().eq('id', id);
    if (error) { show(error.message, 'error'); return; }
    setCodes((prev) => prev.filter((c) => c.id !== id));
    show('Code deleted');
  }

  return (
    <div className="p-8 max-w-5xl">
      {ToastComponent}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Discounts</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{codes.length} codes</p>
      </div>

      {/* Create form */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>New Discount Code</h2>
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-1">
            <label style={labelStyle}>Code</label>
            <input style={inputStyle} placeholder="SADU10" value={form.code} onChange={(e) => setF('code', e.target.value.toUpperCase())} />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={form.discount_type} onChange={(e) => setF('discount_type', e.target.value)}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed AED</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Value</label>
            <input type="number" style={inputStyle} value={form.discount_value} onChange={(e) => setF('discount_value', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Max Uses</label>
            <input type="number" style={inputStyle} placeholder="Unlimited" value={form.max_uses} onChange={(e) => setF('max_uses', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Expires</label>
            <input type="date" style={inputStyle} value={form.expires_at} onChange={(e) => setF('expires_at', e.target.value)} />
          </div>
        </div>
        <button
          onClick={createCode} disabled={creating}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: 'var(--gold)', color: '#000' }}
        >
          {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Create Code
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Code','Type','Value','Used','Max Uses','Expires','Status','Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No codes yet</td></tr>
            )}
            {codes.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--gold)' }}>{c.code}</td>
                <td className="px-4 py-3 text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{c.discount_type}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {c.discount_type === 'percentage' ? `${c.discount_value}%` : `AED ${c.discount_value}`}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{c.used_count}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{c.max_uses ?? '∞'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleCode(c.id, c.is_active)}>
                    <ActiveBadge active={c.is_active} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteCode(c.id)} style={{ color: 'var(--error)' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
