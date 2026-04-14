"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
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
import { toast } from "sonner";
import type { PopupBanner } from "@/types";

const frequencyLabels: Record<string, string> = {
  once_session: "1x / Sesi",
  once_day: "1x / Hari",
  always: "Selalu",
};

export default function AdminPopupBannersPage() {
  const [popups, setPopups] = useState<PopupBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPopups = async () => {
    const { data, error } = await supabase
      .from("popup_banners")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) toast.error("Gagal memuat popup banners");
    else setPopups((data || []) as PopupBanner[]);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPopups(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)));
    const { error, data } = await supabase
      .from("popup_banners")
      .update({ is_active: !current })
      .eq("id", id)
      .select();
    if (error || !data?.length) {
      toast.error(error?.message || "Gagal mengubah status");
      setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: current } : p)));
    }
  };

  const deletePopup = async (id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
    const { error, data } = await supabase
      .from("popup_banners")
      .delete()
      .eq("id", id)
      .select();
    if (error || !data?.length) {
      toast.error(error?.message || "Gagal menghapus");
      fetchPopups();
    } else {
      toast.success("Popup banner dihapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Popup Banner</h1>
          <p className="text-sm text-muted-foreground">Kelola popup promo di halaman publik</p>
        </div>
        <Button asChild className="gap-2 rounded-full">
          <Link href="/admin/popup-banners/new"><Plus className="h-4 w-4" />Tambah Popup</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Gambar</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead className="hidden md:table-cell">Halaman</TableHead>
              <TableHead className="hidden md:table-cell">Frekuensi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : popups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada popup banner</TableCell>
              </TableRow>
            ) : (
              popups.map((popup) => (
                <TableRow key={popup.id}>
                  <TableCell>
                    <div className="relative h-10 w-14 overflow-hidden rounded">
                      <Image src={popup.image_url} alt={popup.title} fill className="object-cover" sizes="56px" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{popup.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{popup.description || "—"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {popup.target_pages.map((page) => (
                        <Badge key={page} variant="outline" className="text-xs font-mono">{page}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {frequencyLabels[popup.show_frequency] || popup.show_frequency}
                  </TableCell>
                  <TableCell>
                    <Badge variant={popup.is_active ? "default" : "secondary"}>
                      {popup.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/popup-banners/${popup.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => toggleActive(popup.id, popup.is_active)}>
                        {popup.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Popup?</AlertDialogTitle>
                            <AlertDialogDescription>Popup &ldquo;{popup.title}&rdquo; akan dihapus.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground"
                              onClick={() => deletePopup(popup.id)}>Hapus</AlertDialogAction>
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
