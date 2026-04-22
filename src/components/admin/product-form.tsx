"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import type { Category } from "@/types";

interface ProductFormProps {
  productId?: string;
}

type ProductOption = {
  id: string;
  name: string;
};

type ProductImageRow = {
  image_url: string;
  display_order: number;
};

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!productId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  /** String saat mengetik — hindari leading zero & angka 0 yang tidak bisa dikosongkan dari input type number */
  const [priceInput, setPriceInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    thumbnail_url: "",
    is_featured: false,
    is_active: true,
    related_product_ids: [] as string[],
  });

  useEffect(() => {
    const load = async () => {
      const categoriesPromise = supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      const productPromise = productId
        ? supabase.from("products").select("*").eq("id", productId).single()
        : Promise.resolve({ data: null, error: null });

      const imagePromise = productId
        ? supabase
            .from("product_images")
            .select("image_url, display_order")
            .eq("product_id", productId)
            .order("display_order", { ascending: true })
        : Promise.resolve({ data: [], error: null });

      const optionsPromise = supabase
        .from("products")
        .select("id, name")
        .order("name", { ascending: true });

      const [catResult, productResult, imageResult, optionsResult] = await Promise.all([
        categoriesPromise,
        productPromise,
        imagePromise,
        optionsPromise,
      ]);

      if (catResult.error) {
        toast.error("Gagal memuat kategori", { description: catResult.error.message });
      } else {
        setCategories((catResult.data || []) as Category[]);
      }

      if (optionsResult.error) {
        toast.error("Gagal memuat daftar produk", {
          description: optionsResult.error.message,
        });
      } else {
        setProductOptions((optionsResult.data || []) as ProductOption[]);
      }

      if (productResult.error) {
        toast.error("Gagal memuat detail produk", {
          description: productResult.error.message,
        });
      } else if (productResult.data) {
        setPriceInput(String(productResult.data.price ?? ""));
        setDiscountInput(
          productResult.data.discount_price != null
            ? String(productResult.data.discount_price)
            : ""
        );
        setForm({
          name: productResult.data.name,
          slug: productResult.data.slug,
          description: productResult.data.description || "",
          category_id: productResult.data.category_id,
          thumbnail_url: productResult.data.thumbnail_url || "",
          is_featured: productResult.data.is_featured,
          is_active: productResult.data.is_active,
          related_product_ids: Array.isArray(productResult.data.related_product_ids)
            ? productResult.data.related_product_ids
            : [],
        });
      }

      if (imageResult.error) {
        toast.error("Gagal memuat galeri produk", { description: imageResult.error.message });
      } else {
        const images = (imageResult.data || []) as ProductImageRow[];
        if (productId) {
          setGalleryImages(images.map((item) => item.image_url));
        } else {
          setGalleryImages(images.length > 0 ? images.map((item) => item.image_url) : [""]);
        }
      }
    };

    load();
  }, [productId, supabase]);

  const relatedOptions = useMemo(
    () => productOptions.filter((option) => option.id !== productId),
    [productId, productOptions]
  );

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit
        ? prev.slug
        : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const toggleRelatedProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      related_product_ids: prev.related_product_ids.includes(id)
        ? prev.related_product_ids.filter((item) => item !== id)
        : [...prev.related_product_ids, id],
    }));
  };

  const setGalleryImageAt = (index: number, url: string) => {
    setGalleryImages((prev) => prev.map((item, idx) => (idx === index ? url : item)));
  };

  const addGalleryImageField = () => {
    setGalleryImages((prev) => [...prev, ""]);
  };

  const removeGalleryImageAt = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category_id) {
      toast.error("Kategori wajib dipilih");
      return;
    }

    const price = parseInt(priceInput, 10);
    if (priceInput.trim() === "" || Number.isNaN(price)) {
      toast.error("Harga wajib diisi dengan angka yang valid");
      return;
    }
    if (price < 0) {
      toast.error("Harga tidak boleh negatif");
      return;
    }

    let discount_price: number | null = null;
    if (discountInput.trim() !== "") {
      const d = parseInt(discountInput, 10);
      if (Number.isNaN(d) || d < 0) {
        toast.error("Harga diskon tidak valid");
        return;
      }
      discount_price = d;
      if (discount_price >= price) {
        toast.error("Harga diskon harus lebih kecil dari harga normal");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        price,
        description: form.description || null,
        thumbnail_url: form.thumbnail_url || null,
        discount_price,
        related_product_ids: form.related_product_ids,
      };

      let targetProductId = productId;

      if (isEdit) {
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productId)
          .select("id")
          .single();

        if (error) throw error;
        targetProductId = data.id;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;
        targetProductId = data.id;
      }

      if (!targetProductId) {
        throw new Error("Tidak bisa menemukan ID produk setelah simpan");
      }

      const cleanedImages = galleryImages
        .map((url) => url.trim())
        .filter(Boolean);

      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", targetProductId);

      if (deleteImagesError) throw deleteImagesError;

      if (cleanedImages.length > 0) {
        const { error: insertImagesError } = await supabase
          .from("product_images")
          .insert(
            cleanedImages.map((imageUrl, index) => ({
              product_id: targetProductId,
              image_url: imageUrl,
              display_order: index,
            }))
          );

        if (insertImagesError) throw insertImagesError;
      }

      toast.success(isEdit ? "Produk diperbarui" : "Produk ditambahkan");
      router.push("/admin/products");
    } catch (error) {
      toast.error(isEdit ? "Gagal update produk" : "Gagal tambah produk", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Produk *</Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Harga (Rp) *</Label>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Contoh: 450000"
                value={priceInput}
                onChange={(e) => setPriceInput(digitsOnly(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Harga Diskon (Rp)</Label>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Kosongkan jika tidak ada diskon"
                value={discountInput}
                onChange={(e) => setDiscountInput(digitsOnly(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm({ ...form, category_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gambar utama (thumbnail)</Label>
            <p className="text-xs text-muted-foreground">
              Dipakai di kartu produk & daftar
            </p>
            <ImageUpload
              value={form.thumbnail_url}
              onChange={(url) => setForm({ ...form, thumbnail_url: url })}
              bucket="products"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Label>Galeri foto (banyak gambar)</Label>
                <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                  Anda bisa upload beberapa file atau tempel URL per slot.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
                onClick={addGalleryImageField}
              >
                <Plus className="h-4 w-4" />
                Tambah slot foto
              </Button>
            </div>

            {galleryImages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada slot galeri. Klik &quot;Tambah slot foto&quot; untuk menambah foto ke-2, ke-3, dan seterusnya.
              </p>
            ) : (
              <div className="space-y-4">
                {galleryImages.map((imageUrl, index) => (
                  <div key={`gallery-${index}`} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Gambar #{index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeGalleryImageAt(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <ImageUpload
                      value={imageUrl}
                      onChange={(url) => setGalleryImageAt(index, url)}
                      bucket="products"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Produk Terkait (Manual Override)</Label>
            {relatedOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada produk lain yang bisa dipilih.
              </p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border p-3">
                {relatedOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/60"
                  >
                    <input
                      type="checkbox"
                      checked={form.related_product_ids.includes(option.id)}
                      onChange={() => toggleRelatedProduct(option.id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{option.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
              />
              <Label>Produk Unggulan</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label>Aktif</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Perbarui Produk" : "Tambah Produk"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/admin/products")}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
