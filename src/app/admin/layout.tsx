"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ImageIcon,
  Star,
  Ticket,
  MapPin,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/products", icon: Package },
  { label: "Kategori", href: "/admin/categories", icon: Tags },
  { label: "Banner", href: "/admin/banners", icon: ImageIcon },
  { label: "Review", href: "/admin/reviews", icon: Star },
  { label: "Promo", href: "/admin/promos", icon: Ticket },
  { label: "Info Toko", href: "/admin/store", icon: MapPin },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout");
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-card via-card/90 to-card/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <span className="text-2xl drop-shadow-sm">🌸</span>
        <span className="font-heading text-lg font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Moon Fleurs
        </span>
        <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary shadow-inner">
          ADMIN
        </span>
      </div>

      <Separator className="opacity-50" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col justify-start gap-1 p-4 overflow-y-auto">
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
          Menu Utama
        </div>
        {ADMIN_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                isActive ? "bg-primary/20 text-primary" : "bg-transparent text-muted-foreground group-hover:bg-background group-hover:text-foreground group-hover:shadow-sm"
              )}>
                <Icon className={cn("h-4 w-4 transition-transform", isActive ? "scale-110" : "")} />
              </div>
              <span className="tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-4 space-y-2 bg-muted/10">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-muted/80 hover:text-foreground"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-sm transition-transform group-hover:-translate-x-1">
            <ChevronLeft className="h-4 w-4" />
          </div>
          Kembali ke Website
        </Link>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-all duration-300 hover:bg-destructive/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 transition-transform group-hover:scale-110">
            <LogOut className="h-4 w-4" />
          </div>
          Keluar Sistem
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20 selection:bg-primary/20">
      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 border-r border-border/40 shadow-sm md:block z-20">
        <div className="sticky top-0 h-screen overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/40 bg-card/80 backdrop-blur-md px-4 shadow-sm md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 hover:bg-muted/80">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:w-[320px] p-0 border-r-0 shadow-2xl">
              <VisuallyHidden>
                <SheetTitle>Menu Admin</SheetTitle>
              </VisuallyHidden>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl">🌸</span>
            <span className="font-heading text-lg font-bold truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Admin
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
