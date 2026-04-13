"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Produk</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi produk</p>
      </div>
      <ProductForm productId={productId} />
    </div>
  );
}
