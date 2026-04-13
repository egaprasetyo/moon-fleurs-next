import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { MotionSection } from "@/components/shared/motion";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-rose-light/50 to-sage-light/50" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-sage/5 blur-3xl" />

      <Container className="relative">
        <MotionSection variant="scaleIn" className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-5xl">💐</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Siap Memesan Rangkaian Bunga?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hubungi kami via WhatsApp untuk konsultasi dan pemesanan.
            Tim kami siap membantu kamu memilih rangkaian sempurna.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full gap-2 px-8 shadow-lg shadow-primary/25">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Moon%20Fleurs!%20🌸"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                Pesan via WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full gap-2 px-8"
            >
              <Link href="/products">
                Lihat Koleksi
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </MotionSection>
      </Container>
    </section>
  );
}
