import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist Saya",
  description: "Halaman wishlist pribadi untuk produk favorit Moon Fleurs.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/wishlist",
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
