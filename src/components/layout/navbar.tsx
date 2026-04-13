"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isScrolled ? "pt-4 px-4 md:px-8" : "pt-0 px-0"
        )}
      >
        <div
          className={cn(
            "mx-auto transition-all duration-500 ease-in-out",
            isScrolled
              ? "max-w-7xl rounded-full bg-background/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] supports-[backdrop-filter]:bg-background/40"
              : "w-full bg-transparent border-transparent"
          )}
        >
          <Container className={cn("transition-all duration-500", isScrolled ? "px-6 md:px-8" : "")}>
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-500",
                isScrolled ? "h-16" : "h-20 md:h-24"
              )}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <motion.span 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-2xl"
                >
                  🌸
                </motion.span>
                <span className="font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors md:text-2xl">
                  Moon Fleurs
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center justify-center gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 rounded-full bg-primary/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background"
                      >
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:hidden active:scale-95"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Spacer to prevent content overlap on non-home pages where we don't want the transparent bleed effect */}
      {pathname !== "/" && <div className="h-20 md:h-24 w-full shrink-0" />}

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
