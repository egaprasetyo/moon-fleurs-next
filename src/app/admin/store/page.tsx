"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/admin/image-upload";
import { Clock, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { StoreInfo, OperatingHour, SocialLink, SocialPlatform } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
];

const DEFAULT_HOURS: OperatingHour[] = [
  { day: "Senin", open: "08:00", close: "20:00" },
  { day: "Selasa", open: "08:00", close: "20:00" },
  { day: "Rabu", open: "08:00", close: "20:00" },
  { day: "Kamis", open: "08:00", close: "20:00" },
  { day: "Jumat", open: "08:00", close: "20:00" },
  { day: "Sabtu", open: "09:00", close: "18:00" },
  { day: "Minggu", open: null, close: null, isClosed: true },
];

export default function AdminStorePage() {
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("store_info").select("*").single();
      if (data) {
        setStore({
          ...(data as StoreInfo),
          images: Array.isArray((data as StoreInfo).images)
            ? (data as StoreInfo).images
            : [],
          social_links: Array.isArray((data as StoreInfo).social_links)
            ? (data as StoreInfo).social_links
            : [],
        });
      } else {
        setStore(null);
      }
      setLoading(false);
    };
    fetch();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    setSaving(true);

    const { error } = await supabase
      .from("store_info")
      .update({
        name: store.name,
        address: store.address,
        phone: store.phone,
        whatsapp_number: store.whatsapp_number,
        google_maps_url: store.google_maps_url,
        latitude: store.latitude,
        longitude: store.longitude,
        operating_hours: store.operating_hours,
        images: store.images || [],
        social_links: store.social_links || [],
      })
      .eq("id", store.id);

    if (error) toast.error("Gagal menyimpan");
    else toast.success("Info toko berhasil diperbarui");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Data toko belum ada. Jalankan SQL migration terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Info Toko</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi toko (alamat, jam, WhatsApp)
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Toko</Label>
              <Input
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Alamat</Label>
              <Textarea
                value={store.address}
                onChange={(e) => setStore({ ...store, address: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input
                  value={store.phone || ""}
                  onChange={(e) => setStore({ ...store, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (62...)</Label>
                <Input
                  value={store.whatsapp_number || ""}
                  onChange={(e) => setStore({ ...store, whatsapp_number: e.target.value })}
                  placeholder="6281234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Google Maps Embed URL</Label>
              <Input
                value={store.google_maps_url || ""}
                onChange={(e) => setStore({ ...store, google_maps_url: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={store.latitude ?? ""}
                  onChange={(e) =>
                    setStore({ ...store, latitude: e.target.value ? parseFloat(e.target.value) : null })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={store.longitude ?? ""}
                  onChange={(e) =>
                    setStore({ ...store, longitude: e.target.value ? parseFloat(e.target.value) : null })
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Galeri Toko</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(store.images || []).length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada gambar galeri. Tambahkan foto toko agar tampil di halaman publik.
            </p>
          )}

          {(store.images || []).map((imageUrl, index) => (
            <div key={`store-image-${index}`} className="rounded-xl border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Gambar #{index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() =>
                    setStore({
                      ...store,
                      images: (store.images || []).filter((_, idx) => idx !== index),
                    })
                  }
                >
                  Hapus
                </Button>
              </div>
              <ImageUpload
                value={imageUrl}
                onChange={(url) =>
                  setStore({
                    ...store,
                    images: (store.images || []).map((item, idx) =>
                      idx === index ? url : item
                    ),
                  })
                }
                bucket="stores"
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setStore({
                ...store,
                images: [...(store.images || []), ""],
              })
            }
          >
            Tambah Gambar
          </Button>
        </CardContent>
      </Card>

      {/* Operating Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Jam Operasional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(store.operating_hours?.length ? store.operating_hours : DEFAULT_HOURS).map(
            (item, index) => {
              const hours = store.operating_hours?.length
                ? store.operating_hours
                : DEFAULT_HOURS;

              const updateHour = (field: keyof OperatingHour, value: string | boolean | null) => {
                const updated = [...hours];
                updated[index] = { ...updated[index], [field]: value };
                setStore({ ...store, operating_hours: updated });
              };

              const toggleClosed = (closed: boolean) => {
                const updated = [...hours];
                updated[index] = {
                  ...updated[index],
                  isClosed: closed,
                  open: closed ? null : "08:00",
                  close: closed ? null : "20:00",
                };
                setStore({ ...store, operating_hours: updated });
              };

              return (
                <div
                  key={item.day}
                  className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="min-w-[80px] font-semibold">{item.day}</span>

                  <div className="flex flex-1 items-center gap-3">
                    {item.isClosed ? (
                      <span className="flex-1 text-center text-sm text-muted-foreground italic">
                        Tutup
                      </span>
                    ) : (
                      <>
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">Buka</Label>
                          <Input
                            type="time"
                            value={item.open || ""}
                            onChange={(e) => updateHour("open", e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <span className="mt-5 text-muted-foreground">–</span>
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">Tutup</Label>
                          <Input
                            type="time"
                            value={item.close || ""}
                            onChange={(e) => updateHour("close", e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <Switch
                      checked={!!item.isClosed}
                      onCheckedChange={toggleClosed}
                    />
                    <Label className="text-xs text-muted-foreground cursor-pointer">Libur</Label>
                  </div>
                </div>
              );
            }
          )}
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Social Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(store.social_links || []).length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada social media. Tambahkan agar tampil di footer.
            </p>
          )}

          {(store.social_links || []).map((link, index) => (
            <div
              key={`social-${index}`}
              className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-shrink-0 space-y-1 sm:w-44">
                <Label className="text-xs text-muted-foreground">Platform</Label>
                <Select
                  value={link.platform}
                  onValueChange={(v) => {
                    const updated = [...(store.social_links || [])];
                    updated[index] = { ...updated[index], platform: v as SocialPlatform };
                    setStore({ ...store, social_links: updated });
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...(store.social_links || [])];
                    updated[index] = { ...updated[index], url: e.target.value };
                    setStore({ ...store, social_links: updated });
                  }}
                  placeholder="https://instagram.com/moonfleurs"
                  className="h-9"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
                onClick={() =>
                  setStore({
                    ...store,
                    social_links: (store.social_links || []).filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setStore({
                ...store,
                social_links: [
                  ...(store.social_links || []),
                  { platform: "instagram", url: "" },
                ],
              })
            }
          >
            Tambah Social Media
          </Button>
        </CardContent>
      </Card>

      <Button
        className="rounded-full"
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </div>
  );
}
