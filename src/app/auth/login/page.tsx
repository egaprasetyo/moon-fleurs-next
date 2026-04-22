"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownReasonToast = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    if (hasShownReasonToast.current) return;

    const reason = searchParams.get("reason");
    if (!reason) return;

    hasShownReasonToast.current = true;

    if (reason === "not_admin") {
      toast.error("Akun ini bukan admin", {
        description:
          "Login berhasil, tapi role bukan admin. Pastikan `profiles.role = 'admin'`.",
      });
      return;
    }

    if (reason === "profile_error") {
      toast.error("Tidak bisa memverifikasi profil admin", {
        description:
          "Cek tabel `profiles` dan RLS policy. User harus punya baris profil.",
      });
      return;
    }

    if (reason === "unauthenticated") {
      toast.info("Silakan login untuk mengakses halaman admin");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login gagal", { description: error.message });
      setLoading(false);
      return;
    }

    const userId = signInData.user?.id;
    if (!userId) {
      toast.error("Login gagal", { description: "Session user tidak ditemukan." });
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      await supabase.auth.signOut();
      toast.error("Login berhasil, tapi validasi admin gagal", {
        description:
          "Periksa tabel `profiles` dan policy RLS. User harus bisa membaca profilnya sendiri.",
      });
      setLoading(false);
      return;
    }

    if (!profile || profile.role !== "admin") {
      await supabase.auth.signOut();
      toast.error("Akun ini bukan admin", {
        description: "Set `profiles.role` menjadi `admin` untuk akun ini.",
      });
      setLoading(false);
      return;
    }

    toast.success("Berhasil login!");
    router.replace("/admin");
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
      {/* Ambient Moving Glows */}
      <div className="pointer-events-none absolute -top-40 right-[10%] h-[500px] w-[500px] animate-pulse-ring rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 left-[10%] h-[600px] w-[600px] rounded-full bg-sage-light/30 blur-[120px] dark:bg-sage-dark/10" />

      {/* Floating Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/40 sm:p-10">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner ring-1 ring-primary/20"
            >
              <span className="text-3xl">🌸</span>
            </motion.div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Selamat Datang
            </h1>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure Admin Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@moonfleurs.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-2xl border-white/30 bg-white/50 px-4 text-base transition-all focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-white/10 dark:bg-black/50"
              />
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-2xl border-white/30 bg-white/50 px-4 text-base tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-white/10 dark:bg-black/50"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="group mt-8 h-12 w-full space-x-2 rounded-2xl bg-gradient-to-r from-primary to-rose-400 font-semibold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sistem</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
