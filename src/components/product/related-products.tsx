"use client";

import { ProductCard } from "@/components/product/product-card";
import { useRelatedProducts } from "@/hooks/use-products";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
  manualIds?: string[];
}

export function RelatedProducts({ productId, categoryId, manualIds = [] }: RelatedProductsProps) {
  const { data: products, isLoading } = useRelatedProducts(
    productId,
    categoryId,
    manualIds,
    4
  );

  if (isLoading || !products || products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-heading text-2xl font-bold">Produk Terkait</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
