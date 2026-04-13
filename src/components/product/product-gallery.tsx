"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT } from "@/lib/constants";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  thumbnail: string | null;
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ thumbnail, images, productName }: ProductGalleryProps) {
  const allImages = [
    thumbnail || PLACEHOLDER_PRODUCT,
    ...images.sort((a, b) => a.display_order - b.display_order).map((img) => img.image_url),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={allImages[selectedIndex]}
          alt={`${productName} - ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all md:h-20 md:w-20",
                selectedIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
