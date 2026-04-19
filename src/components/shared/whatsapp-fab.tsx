"use client";

import { MessageCircle } from "lucide-react";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useStoreInfo } from "@/hooks/use-store-info";
import { generateWhatsAppUrl } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function WhatsAppFab() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { data: store } = useStoreInfo();

  if (!mounted || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const whatsappNumber = store?.whatsapp_number;
  if (!whatsappNumber) return null;

  const message =
    "Halo Moon Fleurs! 🌸\nSaya ingin bertanya tentang produk bunga segar dan artificial.";

  return (
    <a
      href={generateWhatsAppUrl(whatsappNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse-ring" />

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
        <MessageCircle className="h-6 w-6" />
      </span>
    </a>
  );
}
