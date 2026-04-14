"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { PopupBanner } from "@/types";

export function usePopupBanners() {
  const supabase = createClient();

  return useQuery<PopupBanner[]>({
    queryKey: ["popup-banners"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("popup_banners")
        .select("*")
        .eq("is_active", true)
        .lte("valid_from", now)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []) as PopupBanner[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
