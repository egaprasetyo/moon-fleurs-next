import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturesSection } from "@/components/home/features-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ReviewMarquee } from "@/components/home/review-marquee";
import { StorePreview } from "@/components/home/store-preview";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Moon Fleurs - Artificial Flowers Premium",
  description:
    "Moon Fleurs menghadirkan bunga artificial premium yang realistis, elegan, dan tahan lama untuk momen spesial Anda.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <ReviewMarquee />
      <StorePreview />
      <CtaSection />
    </>
  );
}
