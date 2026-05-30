export type Role = 'admin' | 'manager' | 'customer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: Role;
  loyalty_points: number;
  loyalty_tier: string;
  created_at: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  brand: string | null;
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
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name_en: string;
  product_name_ar: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  payment_method: string;
  payment_status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  delivery_status: DeliveryStatus;
  delivery_address: string;
  emirate: string;
  notes: string | null;
  refund_notes: string | null;
  created_at: string;
}

export type DeliveryStatus =
  | 'received'
  | 'payment_confirmed'
  | 'preparing'
  | 'packed'
  | 'courier_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  received: 'Received',
  payment_confirmed: 'Payment Confirmed',
  preparing: 'Preparing',
  packed: 'Packed',
  courier_assigned: 'Courier Assigned',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}
