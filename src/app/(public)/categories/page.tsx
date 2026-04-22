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

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Immersive background decoration */}
      <div className="pointer-events-none absolute -left-[10%] top-0 -z-10 h-[600px] w-[600px] rounded-full bg-rose-light/20 blur-[150px]" />
      <div className="pointer-events-none absolute -right-[10%] top-[40%] -z-10 h-[500px] w-[500px] rounded-full bg-sage-light/20 blur-[130px]" />

      <section className="py-12 md:py-24">
        <Container>
          {/* Header */}
          <MotionSection className="mb-16 text-center md:mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold tracking-widest text-primary shadow-inner"
            >
              KOLEKSI EKSKLUSIF
            </motion.div>
            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight md:text-6xl">
              Jelajahi <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">Kategori</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground/90 md:text-xl">
              Temukan koleksi bunga segar dan artificial yang sesuai tema dan momen perayaan Anda. Tiap kategori dirangkai dengan dedikasi untuk keindahan yang Anda inginkan.
            </p>
          </MotionSection>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-[1.5rem] md:rounded-[2.5rem]" />
              ))}
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl drop-shadow-md">🌸</span>
              <h2 className="mt-6 font-heading text-2xl font-bold">Kategori Kosong</h2>
              <p className="mt-2 text-muted-foreground">Belum ada kategori yang ditambahkan saat ini.</p>
            </div>
          ) : (
            <MotionStagger className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
              {categories.map((cat) => (
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
                        priority
                      />
                    </div>
                    
                    {/* Sophisticated Dark Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80 opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                    
                    {/* Top Content (Title) */}
                    <div className="absolute inset-x-0 top-0 p-4 md:p-8 md:pr-16">
                      <h3 className="font-heading text-xl font-bold text-white md:text-3xl drop-shadow-md transition-transform duration-500 group-hover:translate-x-2">
                        {cat.name}
                      </h3>
                    </div>
                    
                    {/* Bottom Content (Desc) */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 md:p-8 md:pr-20">
                      {cat.description && (
                        <p className="mt-1 text-xs text-white/90 line-clamp-2 md:mt-2 md:line-clamp-3 md:text-white/80 md:text-base opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 transition-all duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {/* Action indicator (Hidden on mobile to avoid text overlap) */}
                    <div className="absolute bottom-8 right-8 hidden h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 transition-all duration-500 md:flex md:group-hover:opacity-100 md:group-hover:scale-110">
                      <MoveRight className="h-5 w-5" />
                    </div>
                  </Link>
                </MotionItem>
              ))}
            </MotionStagger>
          )}
        </Container>
      </section>
    </div>
  );
}
