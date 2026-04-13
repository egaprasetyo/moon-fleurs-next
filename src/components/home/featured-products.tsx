"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionSection, MotionStagger, MotionItem } from "@/components/shared/motion";
import { useFeaturedProducts } from "@/hooks/use-products";

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts(8);

  return (
    <section className="py-16 md:py-24">
      <Container>
        {/* Header */}
        <MotionSection className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Pilihan Terbaik
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Produk Unggulan
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionSection>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <MotionStagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products?.map((product) => (
              <MotionItem key={product.id}>
                <ProductCard product={product} />
              </MotionItem>
            ))}
          </MotionStagger>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat Semua Produk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
