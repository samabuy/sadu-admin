'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { ActiveBadge } from '@/components/StatusBadge';
import { Loader2, Plus, Trash2, Upload, AlertTriangle, X } from 'lucide-react';

interface ScentNote { nameEn: string; nameAr: string; type: 'top' | 'heart' | 'base' }
interface Size { label: string; price: number; inStock: boolean }

interface ProductData {
  id?: string;
  name_en: string;
  name_ar: string;
  brand: string;
  category: string;
  scent_family: string;
  gender: string;
  description_en: string;
  description_ar: string;
  scent_story_en: string;
  scent_story_ar: string;
  base_price: number;
  strength: string;
  longevity: number;
  projection: number;
  occasion: string[];
  season: string[];
  notes: ScentNote[];
  sizes: Size[];
  image_url: string;
  is_active: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_limited_edition: boolean;
}

const DEFAULTS: ProductData = {
  name_en: '', name_ar: '', brand: '', category: '', scent_family: '',
  gender: 'unisex', description_en: '', description_ar: '',
  scent_story_en: '', scent_story_ar: '', base_price: 0,
  strength: 'medium', longevity: 3, projection: 3,
  occasion: [], season: [], notes: [], sizes: [
    { label: '10ml', price: 0, inStock: false },
    { label: '30ml', price: 0, inStock: false },
    { label: '50ml', price: 0, inStock: false },
    { label: '100ml', price: 0, inStock: false },
  ],
  image_url: '', is_active: false, is_best_seller: false,
  is_new_arrival: false, is_limited_edition: false,
};

const inputStyle = {
  backgroundColor: 'var(--main-bg)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px',
  width: '100%', fontSize: 13, outline: 'none',
};

const labelStyle = { color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4, display: 'block' as const, textTransform: 'uppercase' as const, letterSpacing: '0.05em' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>;
}

function CheckToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className="w-9 h-5 rounded-full transition-colors relative"
        style={{ backgroundColor: checked ? 'var(--gold)' : 'var(--border)' }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
          style={{ backgroundColor: '#fff', left: checked ? '18px' : '2px' }}
        />
      </div>
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
    </label>
  );
}

