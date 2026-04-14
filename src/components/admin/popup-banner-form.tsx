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
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { X } from "lucide-react";
import { toast } from "sonner";

interface PopupBannerFormProps {
  popupId?: string;
}

const PAGE_OPTIONS = [
  { value: "/", label: "Homepage" },
  { value: "/products", label: "Produk" },
  { value: "/store", label: "Toko" },
  { value: "/wishlist", label: "Wishlist" },
];

export function PopupBannerForm({ popupId }: PopupBannerFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!popupId;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    button_text: "Lihat Promo",
    show_delay: 3,
    show_frequency: "once_session" as "once_session" | "once_day" | "always",
    target_pages: ["/"] as string[],
    is_active: true,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: "",
    display_order: 0,
  });

  useEffect(() => {
    if (!popupId) return;
    const load = async () => {
      const { data } = await supabase.from("popup_banners").select("*").eq("id", popupId).single();
      if (data) {
        setForm({
          title: data.title,
          description: data.description || "",
          image_url: data.image_url,
          link_url: data.link_url || "",
          button_text: data.button_text || "Lihat Promo",
          show_delay: data.show_delay,
          show_frequency: data.show_frequency,
          target_pages: data.target_pages || ["/"],
          is_active: data.is_active,
          valid_from: data.valid_from?.split("T")[0] || "",
          valid_until: data.valid_until?.split("T")[0] || "",
          display_order: data.display_order,
        });
      }
    };
    load();
  }, [popupId]);

  const togglePage = (page: string) => {
    setForm((prev) => ({
      ...prev,
      target_pages: prev.target_pages.includes(page)
        ? prev.target_pages.filter((p) => p !== page)
        : [...prev.target_pages, page],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) {
      toast.error("Gambar wajib diisi");
      return;
    }
    if (form.target_pages.length === 0) {
      toast.error("Pilih minimal 1 halaman target");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      description: form.description || null,
      link_url: form.link_url || null,
      valid_until: form.valid_until || null,
    };

    const { error } = isEdit
      ? await supabase.from("popup_banners").update(payload).eq("id", popupId)
      : await supabase.from("popup_banners").insert(payload);

    if (error) {
      toast.error(isEdit ? "Gagal update" : "Gagal tambah", { description: error.message });
    } else {
      toast.success(isEdit ? "Popup diperbarui" : "Popup ditambahkan");
      router.push("/admin/popup-banners");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label>Judul *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="🌸 Promo Spesial!" required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Detail promo..." />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Gambar Popup *</Label>
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              bucket="banners"
            />
          </div>

          {/* Link + Button Text */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="/products" />
            </div>
            <div className="space-y-2">
              <Label>Teks Tombol</Label>
              <Input value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} />
            </div>
          </div>

          {/* Target Pages */}
          <div className="space-y-2">
            <Label>Tampilkan di Halaman *</Label>
            <div className="flex flex-wrap gap-2">
              {PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => togglePage(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    form.target_pages.includes(opt.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  {form.target_pages.includes(opt.value) && (
                    <X className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Behavior */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Delay (detik)</Label>
              <Input type="number" min={0} max={30} value={form.show_delay} onChange={(e) => setForm({ ...form, show_delay: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Frekuensi</Label>
              <Select value={form.show_frequency} onValueChange={(v: "once_session" | "once_day" | "always") => setForm({ ...form, show_frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="once_session">1x per Sesi</SelectItem>
                  <SelectItem value="once_day">1x per Hari</SelectItem>
                  <SelectItem value="always">Setiap Kunjungan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </div>
          </div>

          {/* Validity */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Berlaku Dari *</Label>
              <Input type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Berlaku Sampai</Label>
              <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <Label>Aktif</Label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Perbarui Popup" : "Tambah Popup"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/popup-banners")}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
