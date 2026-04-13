"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionSection, MotionStagger, MotionItem } from "@/components/shared/motion";
import { PLACEHOLDER_CATEGORY } from "@/lib/constants";

export function CategoryShowcase() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <Container>
        {/* Header */}
        <MotionSection className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Jelajahi Koleksi
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Kategori Produk
          </h2>
        </MotionSection>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <MotionStagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {categories?.map((cat) => (
              <MotionItem key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl block"
                >
                  <Image
                    src={cat.image_url || PLACEHOLDER_CATEGORY}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-heading text-lg font-semibold text-white md:text-xl">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-1 text-xs text-white/70 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>
        )}
      </Container>
    </section>
  );
}
