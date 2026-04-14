import * as z from "zod";

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  discount_price: z.coerce.number().min(0).optional().nullable(),
  category_id: z.string().uuid("Pilih kategori"),
  thumbnail_url: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  related_product_ids: z.array(z.string().uuid()).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  display_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// Banner validation schema
export const bannerSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  subtitle: z.string().optional().nullable(),
  image_url: z.string().min(1, "Gambar banner wajib diisi"),
  link_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;

// Review validation schema
export const reviewSchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  reviewer_name: z.string().min(2, "Nama reviewer minimal 2 karakter"),
  rating: z.coerce.number().min(1).max(5, "Rating 1-5"),
  comment: z.string().optional().nullable(),
  is_approved: z.boolean().default(true),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

// Promo validation schema
export const promoSchema = z.object({
  code: z
    .string()
    .min(3, "Kode promo minimal 3 karakter")
    .transform((v) => v.toUpperCase()),
  description: z.string().optional().nullable(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().min(1, "Nilai diskon minimal 1"),
  min_order_amount: z.coerce.number().min(0).optional().nullable(),
  is_active: z.boolean().default(true),
  valid_from: z.string().min(1, "Tanggal mulai wajib diisi"),
  valid_until: z.string().optional().nullable(),
});

export type PromoFormValues = z.infer<typeof promoSchema>;

// Store info validation schema
export const storeInfoSchema = z.object({
  name: z.string().min(2, "Nama toko minimal 2 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phone: z.string().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),
  google_maps_url: z.string().url().optional().nullable().or(z.literal("")),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  operating_hours: z.array(z.object({
    day: z.string(),
    open: z.string().nullable(),
    close: z.string().nullable(),
    isClosed: z.boolean().optional(),
  })).default([]),
  images: z.array(z.string()).default([]),
});

export type StoreInfoFormValues = z.infer<typeof storeInfoSchema>;
