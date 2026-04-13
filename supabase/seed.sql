-- ============================================
-- Moon Fleurs — Seed Data
-- Run this in Supabase SQL Editor AFTER migrations
-- ============================================

-- 1. Categories (8)
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
  ('Buket Bunga', 'buket-bunga', 'Rangkaian buket bunga segar untuk berbagai momen spesial', 1, true),
  ('Bunga Papan', 'bunga-papan', 'Papan bunga untuk ucapan selamat, dukacita, dan peresmian', 2, true),
  ('Bunga Standing', 'bunga-standing', 'Rangkaian bunga standing flower elegan', 3, true),
  ('Bunga Pernikahan', 'bunga-pernikahan', 'Hand bouquet, dekorasi, dan rangkaian bunga pengantin', 4, true),
  ('Bunga Meja', 'bunga-meja', 'Rangkaian bunga meja untuk dekorasi ruangan dan kantor', 5, true),
  ('Bunga Box', 'bunga-box', 'Bunga segar dalam kotak premium yang elegan', 6, true),
  ('Tanaman Hias', 'tanaman-hias', 'Tanaman hias indoor dan pot dekoratif', 7, true),
  ('Hampers & Gift', 'hampers-gift', 'Paket hampers bunga dan hadiah spesial', 8, true);

-- 2. Products (16)
INSERT INTO products (name, slug, description, price, discount_price, category_id, is_featured, is_active, related_product_ids) VALUES
  ('Rose Elegance Bouquet', 'rose-elegance-bouquet', 'Buket mawar merah premium dengan aksen baby breath dan greenery. Cocok untuk momen romantis.', 450000, 399000, (SELECT id FROM categories WHERE slug = 'buket-bunga'), true, true, '{}'),
  ('Sunflower Sunshine', 'sunflower-sunshine', 'Buket bunga matahari cerah yang membawa kebahagiaan. Dibalut wrapping kraft natural.', 350000, NULL, (SELECT id FROM categories WHERE slug = 'buket-bunga'), true, true, '{}'),
  ('Pastel Dream Bouquet', 'pastel-dream-bouquet', 'Buket bunga pastel lembut dengan campuran rose, carnation, dan lisianthus.', 550000, 499000, (SELECT id FROM categories WHERE slug = 'buket-bunga'), true, true, '{}'),
  ('Wildflower Garden', 'wildflower-garden', 'Buket bunga liar yang natural dan cantik, memberi kesan garden-fresh.', 300000, NULL, (SELECT id FROM categories WHERE slug = 'buket-bunga'), false, true, '{}'),
  ('Papan Ucapan Selamat', 'papan-ucapan-selamat', 'Papan bunga ucapan selamat dengan rangkaian bunga mewah. Ukuran 2x1.5m.', 850000, NULL, (SELECT id FROM categories WHERE slug = 'bunga-papan'), true, true, '{}'),
  ('Papan Duka Cita', 'papan-duka-cita', 'Papan bunga duka cita dengan desain elegan dan penuh penghormatan.', 750000, NULL, (SELECT id FROM categories WHERE slug = 'bunga-papan'), false, true, '{}'),
  ('Grand Standing Flower', 'grand-standing-flower', 'Standing flower mewah untuk grand opening, peresmian, atau acara besar.', 1200000, 999000, (SELECT id FROM categories WHERE slug = 'bunga-standing'), true, true, '{}'),
  ('Elegant Standing Lily', 'elegant-standing-lily', 'Standing flower dengan lilium putih dan aksen hijau yang anggun.', 950000, NULL, (SELECT id FROM categories WHERE slug = 'bunga-standing'), false, true, '{}'),
  ('Bridal Hand Bouquet', 'bridal-hand-bouquet', 'Hand bouquet pengantin dengan roses putih dan peony, desain romantic garden.', 750000, 650000, (SELECT id FROM categories WHERE slug = 'bunga-pernikahan'), true, true, '{}'),
  ('Wedding Table Arrangement', 'wedding-table-arrangement', 'Rangkaian bunga meja untuk dekorasi resepsi pernikahan.', 350000, NULL, (SELECT id FROM categories WHERE slug = 'bunga-pernikahan'), false, true, '{}'),
  ('Fresh Table Centerpiece', 'fresh-table-centerpiece', 'Rangkaian bunga meja segar dengan vas kaca elegan. Sempurna untuk ruang tamu.', 280000, 250000, (SELECT id FROM categories WHERE slug = 'bunga-meja'), false, true, '{}'),
  ('Rose Gold Box', 'rose-gold-box', 'Mawar premium dalam kotak rose gold. Pilihan warna: merah, pink, atau putih.', 500000, NULL, (SELECT id FROM categories WHERE slug = 'bunga-box'), true, true, '{}'),
  ('Luxury Bloom Box', 'luxury-bloom-box', 'Bunga campuran premium dalam luxury box hitam. Dilengkapi satin ribbon.', 650000, 599000, (SELECT id FROM categories WHERE slug = 'bunga-box'), false, true, '{}'),
  ('Monstera Deliciosa', 'monstera-deliciosa', 'Tanaman monstera dalam pot keramik minimalis. Tinggi ±60cm.', 200000, NULL, (SELECT id FROM categories WHERE slug = 'tanaman-hias'), false, true, '{}'),
  ('Birthday Flower Hampers', 'birthday-flower-hampers', 'Paket hampers ulang tahun: buket bunga mini, cokelat premium, dan greeting card.', 600000, 549000, (SELECT id FROM categories WHERE slug = 'hampers-gift'), true, true, '{}'),
  ('Thank You Gift Set', 'thank-you-gift-set', 'Hampers ucapan terima kasih dengan buket bunga, lilin aromaterapi, dan teh premium.', 500000, NULL, (SELECT id FROM categories WHERE slug = 'hampers-gift'), false, true, '{}');

