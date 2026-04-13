"use client";

import { MessageCircle } from "lucide-react";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function WhatsAppFab() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Hide on admin pages or during SSR
  if (!mounted || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  // TODO: Get WhatsApp number from store_info via API/context
  const whatsappNumber = "6281234567890";
  const message = encodeURIComponent(
    "Halo Moon Fleurs! 🌸\nSaya ingin bertanya tentang produk bunga."
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse-ring" />

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
        <MessageCircle className="h-6 w-6" />
      </span>
    </a>
  );
}
