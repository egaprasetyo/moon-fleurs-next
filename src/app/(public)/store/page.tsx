"use client";

import Image from "next/image";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useStoreInfo } from "@/hooks/use-store-info";
import { generateWhatsAppUrl } from "@/lib/utils";

export default function StorePage() {
  const { data: store, isLoading } = useStoreInfo();

  if (isLoading) {
    return (
      <section className="py-8">
        <Container>
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!store) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center">
            <span className="text-5xl">🏪</span>
            <h1 className="mt-4 font-heading text-2xl font-bold">
              Informasi toko belum tersedia
            </h1>
          </div>
        </Container>
      </section>
    );
  }

  const operatingHours = store.operating_hours || [];
  const storeImages = store.images || [];

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-8">
        <Container>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            Lokasi Toko
          </h1>
          <p className="mt-2 text-muted-foreground">
            Kunjungi toko kami langsung
          </p>
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Map — takes 3 cols */}
            <div className="lg:col-span-3">
              <div className="aspect-video overflow-hidden rounded-2xl border border-border shadow-sm lg:aspect-[4/3]">
                {store.google_maps_url ? (
                  <iframe
                    src={store.google_maps_url}
                    className="h-full w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Lokasi ${store.name}`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <MapPin className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Info — takes 2 cols */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-heading text-xl font-bold">{store.name}</h2>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>

                  {store.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-primary" />
                      <a href={`tel:${store.phone}`} className="text-sm text-muted-foreground hover:text-foreground">
                        {store.phone}
                      </a>
                    </div>
                  )}

                  <Separator />

                  {/* Operating hours */}
                  {operatingHours.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <Clock className="h-5 w-5 text-primary" />
                        Jam Operasional
                      </div>
                      <div className="space-y-2 pl-7">
                        {operatingHours.map((item) => (
                          <div
                            key={item.day}
                            className="flex justify-between text-sm text-muted-foreground"
                          >
                            <span>{item.day}</span>
                            <span className="font-medium">
                              {item.isClosed ? "Tutup" : `${item.open} – ${item.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* WhatsApp CTA */}
                  {store.whatsapp_number && (
                    <Button asChild className="w-full gap-2 rounded-full">
                      <a
                        href={generateWhatsAppUrl(
                          store.whatsapp_number,
                          "Halo Moon Fleurs! 🌸 Saya ingin bertanya."
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Hubungi via WhatsApp
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {storeImages.length > 0 && (
        <section className="pb-12 md:pb-16">
          <Container>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">Galeri Toko</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Beberapa foto suasana toko Moon Fleurs
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {storeImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-border"
                >
                  <Image
                    src={imageUrl}
                    alt={`Galeri toko ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
