"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { toast } from "sonner";
import type { Category } from "@/types";
import { PLACEHOLDER_CATEGORY } from "@/lib/constants";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
    if (error) toast.error("Gagal memuat kategori");
    else setCategories((data || []) as Category[]);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchCategories(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
    const { error } = await supabase.from("categories").update({ is_active: !current }).eq("id", id);
    if (error) {
      toast.error("Gagal mengubah status");
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: current } : c)));
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus (mungkin masih ada produk)");
      fetchCategories();
    } else {
      toast.success("Kategori dihapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Kategori</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori produk</p>
        </div>
        <Button asChild className="gap-2 rounded-full">
          <Link href="/admin/categories/new"><Plus className="h-4 w-4" />Tambah Kategori</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden md:table-cell">Urutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada kategori</TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image src={cat.image_url || PLACEHOLDER_CATEGORY} alt={cat.name} fill className="object-cover" sizes="40px" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{cat.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">{cat.slug}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{cat.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={cat.is_active ? "default" : "secondary"}>
                      {cat.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(cat.id, cat.is_active)}>
                        {cat.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                            <AlertDialogDescription>Kategori &ldquo;{cat.name}&rdquo; akan dihapus.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => deleteCategory(cat.id)}>Hapus</AlertDialogAction>
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
