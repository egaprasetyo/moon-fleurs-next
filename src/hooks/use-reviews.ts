"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Review } from "@/types";

const supabase = createClient();

export function useReviews(limit?: number) {
  return useQuery({
    queryKey: ["reviews", limit],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*, product:products(id, name, slug)")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });
}
