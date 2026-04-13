"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWishlistStore } from "@/stores/wishlist-store";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT } from "@/lib/constants";

export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlistStore();

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

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const hasDiscount = item.discount_price && item.discount_price < item.price;
                  return (
                    <Card key={item.id} className="flex overflow-hidden">
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative h-32 w-32 shrink-0"
                      >
                        <Image
                          src={item.thumbnail_url || PLACEHOLDER_PRODUCT}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-semibold text-primary text-sm">
                              {formatPrice(hasDiscount ? item.discount_price! : item.price)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 flex w-fit items-center gap-1 text-xs text-destructive hover:underline"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
