-- =============================================================================
-- Moon Fleurs — RLS untuk product_images (multi-foto per produk)
-- Jalankan di Supabase → SQL Editor SETELAH:
--   1) Tabel product_images ada (lihat product_media_patch.sql)
--  2) Fungsi public.is_admin() dan tabel profiles dengan kolom role ada
-- =============================================================================

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product images viewable by everyone" ON public.product_images;
DROP POLICY IF EXISTS "Admin can manage product images" ON public.product_images;

-- Publik (termasuk anon) bisa baca — URL gambar dipakai di halaman produk.
CREATE POLICY "Product images viewable by everyone"
  ON public.product_images
  FOR SELECT
  USING (true);

-- Admin (role di profiles) bisa insert/update/delete baris galeri.
CREATE POLICY "Admin can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
