import { cache } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

type CategoryLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const getCategory = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name, slug, description, image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
});

export async function generateMetadata({
  params,
}: Omit<CategoryLayoutProps, "children">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.name} | Moon Fleurs`;
  const description =
    category.description ||
    `Lihat koleksi ${category.name} bunga segar & artificial premium dari Moon Fleurs.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      images: category.image_url
        ? [
            {
              url: category.image_url,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
  };
}

export default function CategoryDetailLayout({ children }: CategoryLayoutProps) {
  return children;
}
