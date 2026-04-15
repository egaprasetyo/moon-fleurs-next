"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
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

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border/40 bg-card p-2 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 sm:rounded-[2rem]">
      {/* Image Container with Inset Layout */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.2rem] bg-muted/30 sm:rounded-[1.5rem]">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          <Image
            src={product.thumbnail_url || PLACEHOLDER_PRODUCT}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
        </Link>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleItem(product.id); }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-md outline outline-1 outline-white/40 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 dark:bg-black/50 dark:hover:bg-black/80"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${wishlisted
              ? "fill-rose-500 text-rose-500"
              : "text-foreground"
              }`}
          />
        </button>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute left-3 top-3 z-10 flex items-center justify-center rounded-full bg-gradient-to-r from-destructive to-rose-400 px-3 py-1 shadow-md">
            <span className="text-[10px] font-bold tracking-wider text-white sm:text-xs">
              SAVE {discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col justify-between px-2 pb-3 pt-4 sm:px-4 sm:pb-4">
        <Link href={`/products/${product.slug}`} className="group/link block">
          {product.category && (
            <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary/80">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-sans text-foreground transition-colors duration-300 line-clamp-2 md:text-base group-hover/link:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold text-foreground md:text-lg">
            {formatPrice(hasDiscount ? product.discount_price! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] font-medium text-muted-foreground line-through sm:text-xs">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
