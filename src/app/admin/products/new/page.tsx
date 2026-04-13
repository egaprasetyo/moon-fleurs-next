import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tambah Produk</h1>
        <p className="text-sm text-muted-foreground">Tambah produk baru ke katalog</p>
      </div>
      <ProductForm />
    </div>
  );
}
