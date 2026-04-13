# 🌸 Moon Fleurs

Moon Fleurs adalah sebuah web florist modern yang menampilkan berbagai produk bunga lengkap dengan harga, kategori, lokasi toko, dan review pelanggan. Project ini juga menyediakan fitur admin untuk mengelola konten seperti produk dan banner homepage.

---

## ✨ Features

### 🛍️ User Features
- Menampilkan daftar produk bunga
- Melihat detail produk (nama, harga, kategori)
- Kategori produk untuk filtering
- Menampilkan lokasi toko
- Menampilkan review pelanggan
- UI responsive dan modern

### 🔧 Admin Features
- CRUD (Create, Read, Update, Delete) produk
- CRUD banner pada homepage
- Manajemen konten website

---

## 🧱 Tech Stack

Project ini dibangun menggunakan teknologi berikut:

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **State Management**: Zustand / React Context
- **HTTP Client**: Axios

---

## 🎨 Design System

Berikut adalah base styling yang digunakan dalam project:

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", serif;
  
  --color-primary-text: #504641;
  --color-bg-main: #FFFCF9;
  --color-bg-accent: #FBEDE0;
}