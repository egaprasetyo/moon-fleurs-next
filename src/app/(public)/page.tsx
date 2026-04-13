import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ReviewMarquee } from "@/components/home/review-marquee";
import { StorePreview } from "@/components/home/store-preview";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <CategoryShowcase />
      <ReviewMarquee />
      <StorePreview />
      <CtaSection />
    </>
  );
}
