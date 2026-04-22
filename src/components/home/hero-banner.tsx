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
      <section className="relative w-full pt-28 pb-8 md:pt-32 md:pb-12">
        <Container>
          <Skeleton className="aspect-[4/3] w-full rounded-[2rem] md:aspect-[21/9] lg:aspect-[2.5/1] md:rounded-[3rem]" />
        </Container>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <section className="relative w-full pt-28 pb-8 md:pt-32 md:pb-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-rose-light/40 via-background to-sage-light/40 py-20 text-center shadow-2xl ring-1 ring-border/50 md:py-32"
          >
            <motion.span
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 text-7xl drop-shadow-md md:text-8xl"
            >
              🌸
            </motion.span>
            <h1 className="max-w-4xl px-4 font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Bunga Segar & Artificial untuk{" "}
              <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                Momen Spesial
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl px-4 text-base text-muted-foreground md:text-xl md:leading-relaxed">
              Moon Fleurs menyediakan bunga segar pilihan dan artificial flowers premium, dirangkai
              dengan penuh cinta untuk setiap kesempatan istimewa Anda — natural dan wangi, atau indah dan tahan lama.
            </p>
            <div className="mt-10 flex gap-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                <Link href="/products">Lihat Koleksi</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative w-full pt-28 pb-8 md:pt-32 md:pb-12">
      {/* Ambient background glow matching the elegant theme */}
      <div className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[400px] w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Carousel
            opts={{ loop: true }}
            className="group w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border/30 md:rounded-[3rem]"
          >
            <CarouselContent>
              {banners.map((banner, index) => (
                <CarouselItem key={banner.id}>
                  <div className="relative flex aspect-[4/3] w-full items-end overflow-hidden md:aspect-[21/9] lg:aspect-[2.5/1]">
                    {/* Background Image with slight zoom effect */}
                    <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                      <Image
                        src={banner.image_url}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                      />
                    </div>

                    {/* Modern Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />

                    {/* Content Area */}
                    <div className="relative z-10 w-full p-8 md:flex md:h-full md:items-center md:p-16 lg:p-24">
                      <div className="max-w-2xl space-y-4 md:space-y-6">
                        <motion.h2
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.7 }}
                          className="font-heading text-3xl font-bold leading-tight text-white drop-shadow-md md:text-5xl lg:text-7xl"
                        >
                          {banner.title}
                        </motion.h2>

                        {banner.subtitle && (
                          <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                            className="text-base text-white/90 drop-shadow md:text-xl"
                          >
                            {banner.subtitle}
                          </motion.p>
                        )}

                        {banner.link_url && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.7 }}
                          >
                            <Button
                              asChild
                              size="lg"
                              className="mt-4 rounded-full bg-white/10 px-8 text-white backdrop-blur-md outline outline-1 outline-white/30 transition-all hover:bg-white hover:text-black hover:outline-white hover:scale-105 md:mt-2"
                            >
                              <Link href={banner.link_url}>Eksplorasi Sekarang</Link>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {banners.length > 1 && (
              <>
                <CarouselPrevious className="left-4 h-12 w-12 border border-white/20 bg-black/20 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-white hover:text-black md:left-8" />
                <CarouselNext className="right-4 h-12 w-12 border border-white/20 bg-black/20 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-white hover:text-black md:right-8" />
              </>
            )}
          </Carousel>
        </motion.div>
      </Container>
    </section>
  );
}
