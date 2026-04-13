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
import type { Product } from "@/types";

interface ReviewFormProps {
  reviewId?: string;
}

export function ReviewForm({ reviewId }: ReviewFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!reviewId;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    reviewer_name: "",
    rating: 5,
    comment: "",
    product_id: "",
    is_approved: true,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("products").select("id, name").eq("is_active", true).order("name");
      setProducts((data || []) as Product[]);
    };
    load();
  }, []);

  useEffect(() => {
    if (!reviewId) return;
    const load = async () => {
      const { data } = await supabase.from("reviews").select("*").eq("id", reviewId).single();
      if (data) {
        setForm({
          reviewer_name: data.reviewer_name,
          rating: data.rating,
          comment: data.comment || "",
          product_id: data.product_id || "",
          is_approved: data.is_approved,
        });
      }
    };
    load();
  }, [reviewId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      comment: form.comment || null,
      product_id: form.product_id || null,
    };

    const { error } = isEdit
      ? await supabase.from("reviews").update(payload).eq("id", reviewId)
      : await supabase.from("reviews").insert(payload);

    if (error) {
      toast.error(isEdit ? "Gagal update" : "Gagal tambah", { description: error.message });
    } else {
      toast.success(isEdit ? "Review diperbarui" : "Review ditambahkan");
      router.push("/admin/reviews");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Reviewer *</Label>
              <Input value={form.reviewer_name} onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5) *</Label>
              <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Komentar</Label>
            <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Produk</Label>
            <Select value={form.product_id} onValueChange={(v) => setForm({ ...form, product_id: v })}>
              <SelectTrigger><SelectValue placeholder="Pilih produk (opsional)" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_approved} onCheckedChange={(v) => setForm({ ...form, is_approved: v })} />
            <Label>Approved (tampil di website)</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Perbarui" : "Tambah Review"}
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => router.push("/admin/reviews")}>Batal</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
