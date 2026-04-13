"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { StoreInfo } from "@/types";

const supabase = createClient();

export function useStoreInfo() {
  return useQuery({
    queryKey: ["store-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_info")
        .select("*")
        .single();

      if (error) throw error;
      return data as StoreInfo;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — store info rarely changes
  });
}
