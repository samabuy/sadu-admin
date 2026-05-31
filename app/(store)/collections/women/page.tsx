import { createClient } from '@/lib/supabase/server';
import { CollectionClient } from '../all/CollectionClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "Women's Fragrances | SADU" };

const PRODUCT_SELECT = `
  id, name_en, name_ar, slug, description_en, description_ar,
  scent_story_en, scent_story_ar, base_price, sale_price,
  category, scent_family, gender, occasion, strength,
  longevity, projection, season, sizes, image_url, gallery_urls,
  is_best_seller, is_new_arrival, is_limited_edition, is_active,
  rating, review_count, created_at,
  product_notes(id, note_type, note_name_en, note_name_ar)
`;

export default async function WomenPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('gender', 'women')
    .order('created_at', { ascending: false });

  return (
    <CollectionClient
      products={products ?? []}
      title="Women's Fragrances"
      titleAr="عطور النساء"
      lockGender="women"
    />
  );
}
