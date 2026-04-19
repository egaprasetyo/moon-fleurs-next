"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { SearchAutocomplete } from "@/components/product/search-autocomplete";
import { CategoryFilter } from "@/components/product/category-filter";
import { PriceRangeFilter } from "@/components/product/price-range-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, Settings2 } from "lucide-react";
import { useInfiniteProducts } from "@/hooks/use-products";
import { useAppStore } from "@/stores/app-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MotionSection, MotionStagger, MotionItem } from "@/components/shared/motion";
import { motion } from "framer-motion";
import { scrollWindowToTop } from "@/lib/scroll";

export default function ProductsPage() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedCategory,
    priceRange,
    sortBy,
    setSortBy,
    resetFilters,
  } = useAppStore();

  const {
    data,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteProducts({
    categorySlug: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy,
  });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  /* Halaman ini client-only + grid tinggi; pastikan viewport ke atas setelah mount / navigasi ke /products */
  useLayoutEffect(() => {
    scrollWindowToTop();
  }, []);

  useEffect(() => {
    scrollWindowToTop();
    const t = window.setTimeout(scrollWindowToTop, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      {/* Immersive background decoration */}
      <div className="pointer-events-none absolute -left-[10%] top-0 -z-10 h-[50vw] w-[50vw] max-h-[500px] max-w-[500px] rounded-full bg-rose-light/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-[20%] -z-10 h-[60vw] w-[60vw] max-h-[600px] max-w-[600px] rounded-full bg-sage-light/10 blur-[150px]" />

      {/* Exquisite Header */}
      <section className="pt-8 pb-12 md:py-16">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 p-8 shadow-sm backdrop-blur-xl sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/40 to-transparent pointer-events-none" />
            <MotionSection className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex rounded-full bg-background px-4 py-1.5 text-xs font-bold tracking-widest text-primary shadow-sm md:text-sm ring-1 ring-border/50"
              >
                KOLEKSI KAMI
              </motion.div>
              <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Jelajahi <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">Semua Produk</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground/90 md:text-lg">
                Temukan variasi bunga segar dan artificial premium, dirangkai dengan sepenuh hati untuk momen sempurna Anda — dari hadiah segar yang wangi hingga rangkaian yang tahan lama.
              </p>
            </MotionSection>
          </div>
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container>
          {/* Action Toolbar */}
          <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-card border border-border/40 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex-1 max-w-md">
                <SearchAutocomplete />
              </div>

              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 rounded-xl md:hidden border-border/60 shadow-sm active:scale-95 transition-transform">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[380px] p-0 border-r-border/40">
                  <SheetHeader className="p-6 border-b border-border/40 text-left bg-muted/20">
                    <SheetTitle className="flex items-center gap-2 font-heading text-xl">
                      <Settings2 className="h-5 w-5 text-primary" /> Filter Pencarian
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-6 space-y-8 overflow-y-auto">
                    <div>
                      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Kategori</h4>
                      <CategoryFilter />
                    </div>
                    <div>
                      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Rentang Harga</h4>
                      <PriceRangeFilter />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="h-11 w-full md:w-56 rounded-xl border-border/60 bg-background shadow-sm hover:border-primary/40 font-medium transition-colors">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="newest" className="rounded-lg cursor-pointer">✨ Terbaru</SelectItem>
                  <SelectItem value="price_asc" className="rounded-lg cursor-pointer">📉 Harga Terendah</SelectItem>
                  <SelectItem value="price_desc" className="rounded-lg cursor-pointer">📈 Harga Tertinggi</SelectItem>
                  <SelectItem value="name" className="rounded-lg cursor-pointer">🔠 Nama A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-10">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden w-64 shrink-0 md:block">
              <div className="sticky top-24 rounded-3xl border border-border/40 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-heading text-lg font-bold">Filter</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori</h4>
                    <div className="rounded-2xl bg-background/50 p-3 ring-1 ring-border/30">
                      <CategoryFilter />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Harga</h4>
                    <PriceRangeFilter />
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 min-w-0">
              {isPending ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-[1.5rem] border border-border/20 p-2 sm:rounded-[2rem]">
                      <Skeleton className="aspect-square w-full rounded-[1.2rem] sm:rounded-[1.5rem]" />
                      <div className="space-y-2 px-2 pb-2">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <MotionStagger className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                    {products.map((product) => (
                      <MotionItem key={product.id}>
                        <ProductCard product={product} />
                      </MotionItem>
                    ))}
                  </MotionStagger>

                  <div ref={sentinelRef} className="h-4 w-full" />

                  {isFetchingNextPage && (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 rounded-[1.5rem] border border-border/20 p-2 sm:rounded-[2rem]">
                          <Skeleton className="aspect-square w-full rounded-[1.2rem] sm:rounded-[1.5rem]" />
                          <div className="space-y-2 px-2 pb-2">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
                ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/30 p-12 text-center shadow-sm backdrop-blur-sm"
                >
                  <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-5xl">
                    🌸
                  </span>
                  <h3 className="font-heading text-xl font-bold">Tidak Ditemukan</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Kami tidak bisa menemukan produk yang cocok dengan pencarian atau filter Anda saat ini.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                    onClick={resetFilters}
                  >
                    Reset Filter
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