export function ProductEditForm({ product }: { product: Record<string, unknown> | null }) {
  const router = useRouter();
  const { show, ToastComponent } = useToast();
  const supabase = createClient();
  const isNew = !product;

  const [form, setForm] = useState<ProductData>(() => {
    if (!product) return DEFAULTS;
    return {
      ...DEFAULTS,
      name_en: String(product.name_en ?? ''),
      name_ar: String(product.name_ar ?? ''),
      brand: String(product.brand ?? ''),
      category: String(product.category ?? ''),
      scent_family: String(product.scent_family ?? ''),
      gender: String(product.gender ?? 'unisex'),
      description_en: String(product.description_en ?? ''),
      description_ar: String(product.description_ar ?? ''),
      scent_story_en: String(product.scent_story_en ?? ''),
      scent_story_ar: String(product.scent_story_ar ?? ''),
      base_price: Number(product.base_price ?? 0),
      strength: String(product.strength ?? 'medium'),
      longevity: Number(product.longevity ?? 3),
      projection: Number(product.projection ?? 3),
      occasion: Array.isArray(product.occasion) ? product.occasion as string[] : [],
      season: Array.isArray(product.season) ? product.season as string[] : [],
      notes: Array.isArray(product.notes) ? product.notes as ScentNote[] : [],
      sizes: Array.isArray(product.sizes) ? product.sizes as Size[] : DEFAULTS.sizes,
      image_url: String(product.image_url ?? ''),
      is_active: Boolean(product.is_active),
      is_best_seller: Boolean(product.is_best_seller),
      is_new_arrival: Boolean(product.is_new_arrival),
      is_limited_edition: Boolean(product.is_limited_edition),
    };
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  type DeleteModal = { type: 'confirm' } | { type: 'has-orders'; count: number } | null;
  const [deleteModal, setDeleteModal] = useState<DeleteModal>(null);

  function set<K extends keyof ProductData>(key: K, value: ProductData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleMulti(key: 'occasion' | 'season', val: string) {
    setForm((f) => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) { show('Upload failed: ' + error.message, 'error'); setUploading(false); return; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    set('image_url', data.publicUrl);
    setUploading(false);
    show('Image uploaded');
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    let error;
    if (isNew) {
      ({ error } = await supabase.from('products').insert(payload));
    } else {
      ({ error } = await supabase.from('products').update(payload).eq('id', product!.id as string));
    }
    setSaving(false);
    if (error) { show(error.message, 'error'); return; }
    show(isNew ? 'Product created' : 'Product saved');
    if (isNew) router.push('/admin/products');
  }

  async function initiateDelete() {
    if (!product?.id) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${String(product.id)}/order-count`);
    setDeleting(false);
    if (!res.ok) { show('Could not check order history', 'error'); return; }
    const { count } = await res.json() as { count: number };
    setDeleteModal(count > 0 ? { type: 'has-orders', count } : { type: 'confirm' });
  }

  async function confirmDelete() {
    if (!product?.id) return;
    setDeleteModal(null);
    const res = await fetch(`/api/admin/products/${String(product.id)}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json() as { error?: string };
      show(body.error ?? 'Delete failed', 'error');
      return;
    }
    router.push('/admin/products');
  }

  async function deactivateProduct() {
    if (!product?.id) return;
    setDeleteModal(null);
    const res = await fetch(`/api/admin/products/${String(product.id)}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: false }),
    });
    if (!res.ok) { show('Failed to deactivate', 'error'); return; }
    set('is_active', false);
    show('Product deactivated');
  }

  const notesByType = (type: 'top' | 'heart' | 'base') => form.notes.filter((n) => n.type === type);

  function addNote(type: 'top' | 'heart' | 'base') {
    set('notes', [...form.notes, { nameEn: '', nameAr: '', type }]);
  }
  function removeNote(idx: number) {
    set('notes', form.notes.filter((_, i) => i !== idx));
  }
  function updateNote(idx: number, key: keyof ScentNote, val: string) {
    set('notes', form.notes.map((n, i) => i === idx ? { ...n, [key]: val } : n));
  }

  const cardStyle = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 };

  return (
    <div className="p-8 max-w-6xl">
      {ToastComponent}

      {/* Delete modals */}
      {deleteModal?.type === 'confirm' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setDeleteModal(null)} className="absolute top-3 right-3" style={{ color: 'var(--text-secondary)' }}>
              <X size={16} />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <Trash2 size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>Delete product?</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  This will permanently delete <strong style={{ color: 'var(--text-primary)' }}>{form.name_en}</strong>. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm rounded-lg" style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{ backgroundColor: 'var(--error)', color: '#fff' }}>
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal?.type === 'has-orders' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setDeleteModal(null)} className="absolute top-3 right-3" style={{ color: 'var(--text-secondary)' }}>
              <X size={16} />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={20} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>Cannot delete — product has orders</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{form.name_en}</strong> appears in{' '}
                  <strong style={{ color: 'var(--warning)' }}>{deleteModal.count} order{deleteModal.count !== 1 ? 's' : ''}</strong>.
                  Deleting it will break order history. Deactivate it instead to hide it from the store.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm rounded-lg" style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button onClick={deactivateProduct} className="px-4 py-2 text-sm rounded-lg font-semibold" style={{ backgroundColor: 'var(--gold)', color: '#000' }}>
                Deactivate instead
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isNew ? 'New Product' : form.name_en || 'Edit Product'}
          </h1>
          <button onClick={() => router.back()} className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>← Back</button>
        </div>
        <div className="flex items-center gap-3">
          <CheckToggle label="Active" checked={form.is_active} onChange={(v) => set('is_active', v)} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm"
            style={{ backgroundColor: 'var(--gold)', color: '#000' }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Names */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Names</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name (English)">
              <input style={inputStyle} value={form.name_en} onChange={(e) => set('name_en', e.target.value)} />
            </Field>
            <Field label="Name (Arabic)">
              <input style={{ ...inputStyle, direction: 'rtl' }} value={form.name_ar} onChange={(e) => set('name_ar', e.target.value)} />
            </Field>
            <Field label="Brand">
              <input style={inputStyle} value={form.brand} onChange={(e) => set('brand', e.target.value)} />
            </Field>
            <Field label="Category">
              <input style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Descriptions */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Descriptions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Description (English)">
              <textarea rows={3} style={inputStyle} value={form.description_en} onChange={(e) => set('description_en', e.target.value)} />
            </Field>
            <Field label="Description (Arabic)">
              <textarea rows={3} style={{ ...inputStyle, direction: 'rtl' }} value={form.description_ar} onChange={(e) => set('description_ar', e.target.value)} />
            </Field>
            <Field label="Scent Story (English)">
              <textarea rows={4} style={inputStyle} value={form.scent_story_en} onChange={(e) => set('scent_story_en', e.target.value)} />
            </Field>
            <Field label="Scent Story (Arabic)">
              <textarea rows={4} style={{ ...inputStyle, direction: 'rtl' }} value={form.scent_story_ar} onChange={(e) => set('scent_story_ar', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Attributes */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Attributes</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Scent Family">
              <select style={inputStyle} value={form.scent_family} onChange={(e) => set('scent_family', e.target.value)}>
                {['oud','musk','amber','rose','floral','fresh','woody','leather','incense','sweet','citrus','cherry','fruity','vanilla','tobacco','gourmand'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Gender">
              <select style={inputStyle} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                {['men','women','unisex'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Strength">
              <select style={inputStyle} value={form.strength} onChange={(e) => set('strength', e.target.value)}>
                {['light','medium','strong','extreme'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label={`Longevity (${form.longevity}/5)`}>
              <input type="range" min={1} max={5} value={form.longevity} onChange={(e) => set('longevity', Number(e.target.value))} className="w-full" />
            </Field>
            <Field label={`Projection (${form.projection}/5)`}>
              <input type="range" min={1} max={5} value={form.projection} onChange={(e) => set('projection', Number(e.target.value))} className="w-full" />
            </Field>
            <Field label="Base Price (AED)">
              <input type="number" style={inputStyle} value={form.base_price} onChange={(e) => set('base_price', Number(e.target.value))} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label style={labelStyle}>Occasion</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {['daily','office','evening','wedding','gift'].map((v) => (
                  <button
                    key={v} type="button" onClick={() => toggleMulti('occasion', v)}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: form.occasion.includes(v) ? 'var(--gold)' : 'var(--main-bg)',
                      color: form.occasion.includes(v) ? '#000' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                  >{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Season</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {['spring','summer','autumn','winter','all'].map((v) => (
                  <button
                    key={v} type="button" onClick={() => toggleMulti('season', v)}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: form.season.includes(v) ? 'var(--gold)' : 'var(--main-bg)',
                      color: form.season.includes(v) ? '#000' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                  >{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Sizes & Pricing</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs pb-2" style={{ color: 'var(--text-secondary)' }}>Size</th>
                <th className="text-left text-xs pb-2" style={{ color: 'var(--text-secondary)' }}>Price (AED)</th>
                <th className="text-left text-xs pb-2" style={{ color: 'var(--text-secondary)' }}>In Stock</th>
              </tr>
            </thead>
            <tbody>
              {form.sizes.map((size, i) => (
                <tr key={i}>
                  <td className="py-1.5 pr-4 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{size.label}</td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      style={{ ...inputStyle, width: 120 }}
                      value={size.price}
                      onChange={(e) => set('sizes', form.sizes.map((s, si) => si === i ? { ...s, price: Number(e.target.value) } : s))}
                    />
                  </td>
                  <td className="py-1.5">
                    <CheckToggle
                      label=""
                      checked={size.inStock}
                      onChange={(v) => set('sizes', form.sizes.map((s, si) => si === i ? { ...s, inStock: v } : s))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scent notes */}
        <div style={cardStyle}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Scent Notes</h2>
          {(['top', 'heart', 'base'] as const).map((type) => (
            <div key={type} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>{type} Notes</span>
                <button
                  type="button" onClick={() => addNote(type)}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: 'var(--gold)' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.notes.map((note, idx) => note.type !== type ? null : (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="English"
                      value={note.nameEn}
                      onChange={(e) => updateNote(idx, 'nameEn', e.target.value)}
                    />
                    <input
                      style={{ ...inputStyle, flex: 1, direction: 'rtl' }}
                      placeholder="Arabic"
                      value={note.nameAr}
                      onChange={(e) => updateNote(idx, 'nameAr', e.target.value)}
                    />
                    <button onClick={() => removeNote(idx)} style={{ color: 'var(--error)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Image & Flags */}
        <div className="grid grid-cols-2 gap-6" id="image-flags">
          <div style={cardStyle}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Product Image</h2>
            {form.image_url && (
              <img src={form.image_url} alt="" className="w-32 h-32 object-cover rounded-lg mb-3" style={{ border: '1px solid var(--border)' }} />
            )}
            <Field label="Image URL">
              <input style={inputStyle} value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://…" />
            </Field>
            <div className="mt-3">
              <label
                className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg w-fit"
                style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? 'Uploading…' : 'Upload image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Flags</h2>
            <div className="space-y-3">
              <CheckToggle label="Best Seller" checked={form.is_best_seller} onChange={(v) => set('is_best_seller', v)} />
              <CheckToggle label="New Arrival" checked={form.is_new_arrival} onChange={(v) => set('is_new_arrival', v)} />
              <CheckToggle label="Limited Edition" checked={form.is_limited_edition} onChange={(v) => set('is_limited_edition', v)} />
            </div>
          </div>
        </div>
        {/* Danger zone — only shown for existing products */}
        {!isNew && (
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(181,71,71,0.35)' }}
          >
            <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--error)' }}>Danger Zone</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Deleting a product is permanent. If this product appears in existing orders you will be
              asked to deactivate it instead.
            </p>
            <button
              onClick={initiateDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: 'rgba(181,71,71,0.15)', color: 'var(--error)', border: '1px solid rgba(181,71,71,0.4)' }}
            >
              {deleting
                ? <Loader2 size={14} className="animate-spin" />
                : <Trash2 size={14} />}
              {deleting ? 'Checking…' : 'Delete product'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
