"use client";

import { motion } from "framer-motion";
import { Sparkles, Flower2, Infinity, Gift } from "lucide-react";
import { MotionSection, MotionStagger, MotionItem } from "@/components/shared/motion";
import { Container } from "@/components/layout/container";

const features = [
  {
    title: "Bunga Segar Berkualitas",
    description:
      "Bunga segar pilihan dengan tampilan natural dan aroma yang memikat — sempurna untuk hadiah, ucapan, dan perayaan yang ingin terasa hidup.",
    icon: Flower2,
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Artificial Premium & Abadi",
    description:
      "Bunga tiruan berkualitas tinggi yang realistis dan tahan lama — indah tanpa khawatir layu, ideal untuk dekorasi dan kenangan yang bertahan.",
    icon: Infinity,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    title: "Detail & Material Terbaik",
    description:
      "Setiap rangkaian dibuat dengan teliti: mulai dari seleksi bunga segar hingga material silk/silikon premium untuk artificial yang halus dan elegan.",
    icon: Sparkles,
    color:
      "bg-primary/20 text-primary dark:bg-primary/20 dark:text-primary-foreground",
  },
  {
    title: "Sempurna untuk Segala Acara",
    description:
      "Dari buket romantis dan wisuda hingga dekorasi rumah, kantor, atau event — kami sesuaikan dengan momen dan gaya Anda.",
    icon: Gift,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 md:py-32">
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 opacity-50 blur-[120px]">
        <div className="h-[400px] w-[400px] rounded-full bg-primary/20 dark:bg-primary/10" />
      </div>

      <Container>
        <MotionSection className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Kenapa Memilih Kami?
          </motion.div>
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Segar, Abadi, dan{" "}
            <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
              Penuh Makna
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Pilih bunga segar untuk sentuhan natural dan aroma yang memikat, atau artificial premium untuk keindahan yang praktis dan tahan lama — semuanya dirangkai untuk momen Anda.
          </p>
        </MotionSection>

        <MotionStagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <MotionItem key={idx} className="group relative h-full">
              <div className="flex h-full flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 dark:border-border/50">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100 dark:from-primary/10" />
              </div>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
