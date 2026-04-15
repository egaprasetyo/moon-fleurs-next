"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Product, ProductFilters } from "@/types";

const supabase = createClient();
const DEFAULT_PAGE_SIZE = 12;

async function resolveCategoryId(categorySlug?: string) {
  if (!categorySlug) return null;

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

async function buildProductsQuery(filters?: ProductFilters) {
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true);

  if (filters?.categorySlug) {
    const categoryId = await resolveCategoryId(filters.categorySlug);

    // Category slug is not found: return empty result.
    if (!categoryId) {
      return { query, shouldReturnEmpty: true };
    }

    query = query.eq("category_id", categoryId);
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.featured) {
    query = query.eq("is_featured", true);
  }

  switch (filters?.sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  return { query, shouldReturnEmpty: false };
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { query, shouldReturnEmpty } = await buildProductsQuery(filters);

      if (shouldReturnEmpty) {
        return [];
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useInfiniteProducts(
  filters?: ProductFilters,
  pageSize = DEFAULT_PAGE_SIZE
) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", filters, pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { query, shouldReturnEmpty } = await buildProductsQuery(filters);

      if (shouldReturnEmpty) {
        return [] as Product[];
      }

      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await query.range(from, to);
      if (error) throw error;

      return (data ?? []) as Product[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < pageSize) return undefined;
      return allPages.length;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*), images:product_images(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, slug)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useRelatedProducts(
  productId: string,
  categoryId: string,
  manualIds: string[] = [],
  limit = 4
) {
  return useQuery({
    queryKey: ["products", "related", productId],
    queryFn: async () => {
      // If manual override IDs exist, fetch those
      if (manualIds.length > 0) {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(name, slug)")
          .in("id", manualIds)
          .eq("is_active", true)
          .limit(limit);

        if (error) throw error;
        return data as Product[];
      }

      // Default: same category, exclude current product
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, slug)")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .neq("id", productId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!productId && !!categoryId,
  });
}

export function usePriceRange() {
  return useQuery({
    queryKey: ["products", "price-range"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("price")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      const prices = (data || []).map((p: { price: number }) => p.price);
      return {
        min: Math.min(...prices, 0),
        max: Math.max(...prices, 1000000),
      };
    },
  });
}

export function useProductsByIds(ids: string[]) {
  return useQuery({
    queryKey: ["products", "by-ids", ids],
    queryFn: async () => {
      if (!ids || ids.length === 0) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, slug)")
        .in("id", ids)
        .eq("is_active", true);

      if (error) throw error;
      return data as Product[];
    },
    enabled: ids.length > 0,
  });
}
