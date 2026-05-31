import { createClient } from '@/lib/supabase/server';
import { CollectionClient } from '../all/CollectionClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Unisex Fragrances | SADU' };

const PRODUCT_SELECT =
  'id,name_en,name_ar,slug,category,scent_family,gender,base_price,image_url,is_active,is_best_seller,is_new_arrival,is_limited_edition,rating,review_count,description_en,description_ar,scent_story_en,scent_story_ar,notes,sizes,occasion,season';

export default async function UnisexPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('gender', 'unisex')
    .order('created_at', { ascending: false });

  return (
    <CollectionClient
      products={products ?? []}
      title="Unisex Fragrances"
      titleAr="عطور للجميع"
      lockGender="unisex"
    />
  );
}
