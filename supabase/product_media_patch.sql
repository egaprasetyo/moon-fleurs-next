-- Optional compatibility patch for related products + multi-image support
-- Run this only if your database was created before these fields/tables existed.

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS related_product_ids JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product
  ON public.product_images(product_id);
