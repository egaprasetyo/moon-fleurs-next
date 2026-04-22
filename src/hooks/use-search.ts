"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";

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

    const controller = new AbortController();

    const search = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error("Search request failed");
        const data = (await response.json()) as Product[];
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
    return () => controller.abort();
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
