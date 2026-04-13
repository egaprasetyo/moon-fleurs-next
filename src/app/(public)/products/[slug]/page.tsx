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
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/use-products";
import { useStoreInfo } from "@/hooks/use-store-info";
import { useActivePromos } from "@/hooks/use-promos";
import { useWishlistStore } from "@/stores/wishlist-store";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const { data: store } = useStoreInfo();
  const { data: promos } = useActivePromos();
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center">
            <span className="text-5xl">🌸</span>
            <h1 className="mt-4 font-heading text-2xl font-bold">Produk tidak ditemukan</h1>
          </div>
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
    <section className="py-8 md:py-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <ProductGallery
            thumbnail={product.thumbnail_url}
            images={product.images || []}
            productName={product.name}
          />

          {/* Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-destructive text-destructive-foreground">
                  -{discountPercent}%
                </Badge>
              )}
              {activePromo && (
                <Badge className="bg-gold text-foreground">
                  Promo: {activePromo.code}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl font-bold md:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary md:text-3xl">
                {formatPrice(hasDiscount ? product.discount_price! : product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{product.description}</p>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              {store?.whatsapp_number && (
                <WhatsAppOrderBtn
                  productName={product.name}
                  price={hasDiscount ? product.discount_price! : product.price}
                  whatsappNumber={store.whatsapp_number}
                  promoCode={activePromo?.code}
                />
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => toggleItem(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {wishlisted ? "Di Wishlist" : "Tambah ke Wishlist"}
                </Button>
                <ShareButton
                  productName={product.name}
                  productSlug={product.slug}
                  price={product.price}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          productId={product.id}
          categoryId={product.category_id}
          manualIds={product.related_product_ids}
        />
      </Container>
    </section>
  );
}
