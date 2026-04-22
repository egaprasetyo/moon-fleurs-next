// TypeScript types for the Moon Fleurs database schema.
// These will be replaced by Supabase auto-generated types after DB migration.

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category_id: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  related_product_ids: string[];
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string | null;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  // Joined
  product?: Pick<Product, "id" | "name" | "slug"> | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface OperatingHour {
  day: string;
  open: string | null;
  close: string | null;
  isClosed?: boolean;
}

export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "twitter" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  operating_hours: OperatingHour[];
  images: string[];
  social_links: SocialLink[];
  updated_at: string;
}

export interface Promo {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface PopupBanner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string;
  show_delay: number;
  show_frequency: "once_session" | "once_day" | "always";
  target_pages: string[];
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Query params
export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "name";
  featured?: boolean;
}
