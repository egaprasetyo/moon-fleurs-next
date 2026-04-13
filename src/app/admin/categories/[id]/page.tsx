"use client";

import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Kategori</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi kategori produk</p>
      </div>
      <CategoryForm categoryId={categoryId} />
    </div>
  );
}
