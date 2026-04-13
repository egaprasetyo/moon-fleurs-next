"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT } from "@/lib/constants";
import type { ProductImage } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-muted/20 shadow-xl ring-1 ring-border/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={allImages[selectedIndex]}
              alt={`${productName} - ${selectedIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-hide">
          {allImages.map((img, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition-all md:h-24 md:w-24 snap-start",
                selectedIndex === i
                  ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                  : "border-border/50 opacity-60 hover:opacity-100 hover:border-primary/50"
              )}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
