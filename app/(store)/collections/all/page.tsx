import { createClient } from '@/lib/supabase/server';
import { CollectionClient } from './CollectionClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'All Products | SADU 314' };

const PRODUCT_SELECT =
  'id,name_en,name_ar,slug,brand,category,scent_family,gender,base_price,image_url,is_active,is_best_seller,is_new_arrival,is_limited_edition,rating,review_count,description_en,description_ar,scent_story_en,scent_story_ar,notes,sizes,occasion,season';

export default async function AllCollectionPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <CollectionClient
      products={products ?? []}
      title="All Products"
      titleAr="جميع المنتجات"
    />
  );
}
