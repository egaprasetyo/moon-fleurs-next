"use client";

import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useProductsByIds } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/product-card";

export default function WishlistPage() {
  const { items, clearAll } = useWishlistStore();
  const { data: products, isLoading } = useProductsByIds(items);

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-8">
        <Container>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            <Heart className="mr-2 inline-block h-8 w-8 text-primary" />
            Wishlist
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} produk disimpan
          </p>
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-4 text-6xl">💐</span>
              <h2 className="text-xl font-semibold">Wishlist kosong</h2>
              <p className="mt-2 text-muted-foreground">
                Tambahkan produk favoritmu ke wishlist
              </p>
              <Button asChild className="mt-6 rounded-full gap-2">
                <Link href="/products">
                  <ShoppingBag className="h-4 w-4" />
                  Lihat Produk
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive"
                >
                  Hapus Semua
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {isLoading ? (
                  Array.from({ length: Math.min(items.length, 8) || 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <div className="space-y-2 px-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
