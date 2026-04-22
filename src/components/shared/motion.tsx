"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Fade in from bottom (default page/section animation)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Fade in from left
const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

// Fade in from right
const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

// Scale in
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// Stagger container
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Stagger item
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer, staggerItem };

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn";
}

const variantsMap = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
};

export function MotionSection({
  children,
  className,
  delay = 0,
  variant = "fadeInUp",
}: MotionSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variantsMap[variant]}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerItem}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
