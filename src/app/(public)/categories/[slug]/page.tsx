"use client";

import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: category, isLoading: catLoading } = useCategory(slug);
  const { data: products, isLoading: prodLoading } = useProducts({
    categorySlug: slug,
  });

  const isLoading = catLoading || prodLoading;

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-8">
        <Container>
          {catLoading ? (
            <>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-72" />
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-bold md:text-4xl">
                {category?.name || "Kategori"}
              </h1>
              {category?.description && (
                <p className="mt-2 text-muted-foreground">
                  {category.description}
                </p>
              )}
            </>
          )}
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
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
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-4 text-5xl">🌸</span>
              <h3 className="text-lg font-semibold">Belum ada produk</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Kategori ini belum memiliki produk
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
