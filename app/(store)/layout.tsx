import type { Metadata } from 'next';
import { StoreShell } from '@/components/store/StoreShell';

export const metadata: Metadata = {
  title: 'SADU | Luxury Arabian Perfumes',
  description:
    'Discover the finest luxury Arabian perfumes from SADU. Authentic UAE heritage fragrances delivered across the Emirates.',
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell>{children}</StoreShell>;
}
