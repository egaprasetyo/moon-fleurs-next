import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori Artificial Flowers",
  description:
    "Temukan kategori bunga artificial Moon Fleurs untuk hadiah, dekorasi rumah, kantor, dan event.",
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
