-- ============================================
-- Popup Banners Table
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE popup_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT DEFAULT 'Lihat Promo',
  show_delay INTEGER DEFAULT 3,
  show_frequency TEXT DEFAULT 'once_session' CHECK (show_frequency IN ('once_session', 'once_day', 'always')),
  target_pages TEXT[] DEFAULT '{"/"}',
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read
ALTER TABLE popup_banners DISABLE ROW LEVEL SECURITY;

-- Seed example
INSERT INTO popup_banners (title, description, image_url, link_url, button_text, show_delay, show_frequency, target_pages, is_active, valid_from, valid_until)
VALUES (
  '🌸 Promo Spesial Bulan Ini!',
  'Diskon hingga 20% untuk semua rangkaian bunga. Gunakan kode WELCOME20 saat pemesanan via WhatsApp.',
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=500&fit=crop',
  '/products',
  'Lihat Koleksi',
  3,
  'once_session',
  ARRAY['/', '/products'],
  true,
  NOW(),
  NOW() + INTERVAL '30 days'
);

SELECT 'popup_banners table created successfully! 🌸' AS result;
