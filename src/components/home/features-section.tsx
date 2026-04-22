"use client";

import { motion } from "framer-motion";
import { Sparkles, Flower2, Infinity, Gift } from "lucide-react";
import { MotionSection, MotionItem } from "@/components/shared/motion";
import { Container } from "@/components/layout/container";

const features = [
  {
    title: "Bunga Segar Berkualitas",
    description:
      "Bunga segar pilihan dengan tampilan natural dan aroma yang memikat — sempurna untuk hadiah, ucapan, dan perayaan yang ingin terasa hidup.",
    icon: Flower2,
    gradient: "from-emerald-400/20 via-emerald-300/10 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "group-hover:shadow-emerald-500/10",
  },
  {
    title: "Artificial Premium & Abadi",
    description:
      "Bunga tiruan berkualitas tinggi yang realistis dan tahan lama — indah tanpa khawatir layu, ideal untuk dekorasi dan kenangan yang bertahan.",
    icon: Infinity,
    gradient: "from-amber-400/20 via-amber-300/10 to-transparent",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "group-hover:shadow-amber-500/10",
  },
  {
    title: "Detail & Material Terbaik",
    description:
      "Setiap rangkaian dibuat dengan teliti: mulai dari seleksi bunga segar hingga material silk/silikon premium untuk artificial yang halus dan elegan.",
    icon: Sparkles,
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accent: "group-hover:shadow-primary/10",
  },
  {
    title: "Sempurna untuk Segala Acara",
    description:
      "Dari buket romantis dan wisuda hingga dekorasi rumah, kantor, atau event — kami sesuaikan dengan momen dan gaya Anda.",
    icon: Gift,
    gradient: "from-rose-400/20 via-rose-300/10 to-transparent",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    accent: "group-hover:shadow-rose-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-[400px] w-[400px] rounded-full bg-sage/8 blur-[120px]" />

      <Container>
        {/* Section Header */}
        <MotionSection className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Kenapa Memilih Kami?
          </motion.div>
          <h2 className="mx-auto max-w-3xl font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Segar, Abadi, dan{" "}
            <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
              Penuh Makna
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Pilih bunga segar untuk sentuhan natural dan aroma yang memikat, atau
            artificial premium untuk keindahan yang praktis dan tahan lama —
            semuanya dirangkai untuk momen Anda.
          </p>
        </MotionSection>

        {/* Bento Grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-20 md:gap-5">
          {features.map((feature, idx) => (
            <MotionItem key={idx}>
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/50 bg-card/80 p-7 shadow-sm backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 ${feature.accent} md:p-8`}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/* Top row: number + icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-heading text-4xl font-black text-border/70 transition-colors duration-300 group-hover:text-border dark:text-border/40 md:text-5xl">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor} ring-1 ring-black/[0.04] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg md:h-14 md:w-14`}
                  >
                    <feature.icon
                      className="h-6 w-6 md:h-7 md:w-7"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-8 flex flex-1 flex-col">
                  <h3 className="font-heading text-lg font-bold tracking-tight text-foreground md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom decorative line */}
                <div className="relative z-10 mt-6">
                  <div className="h-px w-full bg-gradient-to-r from-border/60 via-border/30 to-transparent" />
                  <div className="mt-3 flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${feature.iconBg} ${feature.iconColor} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <div
                      className={`h-1.5 w-6 rounded-full ${feature.iconBg} opacity-40 transition-all duration-500 group-hover:w-10 group-hover:opacity-70`}
                    />
                  </div>
                </div>
              </div>
            </MotionItem>
          ))}
        </div>
      </Container>
    </section>
  );
}
