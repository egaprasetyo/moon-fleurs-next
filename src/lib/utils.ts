import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp order message for a product
 */
export function generateOrderMessage(
  productName: string,
  price: number,
  promoCode?: string
): string {
  let message = `Halo Moon Fleurs! 🌸\n\nSaya tertarik dengan produk:\n*${productName}*\nHarga: ${formatPrice(price)}`;
  if (promoCode) {
    message += `\n\nKode Promo: *${promoCode}*`;
  }
  message += `\n\nApakah produk ini tersedia?`;
  return message;
}
