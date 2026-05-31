import { Suspense } from 'react';
import { TrackOrderClient } from './TrackOrderClient';

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading…</p>
      </div>
    }>
      <TrackOrderClient />
    </Suspense>
  );
}
