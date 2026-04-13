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
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

interface CategoryFormProps {
  categoryId?: string;
}

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!categoryId;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!categoryId) return;
    const load = async () => {
      const { data } = await supabase.from("categories").select("*").eq("id", categoryId).single();
      if (data) {
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          image_url: data.image_url || "",
          display_order: data.display_order,
          is_active: data.is_active,
        });
      }
    };
    load();
  }, [categoryId]);

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
      image_url: form.image_url || null,
    };

    const { error } = isEdit
      ? await supabase.from("categories").update(payload).eq("id", categoryId)
      : await supabase.from("categories").insert(payload);

    if (error) {
      toast.error(isEdit ? "Gagal update" : "Gagal tambah", { description: error.message });
    } else {
      toast.success(isEdit ? "Kategori diperbarui" : "Kategori ditambahkan");
      router.push("/admin/categories");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Kategori *</Label>
              <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Gambar</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                bucket="products"
              />
            </div>
            <div className="space-y-2">
              <Label>Urutan Tampil</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <Label>Aktif</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Perbarui" : "Tambah Kategori"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/categories")}>Batal</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
