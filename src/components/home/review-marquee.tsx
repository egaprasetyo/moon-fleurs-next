"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { useReviews } from "@/hooks/use-reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionSection } from "@/components/shared/motion";

export function ReviewMarquee() {
  const { data: reviews, isLoading } = useReviews(20);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto h-4 w-32" />
            <Skeleton className="mx-auto mt-3 h-8 w-64" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 min-w-[300px] rounded-2xl" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  // Duplicate reviews to create a seamless infinite scroll
  const duplicated = [...reviews, ...reviews, ...reviews];

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-28">
      {/* Dynamic Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 opacity-50 blur-[100px]" />
      
      <Container>
        <MotionSection className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary"
          >
            TESTIMONI
          </motion.div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            Cerita Manis Pelanggan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
            Terima kasih telah mempercayakan momen spesial Anda bersama Moon Fleurs.
          </p>
        </MotionSection>
      </Container>

      {/* Marquee Row */}
      <div 
        className="relative mt-8 flex w-full flex-col items-center justify-center overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused] px-4">
          {duplicated.map((review, i) => (
            <motion.div
              key={`${review.id}-${i}`}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative flex w-[320px] shrink-0 flex-col justify-between rounded-3xl border border-border/50 bg-background/60 p-6 shadow-xl shadow-black/5 backdrop-blur-md md:w-[400px]"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />
              
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 md:h-5 md:w-5 ${
                        s < review.rating
                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-5 text-sm font-medium leading-relaxed text-foreground/90 md:text-base line-clamp-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer */}
              <div className="relative z-10 mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-rose-400 font-heading text-lg font-bold text-white shadow-inner">
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-bold text-foreground">
                    {review.reviewer_name}
                  </p>
                  {review.product && (
                    <p className="text-xs font-medium text-muted-foreground/80">
                      Membeli <span className="text-primary/80">{review.product.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
