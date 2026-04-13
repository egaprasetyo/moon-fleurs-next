"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_PRODUCT } from "@/lib/constants";
import { useRef, useEffect } from "react";

export function SearchAutocomplete() {
  const { query, setQuery, results, isLoading, isOpen, clear } = useSearch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        clear();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clear]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari produk..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-8 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-popover p-2 shadow-lg">
          {isLoading ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Mencari...
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Produk tidak ditemukan
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={clear}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={product.thumbnail_url || PLACEHOLDER_PRODUCT}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-primary font-semibold">
                      {formatPrice(product.discount_price || product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
