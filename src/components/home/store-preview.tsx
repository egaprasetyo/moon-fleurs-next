"use client";

import Link from "next/link";
import { MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useStoreInfo } from "@/hooks/use-store-info";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionSection } from "@/components/shared/motion";
import { generateWhatsAppUrl } from "@/lib/utils";

export function StorePreview() {
  const { data: store, isLoading } = useStoreInfo();

  if (isLoading) {
    return (
      <section className="bg-muted/40 py-16 md:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!store) return null;

  const operatingHours = store.operating_hours || {};

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <Container>
        <MotionSection className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Kunjungi Kami
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Lokasi Toko
          </h2>
        </MotionSection>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map */}
          <MotionSection variant="fadeInLeft" className="aspect-video overflow-hidden rounded-2xl border border-border shadow-sm">
            {store.google_maps_url ? (
              <iframe
                src={store.google_maps_url}
                className="h-full w-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Moon Fleurs"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <MapPin className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </MotionSection>

          {/* Info */}
          <MotionSection variant="fadeInRight" className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="font-heading text-2xl font-bold">{store.name}</h3>
              <div className="mt-3 flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm">{store.address}</p>
              </div>
            </div>

            {/* Operating hours */}
            {Object.keys(operatingHours).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Jam Operasional
                </div>
                <div className="ml-6 space-y-1">
                  {Object.entries(operatingHours).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex justify-between text-sm text-muted-foreground"
                    >
                      <span>{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {store.whatsapp_number && (
                <Button asChild className="rounded-full gap-2">
                  <a
                    href={generateWhatsAppUrl(
                      store.whatsapp_number,
                      "Halo Moon Fleurs! 🌸 Saya ingin bertanya."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="rounded-full gap-2">
                <Link href="/store">
                  Detail Toko
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </MotionSection>
        </div>
      </Container>
    </section>
  );
}
