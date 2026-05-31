import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SADU Admin',
  description: 'SADU internal admin dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  );
}
