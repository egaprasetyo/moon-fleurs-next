"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore, type WishlistItem } from "@/stores/wishlist-store";
import { PLACEHOLDER_PRODUCT } from "@/lib/constants";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const hasDiscount =
    product.discount_price && product.discount_price < product.price;

  const discountPercent = hasDiscount
    ? Math.round((1 - product.discount_price! / product.price) * 100)
    : 0;

  const wishlistItem: WishlistItem = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    discount_price: product.discount_price,
    thumbnail_url: product.thumbnail_url,
  };

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.thumbnail_url || PLACEHOLDER_PRODUCT}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Wishlist button */}
        <button
          onClick={() => toggleItem(wishlistItem)}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Discount badge */}
        {hasDiscount && (
          <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Info */}
      <CardContent className="p-3 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors md:text-base">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <p className="mt-1 text-xs text-muted-foreground">
            {product.category.name}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-sm text-primary md:text-base">
            {formatPrice(hasDiscount ? product.discount_price! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
