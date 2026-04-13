"use client";

import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { WhatsAppOrderBtn } from "@/components/product/whatsapp-order-btn";
import { ShareButton } from "@/components/product/share-button";
import { RelatedProducts } from "@/components/product/related-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/use-products";
import { useStoreInfo } from "@/hooks/use-store-info";
import { useActivePromos } from "@/hooks/use-promos";
import { useWishlistStore } from "@/stores/wishlist-store";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const { data: store } = useStoreInfo();
  const { data: promos } = useActivePromos();
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
            <div className="space-y-6 pt-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-full rounded-full" />
                <Skeleton className="h-14 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <span className="text-6xl drop-shadow-md">🌸</span>
            <h1 className="mt-6 font-heading text-3xl font-bold">Produk Tidak Ditemukan</h1>
            <p className="mt-2 text-muted-foreground">Maaf, koleksi yang Anda cari sudah tidak tersedia.</p>
          </motion.div>
        </Container>
      </section>
    );
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discount_price! / product.price) * 100)
    : 0;

  const activePromo = promos?.[0];
  const wishlisted = isInWishlist(product.id);

  return (
    <section className="relative overflow-hidden py-6 md:py-20">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -left-[10%] top-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-light/20 blur-[120px] dark:bg-rose-dark/10" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductGallery
              thumbnail={product.thumbnail_url}
              images={product.images || []}
              productName={product.name}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 font-semibold">
                    {product.category.name}
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-gradient-to-r from-destructive to-rose-400 rounded-full px-3 py-1 text-white shadow-sm font-semibold border-0">
                    Diskon {discountPercent}%
                  </Badge>
                )}
                {activePromo && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-3 py-1 text-white shadow-sm font-semibold border-0">
                    Promo: {activePromo.code}
                  </Badge>
                )}
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h1 className="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-primary md:text-4xl">
                    {formatPrice(hasDiscount ? product.discount_price! : product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl font-medium text-muted-foreground line-through decoration-muted-foreground/40">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            <div className="h-px w-full bg-gradient-to-r from-border/80 via-border/40 to-transparent" />

            {/* Actions */}
            <div className="space-y-4 pt-2">
              {store?.whatsapp_number && (
                <div className="group w-full">
                  <WhatsAppOrderBtn
                    productName={product.name}
                    price={hasDiscount ? product.discount_price! : product.price}
                    whatsappNumber={store.whatsapp_number}
                    promoCode={activePromo?.code}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className={`flex-1 gap-2 rounded-full border-2 transition-all hover:bg-muted active:scale-95 ${wishlisted ? "border-rose-400/50 bg-rose-50" : ""}`}
                  onClick={() => toggleItem(product.id)}
                >
                  <Heart
                    className={`h-5 w-5 transition-transform ${wishlisted ? "fill-red-500 text-red-500 scale-110" : ""}`}
                  />
                  <span className="font-semibold">{wishlisted ? "Tersimpan di Wishlist" : "Simpan ke Wishlist"}</span>
                </Button>
                <div className="shrink-0">
                  <ShareButton
                    productName={product.name}
                    productSlug={product.slug}
                    price={product.price}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 md:mt-32">
          {/* Related Products */}
          <RelatedProducts
            productId={product.id}
            categoryId={product.category_id}
            manualIds={product.related_product_ids}
          />
        </div>
      </Container>
    </section>
  );
}
