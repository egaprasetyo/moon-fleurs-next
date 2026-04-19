"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useStoreInfo } from "@/hooks/use-store-info";
import { generateWhatsAppUrl } from "@/lib/utils";

export function CtaSection() {
  const { data: store } = useStoreInfo();
  const whatsappNumber = store?.whatsapp_number;
  const whatsappUrl = whatsappNumber
    ? generateWhatsAppUrl(whatsappNumber, "Halo Moon Fleurs! 🌸")
    : null;

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-sage-light/40 blur-[130px] dark:bg-sage-dark/20" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/40 bg-white/40 p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-black/40 md:p-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-transparent shadow-inner ring-1 ring-primary/20"
            >
              <span className="text-5xl drop-shadow-md">💐</span>
            </motion.div>

            <h2 className="max-w-2xl font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Ready to Preserve a Moment?
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Let&apos;s create something beautiful together. Our team is ready to craft a custom arrangement that perfectly captures your vision and emotion.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {whatsappUrl && (
                <Button
                  asChild
                  size="lg"
                  className="group relative h-14 overflow-hidden rounded-full px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-semibold">Start Your Order</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  </a>
                </Button>
              )}

              <Button
                asChild
                variant="outline"
                size="lg"
                className="group h-14 rounded-full border-2 border-primary/20 bg-transparent px-8 text-base font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 text-primary"
              >
                <Link href="/products" className="flex items-center gap-2">
                  <span>Explore Collections</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
