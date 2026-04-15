import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk Artificial Flowers",
  description:
    "Jelajahi katalog artificial flowers Moon Fleurs dengan filter kategori, harga, dan koleksi unggulan.",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
