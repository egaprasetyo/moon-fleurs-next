"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Eye,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalReviews: number;
  totalPromos: number;
  featuredProducts: number;
}

interface CategoryData {
  name: string;
  count: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          productsResult,
          activeResult,
          categoriesResult,
          reviewsResult,
          promosResult,
          featuredResult,
          allProductsResult,
          allCategoriesResult
        ] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("categories").select("id", { count: "exact", head: true }),
          supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", true),
          supabase.from("promos").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
          supabase.from("products").select("category_id"),
          supabase.from("categories").select("id, name")
        ]);

        setStats({
          totalProducts: productsResult.count || 0,
          activeProducts: activeResult.count || 0,
          totalCategories: categoriesResult.count || 0,
          totalReviews: reviewsResult.count || 0,
          totalPromos: promosResult.count || 0,
          featuredProducts: featuredResult.count || 0,
        });

        // Compute Chart Data (Products per category)
        if (allCategoriesResult.data && allProductsResult.data) {
          const catCounts: CategoryData[] = allCategoriesResult.data.map((c: { name: string }) => ({
            name: c.name,
            count: 0
          }));

          allProductsResult.data.forEach((p: { category_id: string }) => {
            const cat = allCategoriesResult.data?.find((c: { id: string }) => c.id === p.category_id);
            if (cat) {
              const statItem = catCounts.find((cc: CategoryData) => cc.name === cat.name);
              if (statItem) statItem.count += 1;
            }
          });

          setChartData(catCounts.sort((a, b) => b.count - a.count).slice(0, 5)); // Top 5 categories
        }

      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Produk", value: stats?.totalProducts ?? 0, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Produk Aktif", value: stats?.activeProducts ?? 0, icon: Eye, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Produk Unggulan", value: stats?.featuredProducts ?? 0, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { title: "Kategori", value: stats?.totalCategories ?? 0, icon: Heart, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Review Website", value: stats?.totalReviews ?? 0, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Promo Berjalan", value: stats?.totalPromos ?? 0, icon: MessageCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const chartConfig = {
    count: {
      label: "Jumlah Produk",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between border border-primary/10">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard Analitik</h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Selamat Datang di Command Center Moon Fleurs 🌸
          </p>
        </div>
        <div className="mt-2 flex h-fit items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5 backdrop-blur-sm sm:mt-0 ring-1 ring-border shadow-sm">
          <div className={`h-2 w-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-xs font-semibold uppercase">{loading ? 'Sinkronisasi...' : 'Sistem Optimal'}</span>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="group overflow-hidden border-border/40 bg-background/50 shadow-sm backdrop-blur-md transition-all hover:bg-card hover:shadow-md">
              <CardContent className="p-5">
                <div className={`mb-4 inline-flex items-center justify-center rounded-xl p-2.5 transition-transform group-hover:scale-110 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold tracking-tight">
                  {loading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted"></span>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & Info Area */}
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">

        {/* Chart Section */}
        <Card className="flex flex-col shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Distribusi Produk</CardTitle>
            <CardDescription>Lima Kategori dengan Koleksi Terbanyak</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {loading ? (
              <div className="flex h-[300px] items-center justify-center rounded-xl bg-muted/20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full mt-4">
                <BarChart accessibilityLayer data={chartData} margin={{ left: 0, right: 10, top: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={true} strokeDasharray="3 3" stroke="#9ca3af" opacity={0.4} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    className="text-xs font-medium"
                    allowDecimals={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                    className="text-xs font-medium"
                  />
                  <ChartTooltip cursor={{ fill: 'var(--color-primary)', opacity: 0.1 }} content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                <Package className="mb-2 h-10 w-10 opacity-20" />
                <p>Belum ada data distribusi produk</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info & Notifications */}
        <Card className="flex flex-col shadow-sm border-border/50 bg-gradient-to-b from-card to-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Catatan Sistem</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4 rounded-xl">
              {[
                { title: "Manajemen Order", desc: "Semua pesanan masuk diteruskan langsung via WhatsApp, pastikan CS merespon secara aktif." },
                { title: "Review Produk", desc: "Pastikan selalu menyaring review pelanggan di menu 'Reviews' sebelum diterbitkan." },
                { title: "Kode Kupon / Promo", desc: "Anda dapat menandai Promo sebagai 'Aktif' agar diskon dan banner terpanjang di website konsumen." }
              ].map((item, idx) => (
                <div key={idx} className="group relative rounded-lg border border-border/40 bg-background/50 p-3 shadow-sm transition-colors hover:bg-muted/50">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item.title}
                  </h4>
                  <p className="mt-1.5 pl-3.5 text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
