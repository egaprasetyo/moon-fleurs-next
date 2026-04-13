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
import { toast } from "sonner";

interface PromoFormProps {
  promoId?: string;
}

export function PromoForm({ promoId }: PromoFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!promoId;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    min_order_amount: null as number | null,
    is_active: true,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: "",
  });

  useEffect(() => {
    if (!promoId) return;
    const load = async () => {
      const { data } = await supabase.from("promos").select("*").eq("id", promoId).single();
      if (data) {
        setForm({
          code: data.code,
          description: data.description || "",
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_order_amount: data.min_order_amount,
          is_active: data.is_active,
          valid_from: data.valid_from?.split("T")[0] || "",
          valid_until: data.valid_until?.split("T")[0] || "",
        });
      }
    };
    load();
  }, [promoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      description: form.description || null,
      min_order_amount: form.min_order_amount || null,
      valid_until: form.valid_until || null,
    };

    const { error } = isEdit
      ? await supabase.from("promos").update(payload).eq("id", promoId)
      : await supabase.from("promos").insert(payload);

    if (error) {
      toast.error(isEdit ? "Gagal update" : "Gagal tambah", { description: error.message });
    } else {
      toast.success(isEdit ? "Promo diperbarui" : "Promo ditambahkan");
      router.push("/admin/promos");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Kode Promo *</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME20" required className="font-mono uppercase" />
            </div>
            <div className="space-y-2">
              <Label>Tipe Diskon *</Label>
              <Select value={form.discount_type} onValueChange={(v: "percentage" | "fixed") => setForm({ ...form, discount_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Persentase (%)</SelectItem>
                  <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nilai Diskon *</Label>
              <Input type="number" min={1} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Min. Order (Rp)</Label>
              <Input type="number" min={0} value={form.min_order_amount ?? ""} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value ? Number(e.target.value) : null })} />
            </div>
          </div>
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
          <div className="flex items-center gap-2">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <Label>Aktif</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Perbarui" : "Tambah Promo"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/promos")}>Batal</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
