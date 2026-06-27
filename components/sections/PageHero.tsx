"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Container } from "@/components/ui/Section";
import { stagger, fadeUp, lineReveal } from "@/lib/motion";

/** Consistent editorial hero for inner pages — eyebrow, big title, lede, orb. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden pb-12 pt-40 md:pt-52">
      <FloatingOrb
        size="min(40vw, 520px)"
        variant="hero"
        speed={18}
        parallax={60}
        opacity={0.85}
        className="right-[-8vw] top-[18vh]"
      />
      <Container className="relative z-10">
        <motion.div variants={stagger(0.1)} initial="hidden" animate="show" className="max-w-4xl">
          <motion.span variants={fadeUp} className="tracking-eyebrow text-xs text-secondary">
            {eyebrow}
          </motion.span>
          <h1 className="mt-8 text-balance text-5xl font-extralight leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            {title.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span variants={lineReveal} className="inline-block">
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          {lede && (
            <motion.p
              variants={fadeUp}
              className="mt-10 max-w-xl text-balance text-lg font-light leading-relaxed text-secondary"
            >
              {lede}
            </motion.p>
          )}
          {children && (
            <motion.div variants={fadeUp} className="mt-10">
              {children}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
