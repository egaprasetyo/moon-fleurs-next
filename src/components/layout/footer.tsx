import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { Container } from "./container";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { OperatingHour, SocialLink, SocialPlatform } from "@/types";

const SOCIAL_ICONS: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  facebook: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  tiktok: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  ),
  twitter: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  youtube: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ),
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  twitter: "X",
  youtube: "YouTube",
};

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const supabase = await createClient();
  const { data: store } = await supabase.from("store_info").select("address, phone, whatsapp_number, operating_hours, social_links").single();

  const address = store?.address || "Jl. Bunga Mawar No. 123, Jakarta Selatan";
  const phone = store?.phone || store?.whatsapp_number || "(021) 1234-5678";
  const socialLinks: SocialLink[] = Array.isArray(store?.social_links) ? (store.social_links as SocialLink[]) : [];
  
  let hoursText = "Sen-Sab 08:00-20:00";
  if (store?.operating_hours && Array.isArray(store.operating_hours)) {
    const openDays = store.operating_hours.filter((h: OperatingHour) => !h.isClosed && h.open && h.close);
    if (openDays.length > 0) {
      hoursText = `${openDays.length === 7 ? "Setiap Hari" : "Buka:"} ${openDays[0].open} - ${openDays[0].close}`;
    }
  }

  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="font-heading text-xl font-bold text-background">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-background/60">
              Rangkaian bunga segar dan elegan untuk berbagai momen spesial.
              Dibuat dengan cinta, diantar dengan senyuman.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-background">
              Menu
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Produk", href: "/products" },
                { label: "Lokasi Toko", href: "/store" },
                { label: "Wishlist", href: "/wishlist" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-background">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-background/60">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-background/60">
                  {phone}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-background/60">
                  {hoursText}
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          {socialLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-background">
                Ikuti Kami
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={PLATFORM_LABELS[link.platform]}
                  >
                    {SOCIAL_ICONS[link.platform]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-background/10 py-6">
          <p className="text-center text-xs text-background/40">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

