"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { useWishlistStore } from "@/stores/wishlist-store";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-lg">
              <span className="mr-2">🌸</span>
              Moon Fleurs
            </SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex flex-col py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="px-6 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Wishlist link */}
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center justify-between px-6 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </span>
            {wishlistCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-6">
          <p className="text-sm text-muted-foreground text-center">
            Pesan bunga segar atau artificial untuk momen spesialmu 🌸
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
