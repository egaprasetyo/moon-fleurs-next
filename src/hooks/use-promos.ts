"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Promo } from "@/types";

const supabase = createClient();

export function useActivePromos() {
  return useQuery({
    queryKey: ["promos", "active"],
    queryFn: async () => {
      const nowIso = new Date().toISOString();

      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .eq("is_active", true)
        .lte("valid_from", nowIso)
        .or(`valid_until.is.null,valid_until.gte.${nowIso}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Promo[];
    },
  });
}
