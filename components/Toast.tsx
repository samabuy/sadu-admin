'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: `1px solid ${type === 'success' ? 'var(--success)' : 'var(--error)'}`,
        minWidth: 260,
      }}
    >
      {type === 'success'
        ? <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
        : <XCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
      }
      <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{message}</span>
      <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const show = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const hide = () => setToast(null);

  const ToastComponent = toast
    ? <Toast message={toast.message} type={toast.type} onClose={hide} />
    : null;

  return { show, ToastComponent };
}
