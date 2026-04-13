"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalReviews: number;
  totalPromos: number;
  featuredProducts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, active, categories, reviews, promos, featured] =
          await Promise.all([
            supabase
              .from("products")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("products")
              .select("id", { count: "exact", head: true })
              .eq("is_active", true),
            supabase
              .from("categories")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("reviews")
              .select("id", { count: "exact", head: true })
              .eq("is_approved", true),
            supabase
              .from("promos")
              .select("id", { count: "exact", head: true })
              .eq("is_active", true),
            supabase
              .from("products")
              .select("id", { count: "exact", head: true })
              .eq("is_featured", true),
          ]);

        setStats({
          totalProducts: products.count || 0,
          activeProducts: active.count || 0,
          totalCategories: categories.count || 0,
          totalReviews: reviews.count || 0,
          totalPromos: promos.count || 0,
          featuredProducts: featured.count || 0,
        });
      } catch {
        // Silently fail — stats are non-critical
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Produk",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Produk Aktif",
      value: stats?.activeProducts ?? 0,
      icon: Eye,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Produk Unggulan",
      value: stats?.featuredProducts ?? 0,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Kategori",
      value: stats?.totalCategories ?? 0,
      icon: Heart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Review Aktif",
      value: stats?.totalReviews ?? 0,
      icon: Star,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      title: "Promo Aktif",
      value: stats?.totalPromos ?? 0,
      icon: MessageCircle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selamat datang di panel admin Moon Fleurs 🌸
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 md:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4 md:p-6">
                <div className={`mb-3 inline-flex rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">
                  {loading ? "—" : stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.title}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Catatan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Kelola produk, kategori, dan banner di menu samping</p>
          <p>• Semua pesanan masuk via WhatsApp — cek chat secara berkala</p>
          <p>• Review pelanggan perlu di-approve sebelum tampil di website</p>
          <p>• Promo/voucher otomatis tampil di halaman produk saat aktif</p>
        </CardContent>
      </Card>
    </div>
  );
}
