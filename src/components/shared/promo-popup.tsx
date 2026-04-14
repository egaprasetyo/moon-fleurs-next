"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePopupBanners } from "@/hooks/use-popup-banners";
import type { PopupBanner } from "@/types";

// Hydration-safe mounted check
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Storage helpers
function getDismissKey(id: string) {
  return `popup_dismissed_${id}`;
}

function isDismissed(popup: PopupBanner): boolean {
  if (typeof window === "undefined") return true;

  const key = getDismissKey(popup.id);
  const dismissed = localStorage.getItem(key);

  if (!dismissed) return false;

  if (popup.show_frequency === "always") return false;

  if (popup.show_frequency === "once_session") {
    return sessionStorage.getItem(key) === "1";
  }

  if (popup.show_frequency === "once_day") {
    const dismissedDate = new Date(dismissed).toDateString();
    const today = new Date().toDateString();
    return dismissedDate === today;
  }

  return false;
}

function markDismissed(popup: PopupBanner) {
  const key = getDismissKey(popup.id);
  localStorage.setItem(key, new Date().toISOString());
  if (popup.show_frequency === "once_session") {
    sessionStorage.setItem(key, "1");
  }
}

export function PromoPopup() {
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const { data: popups } = usePopupBanners();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Derive the active popup without setState (avoids cascading render)
  const activePopup = useMemo(() => {
    if (!popups || !isMounted || dismissed) return null;

    return (
      popups.find((p) => {
        const matchesPage = p.target_pages.some(
          (page) => page === pathname || (page === "/" && pathname === "/")
        );
        if (!matchesPage) return false;
        if (isDismissed(p)) return false;
        return true;
      }) || null
    );
  }, [popups, pathname, isMounted, dismissed]);

  // Timer to show popup after delay — setState only in async callback
  useEffect(() => {
    if (!activePopup) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, (activePopup.show_delay || 0) * 1000);

    return () => clearTimeout(timer);
  }, [activePopup]);

  const handleDismiss = () => {
    if (activePopup) {
      markDismissed(activePopup);
    }
    setVisible(false);
    setDismissed(true);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {visible && activePopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleDismiss}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image */}
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={activePopup.image_url}
                  alt={activePopup.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 448px) 100vw, 448px"
                  priority
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold">
                  {activePopup.title}
                </h3>
                {activePopup.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {activePopup.description}
                  </p>
                )}

                <div className="mt-5 flex gap-3">
                  {activePopup.link_url && (
                    <Button
                      asChild
                      className="flex-1 rounded-full shadow-lg shadow-primary/20"
                      onClick={handleDismiss}
                    >
                      <Link href={activePopup.link_url}>
                        {activePopup.button_text || "Lihat Promo"}
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={handleDismiss}
                  >
                    Nanti
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
