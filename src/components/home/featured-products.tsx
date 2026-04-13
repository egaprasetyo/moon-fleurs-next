"use client";

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionSection, MotionStagger, MotionItem } from "@/components/shared/motion";
import { useFeaturedProducts } from "@/hooks/use-products";
import { motion } from "framer-motion";

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts(8);

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Decor */}
      <div className="pointer-events-none absolute right-0 top-20 -z-10 h-[600px] w-[600px] rounded-full bg-sage-light/20 blur-[150px] dark:bg-sage-dark/10" />

      <Container>
        {/* Header */}
        <MotionSection className="mb-12 flex flex-col items-center justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary shadow-inner md:text-sm"
            >
              PILIHAN TERBAIK
            </motion.div>
            <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight md:mt-6 md:text-5xl">
              Produk <span className="text-primary/90">Unggulan</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group hidden items-center gap-2 rounded-full border border-border/50 bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary md:flex"
          >
            Lihat Koleksi Lengkap
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </MotionSection>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : (
          <MotionStagger className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {products?.map((product) => (
              <MotionItem key={product.id}>
                <ProductCard product={product} />
              </MotionItem>
            ))}
          </MotionStagger>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            Semua Koleksi
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
