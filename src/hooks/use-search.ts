"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

const supabase = createClient();

export function useSearch(debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Search
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, discount_price, thumbnail_url")
          .eq("is_active", true)
          .ilike("name", `%${debouncedQuery}%`)
          .limit(6);

        if (error) throw error;
        setResults((data || []) as Product[]);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isOpen: query.length >= 2,
    clear: () => {
      setQuery("");
      setResults([]);
    },
  };
}