-- 3. Reviews (10)
INSERT INTO reviews (reviewer_name, rating, comment, is_approved, product_id) VALUES
  ('Anisa Putri', 5, 'Buketnya sangat cantik dan segar! Pengiriman cepat, packing rapi. Pasti order lagi!', true, (SELECT id FROM products WHERE slug = 'rose-elegance-bouquet')),
  ('Budi Santoso', 5, 'Papan bunga untuk grand opening perusahaan, hasilnya mewah sekali. Terima kasih Moon Fleurs!', true, (SELECT id FROM products WHERE slug = 'papan-ucapan-selamat')),
  ('Clara Wijaya', 4, 'Hand bouquet untuk wedding saya indah banget. Sesuai ekspektasi. Recommended!', true, (SELECT id FROM products WHERE slug = 'bridal-hand-bouquet')),
  ('Dewi Lestari', 5, 'Hampers ulang tahun untuk sahabat saya, dia suka banget! Bunga segar dan cokelat enak.', true, (SELECT id FROM products WHERE slug = 'birthday-flower-hampers')),
  ('Eka Prasetya', 5, 'Sunflower bouquet-nya cerah dan bikin happy. Pas banget buat cheering up teman.', true, (SELECT id FROM products WHERE slug = 'sunflower-sunshine')),
  ('Fajar Nugroho', 4, 'Rose Gold Box untuk anniversary istri, elegan banget. Worth the price!', true, (SELECT id FROM products WHERE slug = 'rose-gold-box')),
  ('Gita Cahyani', 5, 'Standing flower untuk acara kantor, semua kagum. Desainnya cantik dan grand!', true, (SELECT id FROM products WHERE slug = 'grand-standing-flower')),
  ('Hendra Kusuma', 5, 'Pelayanan ramah, konsultasi via WhatsApp sangat membantu pilih bunga yang tepat.', true, (SELECT id FROM products WHERE slug = 'pastel-dream-bouquet')),
  ('Indah Sari', 4, 'Bunga meja untuk ruang tamu, setiap tamu yang datang pasti memuji. Segar tahan lama!', true, (SELECT id FROM products WHERE slug = 'fresh-table-centerpiece')),
  ('Joko Widodo', 5, 'Moon Fleurs toko bunga terbaik di Jakarta! Kualitas premium, harga reasonable.', true, (SELECT id FROM products WHERE slug = 'luxury-bloom-box'));

-- 4. Banners (3)
INSERT INTO banners (title, subtitle, image_url, link_url, is_active, display_order) VALUES
  ('Rangkaian Bunga untuk Momen Spesial', 'Bunga segar berkualitas tinggi, dirangkai dengan penuh cinta', 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1600&h=600&fit=crop', '/products', true, 1),
  ('Koleksi Bunga Pernikahan', 'Hand bouquet, dekorasi meja, dan standing flower untuk hari bahagiamu', 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=1600&h=600&fit=crop', '/categories/bunga-pernikahan', true, 2),
  ('Promo Spesial Bulan Ini', 'Diskon hingga 20% untuk rangkaian bunga pilihan', 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1600&h=600&fit=crop', '/products', true, 3);

-- 5. Promos (3)
INSERT INTO promos (code, description, discount_type, discount_value, min_order_amount, is_active, valid_from, valid_until) VALUES
  ('WELCOME20', 'Diskon 20% untuk pelanggan baru', 'percentage', 20, 200000, true, NOW(), NOW() + INTERVAL '90 days'),
  ('BUNGA50K', 'Potongan Rp 50.000 untuk pesanan di atas Rp 500.000', 'fixed', 50000, 500000, true, NOW(), NOW() + INTERVAL '30 days'),
  ('WEDDING15', 'Diskon 15% khusus rangkaian pernikahan', 'percentage', 15, 500000, true, NOW(), NOW() + INTERVAL '60 days');

SELECT 'Seed data inserted successfully! 🌸' AS result;
