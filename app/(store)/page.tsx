import { createClient } from '@/lib/supabase/server';
import { HeroSlider } from '@/components/store/HeroSlider';
import { HomeContent } from '@/components/store/HomeContent';
import type { StoreProduct } from '@/types/store';

export const dynamic = 'force-dynamic';

const PRODUCT_SELECT = `
  id, name_en, name_ar, slug, description_en, description_ar,
  scent_story_en, scent_story_ar, base_price, sale_price,
  category, scent_family, gender, occasion, strength,
  longevity, projection, season, sizes, image_url, gallery_urls,
  is_best_seller, is_new_arrival, is_limited_edition, is_active,
  rating, review_count, created_at,
  product_notes(id, note_type, note_name_en, note_name_ar)
`;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: deals }, { data: freshProducts }, { data: topRated }] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .ilike('scent_family', '%fresh%')
      .limit(8),
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(8),
  ]);

  const scentProducts = (freshProducts?.length ?? 0) >= 4 ? freshProducts : topRated;

  return (
    <div>
      <HeroSlider />
      <HomeContent
        deals={(deals ?? []) as unknown as StoreProduct[]}
        scentProducts={(scentProducts ?? []) as unknown as StoreProduct[]}
      />
    </div>
  );
}
