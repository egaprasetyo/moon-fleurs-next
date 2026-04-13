"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

interface BannerFormProps {
  bannerId?: string;
}

export function BannerForm({ bannerId }: BannerFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!bannerId;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!bannerId) return;
    const load = async () => {
      const { data } = await supabase.from("banners").select("*").eq("id", bannerId).single();
      if (data) {
        setForm({
          title: data.title,
          subtitle: data.subtitle || "",
          image_url: data.image_url,
          link_url: data.link_url || "",
          display_order: data.display_order,
          is_active: data.is_active,
        });
      }
    };
    load();
  }, [bannerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      subtitle: form.subtitle || null,
      link_url: form.link_url || null,
    };

    const { error } = isEdit
      ? await supabase.from("banners").update(payload).eq("id", bannerId)
      : await supabase.from("banners").insert(payload);

    if (error) {
      toast.error(isEdit ? "Gagal update" : "Gagal tambah", { description: error.message });
    } else {
      toast.success(isEdit ? "Banner diperbarui" : "Banner ditambahkan");
      router.push("/admin/banners");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Judul *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Gambar Banner *</Label>
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              bucket="banners"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="/products" />
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
              {loading ? "Menyimpan..." : isEdit ? "Perbarui" : "Tambah Banner"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/banners")}>Batal</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
