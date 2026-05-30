import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { ProductEditForm } from './ProductEditForm';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ id: string }> }

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  await requireAdmin();

  if (id === 'new') {
    return <ProductEditForm product={null} />;
  }

  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) notFound();

  return <ProductEditForm product={product} />;
}
