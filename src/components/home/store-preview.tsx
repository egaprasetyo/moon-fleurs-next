"use client";

import Link from "next/link";
import { MapPin, Clock, MessageCircle, ArrowRight, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useStoreInfo } from "@/hooks/use-store-info";
import { Skeleton } from "@/components/ui/skeleton";
import { generateWhatsAppUrl } from "@/lib/utils";

export function StorePreview() {
  const { data: store, isLoading } = useStoreInfo();

  if (isLoading) {
    return (
      <section className="bg-background py-20 md:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Skeleton className="aspect-video w-full rounded-[2rem] shadow-xl" />
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-10 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!store) return null;

  const operatingHours = store.operating_hours || [];

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -left-[10%] top-0 -z-10 h-[500px] w-[500px] rounded-full bg-sage-light/30 blur-[120px] dark:bg-sage-dark/10" />

      <Container>
        <div className="mb-12 text-center md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary"
          >
            LOKASI KAMI
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-heading text-4xl font-extrabold tracking-tight md:text-5xl"
          >
            Kunjungi Showroom Moon Fleurs
          </motion.h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-center">
          {/* Map Container */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group relative aspect-video overflow-hidden rounded-[2.5rem] bg-muted/50 p-2 shadow-2xl ring-1 ring-border/50 md:aspect-[4/3] lg:aspect-[4/3]"
          >
            <div className="absolute inset-0 z-10 pointer-events-none rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
              {store.google_maps_url ? (
                <>
                  <iframe
                    src={store.google_maps_url}
                    className="absolute inset-0 h-full w-full border-0 transition-transform duration-1000 group-hover:scale-[1.02]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Moon Fleurs"
                  />
                  {/* Subtle overlay to soften the brutal map colors until hovered */}
                  <div className="absolute inset-0 bg-primary/5 mix-blend-color transition-opacity duration-500 group-hover:opacity-0" />
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-4 bg-muted/30">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Peta tidak tersedia</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col space-y-10"
          >
            {/* Address */}
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Navigation className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-3xl font-bold">{store.name}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground text-lg">
                  {store.address}
                </p>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Operating hours */}
            {operatingHours.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  Jam Operasional
                </div>
                <div className="space-y-3 pl-3">
                  {operatingHours.map((item, i) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center justify-between border-b border-border/30 pb-3 text-base text-muted-foreground last:border-0 last:pb-0 font-medium"
                    >
                      <span className="text-foreground">{item.day}</span>
                      <span className="rounded-full bg-muted/50 px-3 py-1 text-sm">
                        {item.isClosed ? "Tutup" : `${item.open} – ${item.close}`}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              {store.whatsapp_number && (
                <Button asChild size="lg" className="rounded-full gap-2 px-8 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <a
                    href={generateWhatsAppUrl(
                      store.whatsapp_number,
                      "Halo Moon Fleurs! 🌸 Saya ingin mengunjungi toko."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Hubungi Outlet Kami
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="rounded-full gap-2 px-8 border-2 hover:bg-muted">
                <Link href="/store">
                  Detail Toko
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
