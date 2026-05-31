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

export interface ScentNote {
  nameEn: string;
  nameAr: string;
  type: 'top' | 'heart' | 'base';
}

export interface StoreProduct {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;

  category: string;
  scent_family: string;
  gender: string;
  base_price: number;
  image_url: string | null;
  is_active: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_limited_edition: boolean;
  rating: number;
  review_count: number;
  description_en: string | null;
  description_ar: string | null;
  scent_story_en: string | null;
  scent_story_ar: string | null;
  notes: ScentNote[] | null;
  sizes: Size[] | null;
  occasion: string[] | null;
  season: string[] | null;
  created_at?: string;
}
