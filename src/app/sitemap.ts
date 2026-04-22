import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/constants";

type ProductSitemapRow = {
  slug: string;
  updated_at: string | null;
  created_at: string | null;
};

type CategorySitemapRow = {
  slug: string;
  created_at: string | null;
};

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/store`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return staticRoutes;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select("slug,updated_at,created_at")
      .eq("is_active", true)
      .order("slug", { ascending: true }),
    supabase
      .from("categories")
      .select("slug,created_at")
      .eq("is_active", true)
      .order("slug", { ascending: true }),
  ]);

  if (productsResult.error || categoriesResult.error) {
    console.error("Failed to generate dynamic sitemap entries", {
      productsError: productsResult.error?.message,
      categoriesError: categoriesResult.error?.message,
    });
    return staticRoutes;
  }

  const categoryRoutes: MetadataRoute.Sitemap = (
    (categoriesResult.data ?? []) as CategorySitemapRow[]
  ).map((category) => ({
    url: `${siteUrl}/categories/${category.slug}`,
    lastModified: category.created_at ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = (
    (productsResult.data ?? []) as ProductSitemapRow[]
  ).map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.updated_at ?? product.created_at ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
