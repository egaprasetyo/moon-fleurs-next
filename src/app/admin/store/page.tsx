"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { StoreInfo } from "@/types";

export default function AdminStorePage() {
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("store_info").select("*").single();
      setStore(data as StoreInfo | null);
      setLoading(false);
    };
    fetch();
  }, []);

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

            <Button type="submit" className="rounded-full" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
