"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionSection, MotionStagger, MotionItem } from "@/components/shared/motion";
import { PLACEHOLDER_CATEGORY } from "@/lib/constants";
import { motion } from "framer-motion";

export function CategoryShowcase() {
  const { data: categories, isLoading } = useCategories();

  // Limiting to 4 for homepage showcase
  const displayCategories = categories?.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Immersive background decoration */}
      <div className="pointer-events-none absolute -left-[10%] top-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-light/20 blur-[120px] dark:bg-rose-dark/10" />

      <Container>
        {/* Header */}
        <MotionSection className="mb-12 flex flex-col items-center text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary shadow-inner md:text-sm"
          >
            KOLEKSI EKSKLUSIF
          </motion.div>
          <h2 className="mt-6 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Kategori <span className="text-primary/90">Produk</span>
          </h2>
        </MotionSection>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-[1.5rem] md:rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <MotionStagger className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {displayCategories?.map((cat) => (
              <MotionItem key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl ring-1 ring-border/50 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <Image
                      src={cat.image_url || PLACEHOLDER_CATEGORY}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  
                  {/* Sophisticated Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80 opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  
                  {/* Top Content (Title) */}
                  <div className="absolute inset-x-0 top-0 p-4 md:p-8 md:pr-16">
                    <h3 className="font-heading text-xl font-bold text-white md:text-2xl lg:text-3xl drop-shadow-md transition-transform duration-500 group-hover:-translate-y-1">
                      {cat.name}
                    </h3>
                  </div>
                  
                  {/* Bottom Content (Desc) */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 md:p-8 md:pr-16">
                    {cat.description && (
                      <p className="mt-1 text-xs text-white/90 line-clamp-2 md:mt-2 md:line-clamp-3 md:text-white/80 md:text-sm opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 transition-all duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Action indicator (Hidden on mobile) */}
                  <div className="absolute bottom-8 right-8 hidden h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 transition-all duration-500 md:flex md:group-hover:opacity-100 md:group-hover:scale-110">
                    <MoveRight className="h-5 w-5 -rotate-45" />
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center md:mt-16">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            Lihat Semua Kategori
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
