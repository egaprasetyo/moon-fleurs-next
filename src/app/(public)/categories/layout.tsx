import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori Bunga Segar & Artificial",
  description:
    "Temukan kategori bunga segar dan artificial Moon Fleurs untuk hadiah, dekorasi rumah, kantor, dan event.",
  alternates: {
    canonical: "/categories",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
