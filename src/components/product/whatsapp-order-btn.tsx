"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateWhatsAppUrl, generateOrderMessage } from "@/lib/utils";

interface WhatsAppOrderBtnProps {
  productName: string;
  price: number;
  whatsappNumber: string;
  promoCode?: string;
  className?: string;
}

export function WhatsAppOrderBtn({
  productName,
  price,
  whatsappNumber,
  promoCode,
  className,
}: WhatsAppOrderBtnProps) {
  const handleClick = () => {
    // Track GA4 event
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_order", {
        product_name: productName,
        product_price: price,
      });
    }
  };

  const message = generateOrderMessage(productName, price, promoCode);
  const url = generateWhatsAppUrl(whatsappNumber, message);

  return (
    <Button
      asChild
      size="lg"
      className={`w-full gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 ${className || ""}`}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <MessageCircle className="h-5 w-5" />
        Pesan via WhatsApp
      </a>
    </Button>
  );
}
