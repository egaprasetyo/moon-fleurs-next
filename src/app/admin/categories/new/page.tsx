import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tambah Kategori</h1>
        <p className="text-sm text-muted-foreground">Tambah kategori produk baru</p>
      </div>
      <CategoryForm />
    </div>
  );
}
