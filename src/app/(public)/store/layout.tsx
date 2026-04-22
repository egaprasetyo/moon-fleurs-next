import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lokasi Toko Moon Fleurs",
  description:
    "Lihat lokasi toko, jam operasional, kontak, dan galeri Moon Fleurs.",
  alternates: {
    canonical: "/store",
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
