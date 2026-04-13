"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT } from "@/lib/constants";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat produk");
    } else {
      setProducts((data || []) as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const { error, data } = await supabase.from("products").delete().eq("id", id).select();
    if (error || !data?.length) {
      toast.error(error?.message || "Gagal menghapus — cek RLS policy");
      fetchProducts();
    } else {
      toast.success("Produk berhasil dihapus");
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
    );
    const { error, data } = await supabase
      .from("products")
      .update({ is_active: !current })
      .eq("id", id)
      .select();
    if (error || !data?.length) {
      toast.error(error?.message || "Update gagal — cek RLS policy di Supabase");
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: current } : p))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Produk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola produk toko
          </p>
        </div>
        <Button asChild className="gap-2 rounded-full">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada produk
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image
                        src={product.thumbnail_url || PLACEHOLDER_PRODUCT}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      {product.is_featured && (
                        <Star className="inline h-3 w-3 fill-gold text-gold" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {product.category?.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {product.discount_price ? (
                      <div>
                        <span className="font-medium text-primary">
                          {formatPrice(product.discount_price)}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleActive(product.id, product.is_active)}
                        title={product.is_active ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {product.is_active ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/products/${product.id}`}>
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
                            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Produk &ldquo;{product.name}&rdquo; akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Hapus
                            </AlertDialogAction>
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
