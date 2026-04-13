"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Promo } from "@/types";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPromos = async () => {
    const { data, error } = await supabase.from("promos").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Gagal memuat promo");
    else setPromos((data || []) as Promo[]);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPromos(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)));
    const { error } = await supabase.from("promos").update({ is_active: !current }).eq("id", id);
    if (error) {
      toast.error("Gagal mengubah status");
      setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: current } : p)));
    }
  };

  const deletePromo = async (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("promos").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus");
      fetchPromos();
    } else {
      toast.success("Promo dihapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Promo</h1>
          <p className="text-sm text-muted-foreground">Kelola voucher dan promo</p>
        </div>
        <Button asChild className="gap-2 rounded-full">
          <Link href="/admin/promos/new"><Plus className="h-4 w-4" />Tambah Promo</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Diskon</TableHead>
              <TableHead className="hidden md:table-cell">Berlaku</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : promos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada promo</TableCell>
              </TableRow>
            ) : (
              promos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">{promo.code}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {promo.discount_type === "percentage"
                      ? `${promo.discount_value}%`
                      : formatPrice(promo.discount_value)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDate(promo.valid_from)}
                    {promo.valid_until && ` — ${formatDate(promo.valid_until)}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={promo.is_active ? "default" : "secondary"}>
                      {promo.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => toggleActive(promo.id, promo.is_active)}>
                        {promo.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/promos/${promo.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Promo?</AlertDialogTitle>
                            <AlertDialogDescription>Promo &ldquo;{promo.code}&rdquo; akan dihapus.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground"
                              onClick={() => deletePromo(promo.id)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
