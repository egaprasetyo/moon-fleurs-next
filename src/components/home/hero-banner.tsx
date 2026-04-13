"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Container } from "@/components/layout/container";
import { useBanners } from "@/hooks/use-banners";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroBanner() {
  const { data: banners, isLoading } = useBanners();

  if (isLoading) {
    return (
      <section className="relative w-full">
        <Skeleton className="aspect-[21/9] w-full md:aspect-[3/1]" />
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-light via-cream to-sage-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-20 text-center md:py-32"
          >
            <span className="mb-6 text-7xl">🌸</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Rangkaian Bunga untuk{" "}
              <span className="text-primary">Momen Spesial</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Moon Fleurs menyediakan bunga segar berkualitas tinggi, dirangkai
              dengan penuh cinta untuk setiap kesempatan istimewa.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/products">Lihat Koleksi</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <Carousel
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative aspect-[21/9] w-full overflow-hidden md:aspect-[3/1]">
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <Container>
                    <div className="max-w-lg space-y-4">
                      <h2 className="font-heading text-3xl font-bold text-white md:text-5xl lg:text-6xl">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="text-base text-white/80 md:text-lg">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.link_url && (
                        <Button
                          asChild
                          size="lg"
                          className="mt-4 rounded-full px-8"
                        >
                          <Link href={banner.link_url}>Lihat Koleksi</Link>
                        </Button>
                      )}
                    </div>
                  </Container>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4 h-10 w-10 border-0 bg-white/20 text-white backdrop-blur-sm hover:bg-white/40" />
            <CarouselNext className="right-4 h-10 w-10 border-0 bg-white/20 text-white backdrop-blur-sm hover:bg-white/40" />
          </>
        )}
      </Carousel>
    </section>
  );
}
