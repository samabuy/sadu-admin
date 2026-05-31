export interface CartItem {
  productId: string;
  productNameEn: string;
  productNameAr: string;
  imageUrl: string;
  size: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface Size {
  label: string;
  price: number;
  inStock: boolean;
}

export interface StoreProduct {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  scent_story_en: string | null;
  scent_story_ar: string | null;
  base_price: number;
  sale_price: number | null;
  category: string;
  scent_family: string;
  gender: string;
  occasion: string[] | null;
  strength: string | null;
  longevity: number | null;
  projection: number | null;
  season: string[] | null;
  sizes: Size[] | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_limited_edition: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at?: string;
  product_notes: Array<{
    id: string;
    note_type: 'top' | 'heart' | 'base';
    note_name_en: string;
    note_name_ar: string;
  }> | null;
}
