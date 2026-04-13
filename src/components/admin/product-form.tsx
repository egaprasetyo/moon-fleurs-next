"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  productId?: string; // undefined = create, defined = edit
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!productId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discount_price: null as number | null,
    category_id: "",
    thumbnail_url: "",
    is_featured: false,
    is_active: true,
  });

  // Load categories
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("categories").select("*").eq("is_active", true).order("display_order");
      setCategories((data || []) as Category[]);
    };
    load();
  }, []);

  // Load product for edit
  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", productId).single();
      if (data) {
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          price: data.price,
          discount_price: data.discount_price,
          category_id: data.category_id,
          thumbnail_url: data.thumbnail_url || "",
          is_featured: data.is_featured,
          is_active: data.is_active,
        });
      }
    };
    load();
  }, [productId]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      discount_price: form.discount_price || null,
    };

    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", productId)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast.error(isEdit ? "Gagal update produk" : "Gagal tambah produk", { description: error.message });
    } else {
      toast.success(isEdit ? "Produk diperbarui" : "Produk ditambahkan");
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Produk *</Label>
              <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Harga (Rp) *</Label>
              <Input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Harga Diskon (Rp)</Label>
              <Input type="number" min={0} value={form.discount_price ?? ""} onChange={(e) => setForm({ ...form, discount_price: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gambar Thumbnail</Label>
            <ImageUpload
              value={form.thumbnail_url}
              onChange={(url) => setForm({ ...form, thumbnail_url: url })}
              bucket="products"
            />
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
              <Label>Produk Unggulan</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Aktif</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Perbarui Produk" : "Tambah Produk"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/products")}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
