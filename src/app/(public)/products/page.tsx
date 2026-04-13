"use client";

import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { SearchAutocomplete } from "@/components/product/search-autocomplete";
import { CategoryFilter } from "@/components/product/category-filter";
import { PriceRangeFilter } from "@/components/product/price-range-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useAppStore } from "@/stores/app-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export default function ProductsPage() {
  const { selectedCategory, priceRange, sortBy, setSortBy } = useAppStore();

  const { data: products, isLoading } = useProducts({
    categorySlug: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy,
  });

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-8">
        <Container>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            Semua Produk
          </h1>
          <p className="mt-2 text-muted-foreground">
            Jelajahi koleksi rangkaian bunga segar kami
          </p>
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
          {/* Toolbar */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <SearchAutocomplete />

              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="mb-3 text-sm font-medium">Kategori</h4>
                      <CategoryFilter />
                    </div>
                    <PriceRangeFilter />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="price_asc">Harga Terendah</SelectItem>
                  <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar filters */}
            <aside className="hidden w-56 shrink-0 space-y-6 md:block">
              <div>
                <h4 className="mb-3 text-sm font-semibold">Kategori</h4>
                <CategoryFilter />
              </div>
              <PriceRangeFilter />
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 md:gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="mb-4 text-5xl">🌸</span>
                  <h3 className="text-lg font-semibold">Produk tidak ditemukan</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Coba ubah filter atau kata kunci pencarian
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
