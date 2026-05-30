'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { Search, Plus, Eye, EyeOff, Trash2, AlertTriangle, X } from 'lucide-react';
import type { Role } from '@/lib/types';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  category: string;
  base_price: number;
  image_url: string | null;
  is_active: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  created_at: string;
}

type Modal =
  | { type: 'confirm-delete'; id: string; name: string }
  | { type: 'has-orders'; id: string; name: string; count: number }
  | null;

interface Props { products: Product[]; role: Role }

const inputStyle = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
};

// ── Modal ────────────────────────────────────────────────────────────────────

function ConfirmDeleteModal({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Overlay onClose={onCancel}>
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Trash2 size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Delete product?
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              This will permanently delete <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>.
              This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg"
            style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg font-semibold"
            style={{ backgroundColor: 'var(--error)', color: '#fff' }}
          >
            Delete permanently
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function HasOrdersModal({
  name,
  count,
  onCancel,
  onDeactivate,
}: {
  name: string;
  count: number;
  onCancel: () => void;
  onDeactivate: () => void;
}) {
  return (
    <Overlay onClose={onCancel}>
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Cannot delete — product has orders
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{name}</strong> appears in{' '}
              <strong style={{ color: 'var(--warning)' }}>{count} order{count !== 1 ? 's' : ''}</strong>.
              Deleting it will break order history.
              Deactivate it instead to hide it from the store.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg"
            style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onDeactivate}
            className="px-4 py-2 text-sm rounded-lg font-semibold"
            style={{ backgroundColor: 'var(--gold)', color: '#000' }}
          >
            Deactivate instead
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl"
        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProductsClient({ products: initial, role }: Props) {
  const { show, ToastComponent } = useToast();
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<Modal>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name_en.toLowerCase().includes(search.toLowerCase()) ||
        (p.name_ar ?? '').includes(search) ||
        (p.slug ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.is_active) ||
        (statusFilter === 'inactive' && !p.is_active);
      return matchSearch && matchStatus;
    });
  }, [products, search, statusFilter]);

  // ── Toggle active ───────────────────────────────────────────────────────────

  async function toggleActive(id: string, current: boolean) {
    setLoadingId(id);
    const res = await fetch(`/api/admin/products/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
    setLoadingId(null);
    if (!res.ok) { show('Failed to update', 'error'); return; }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
    show(`Product ${!current ? 'activated' : 'deactivated'}`);
  }

  // ── Delete flow ─────────────────────────────────────────────────────────────

  async function initiateDelete(id: string, name: string) {
    setLoadingId(id);
    const res = await fetch(`/api/admin/products/${id}/order-count`);
    setLoadingId(null);
    if (!res.ok) { show('Could not check order history', 'error'); return; }
    const { count } = await res.json() as { count: number };
    if (count > 0) {
      setModal({ type: 'has-orders', id, name, count });
    } else {
      setModal({ type: 'confirm-delete', id, name });
    }
  }

  async function confirmDelete(id: string) {
    setModal(null);
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json() as { error?: string };
      show(body.error ?? 'Delete failed', 'error');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    show('Product deleted');
  }

  async function deactivateFromModal(id: string) {
    setModal(null);
    const res = await fetch(`/api/admin/products/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: false }),
    });
    if (!res.ok) { show('Failed to deactivate', 'error'); return; }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: false } : p));
    show('Product deactivated');
  }

  // ── Bulk ────────────────────────────────────────────────────────────────────

  async function bulkActivate(active: boolean) {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const res = await fetch('/api/admin/products/bulk-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, is_active: active }),
    });
    if (!res.ok) { show('Bulk update failed', 'error'); return; }
    setProducts((prev) => prev.map((p) => selected.has(p.id) ? { ...p, is_active: active } : p));
    setSelected(new Set());
    show(`${ids.length} products ${active ? 'activated' : 'deactivated'}`);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const isAdmin = role === 'admin';

  return (
    <div className="p-8">
      {ToastComponent}

      {/* Modals */}
      {modal?.type === 'confirm-delete' && (
        <ConfirmDeleteModal
          name={modal.name}
          onCancel={() => setModal(null)}
          onConfirm={() => confirmDelete(modal.id)}
        />
      )}
      {modal?.type === 'has-orders' && (
        <HasOrdersModal
          name={modal.name}
          count={modal.count}
          onCancel={() => setModal(null)}
          onDeactivate={() => deactivateFromModal(modal.id)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} of {products.length} products
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--gold)', color: '#000' }}
          >
            <Plus size={16} /> Add Product
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            style={{ ...inputStyle, paddingLeft: 32 }}
            placeholder="Search by name, slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select style={inputStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {isAdmin && selected.size > 0 && (
          <>
            <button
              onClick={() => bulkActivate(true)}
              className="px-3 py-1.5 rounded text-xs font-medium"
              style={{ backgroundColor: 'rgba(63,125,88,0.2)', color: 'var(--success)' }}
            >
              Activate ({selected.size})
            </button>
            <button
              onClick={() => bulkActivate(false)}
              className="px-3 py-1.5 rounded text-xs font-medium"
              style={{ backgroundColor: 'rgba(181,71,71,0.2)', color: 'var(--error)' }}
            >
              Deactivate ({selected.size})
            </button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {isAdmin && <th className="w-10 px-4 py-3" />}
              <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Product</th>
              <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Slug</th>
              <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Category</th>
              <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Price</th>
              <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
              {isAdmin && <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 5} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No products found
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  opacity: p.is_active ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}
              >
                {isAdmin && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                )}

                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: 'var(--border)' }}
                    >
                      {p.image_url
                        ? <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        : null}
                    </div>
                    <div>
                      <div className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{p.name_en}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.name_ar}</div>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-4 py-3 text-xs font-mono max-w-[140px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  {p.slug}
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>

                {/* Price */}
                <td className="px-4 py-3 text-xs text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                  AED {Number(p.base_price).toLocaleString()}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: p.is_active ? 'rgba(63,125,88,0.2)' : 'rgba(154,143,122,0.15)',
                      color: p.is_active ? 'var(--success)' : 'var(--text-secondary)',
                    }}
                  >
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {/* Edit */}
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-xs px-2.5 py-1.5 rounded"
                        style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}
                      >
                        Edit
                      </Link>

                      {/* Toggle active — eye icon */}
                      <button
                        onClick={() => toggleActive(p.id, p.is_active)}
                        disabled={loadingId === p.id}
                        title={p.is_active ? 'Deactivate' : 'Activate'}
                        className="p-1.5 rounded transition-colors"
                        style={{
                          backgroundColor: p.is_active ? 'rgba(63,125,88,0.15)' : 'rgba(154,143,122,0.15)',
                          color: p.is_active ? 'var(--success)' : 'var(--text-secondary)',
                          opacity: loadingId === p.id ? 0.5 : 1,
                        }}
                      >
                        {p.is_active
                          ? <Eye size={14} />
                          : <EyeOff size={14} />}
                      </button>

                      {/* Delete — trash icon */}
                      <button
                        onClick={() => initiateDelete(p.id, p.name_en)}
                        disabled={loadingId === p.id}
                        title="Delete product"
                        className="p-1.5 rounded transition-colors"
                        style={{
                          backgroundColor: 'rgba(181,71,71,0.12)',
                          color: 'var(--error)',
                          opacity: loadingId === p.id ? 0.5 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
