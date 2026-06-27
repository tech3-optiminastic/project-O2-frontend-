"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, blurReveal, lineReveal, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "blur";
}

/** Scroll-triggered entrance. Fade-up by default, blur reveal optional. */
export function Reveal({ children, className, delay = 0, variant = "fade" }: RevealProps) {
  const variants: Variants = variant === "blur" ? blurReveal : fadeUp;
  return (
    <motion.div
      className={cn("will-reveal", className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children should be <Reveal> or motion items. */
export function RevealGroup({
  children,
  className,
  gap = 0.09,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger(gap, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

/**
 * TextReveal — splits text into lines/words that rise out of a mask.
 * Pass a string; words animate up on scroll into view.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={cn("inline", className)}
      variants={stagger(0.045, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span className={cn("inline-block", wordClassName)} variants={lineReveal}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
