"use client";

import { Star } from "lucide-react";
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
              <Skeleton key={i} className="h-40 min-w-[300px] rounded-xl" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  // Duplicate reviews for seamless infinite scroll
  const duplicated = [...reviews, ...reviews];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <Container>
        <MotionSection className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Testimoni
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Kata Mereka
          </h2>
        </MotionSection>
      </Container>

      {/* Marquee Row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-marquee gap-4">
          {duplicated.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="min-w-[300px] max-w-[350px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:min-w-[350px]"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s < review.rating
                        ? "fill-gold text-gold"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="mt-3 text-sm leading-relaxed text-foreground line-clamp-3">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {review.reviewer_name}
                  </p>
                  {review.product && (
                    <p className="text-xs text-muted-foreground">
                      {review.product.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
