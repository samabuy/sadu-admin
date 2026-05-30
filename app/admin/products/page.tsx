import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminOrManager } from '@/lib/auth';
import { ProductsClient } from './ProductsClient';

export default async function ProductsPage() {
  const session = await requireAdminOrManager();
  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('id,name_en,name_ar,slug,category,base_price,image_url,is_active,is_best_seller,is_new_arrival,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[products/page] Supabase error:', error.message, error.details);
  }

  return <ProductsClient products={products ?? []} role={session.role} />;
}
