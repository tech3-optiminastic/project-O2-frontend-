"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift + shadow on hover. */
  interactive?: boolean;
  reveal?: boolean;
}

/** Base surface card — hairline border, warm panel, soft hover lift. */
export function Card({ children, className, interactive = true, reveal = true }: CardProps) {
  return (
    <motion.div
      variants={reveal ? fadeUp : undefined}
      initial={reveal ? "hidden" : undefined}
      whileInView={reveal ? "show" : undefined}
      viewport={viewportOnce}
      whileHover={interactive ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-line bg-white/60 p-8",
        interactive &&
          "transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(17,17,17,0.25)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/** Glassmorphism card — frosted, for floating dashboard / testimonial surfaces. */
export function GlassCard({ children, className, interactive = true, reveal = true }: CardProps) {
  return (
    <motion.div
      variants={reveal ? fadeUp : undefined}
      initial={reveal ? "hidden" : undefined}
      whileInView={reveal ? "show" : undefined}
      viewport={viewportOnce}
      whileHover={interactive ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={cn("glass relative overflow-hidden rounded-3xl p-8", className)}
    >
      {children}
    </motion.div>
  );
}
