import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SADU Admin',
  description: 'SADU internal admin dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  );
}
