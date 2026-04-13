"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Promo } from "@/types";

const supabase = createClient();

export function useActivePromos() {
  return useQuery({
    queryKey: ["promos", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Promo[];
    },
  });
}
