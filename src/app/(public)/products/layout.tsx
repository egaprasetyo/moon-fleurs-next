import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk Bunga Segar & Artificial",
  description:
    "Jelajahi katalog Moon Fleurs — bunga segar dan artificial — dengan filter kategori, harga, dan koleksi unggulan.",
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
