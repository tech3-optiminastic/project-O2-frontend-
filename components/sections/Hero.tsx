"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, FileText, Lock } from "lucide-react";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { fadeUp } from "@/lib/motion";

/** Small inline metallic orb that sits within the headline text. */
function InlineOrb() {
  return (
    <motion.span
      aria-hidden
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-1 inline-block h-[0.78em] w-[0.78em] translate-y-[0.06em] rounded-full align-baseline"
    >
      <span className="metallic absolute inset-0 rounded-full shadow-[0_10px_24px_-10px_rgba(17,17,17,0.5)]" />
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(60%_45%_at_32%_22%,rgba(255,255,255,0.95),transparent_60%)]" />
      <span className="absolute inset-[18%] rounded-full border border-white/50" />
    </motion.span>
  );
}

/** Inline glass "status" card embedded mid-paragraph. */
function InlineCard() {
  return (
    <span className="glass mx-2 inline-flex translate-y-1 items-center gap-3 rounded-2xl px-3.5 py-2 align-middle text-foreground shadow-[0_18px_40px_-26px_rgba(17,17,17,0.4)]">
      <FileText className="h-4 w-4 text-ink-40" strokeWidth={1.6} />
      <span className="text-left leading-tight">
        <span className="block text-[0.42em] tracking-eyebrow text-ink-40">Invoice 2048</span>
        <span className="block text-[0.5em] font-medium">Northwind Capital</span>
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-2 py-1 text-[0.4em] font-medium text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> Reconciled
      </span>
    </span>
  );
}

/** Inline file pill. */
function InlineFile() {
  return (
    <span className="mx-2 inline-flex translate-y-0.5 items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 align-middle text-[0.5em] font-medium text-secondary shadow-[0_10px_24px_-18px_rgba(17,17,17,0.4)]">
      <Lock className="h-3 w-3" /> report_Q3.pdf
    </span>
  );
}

/** Inline mini ring gauge widget (the score chip). */
function InlineRing() {
  return (
    <span className="glass mx-2 inline-flex translate-y-1 items-center gap-2.5 rounded-2xl px-3 py-2 align-middle shadow-[0_18px_40px_-26px_rgba(17,17,17,0.4)]">
      <span className="relative inline-flex h-[1.4em] w-[1.4em] items-center justify-center">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(17,17,17,0.08)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="6" />
        </svg>
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[0.5em] font-semibold">99.9%</span>
        <span className="block text-[0.36em] tracking-eyebrow text-ink-40">reconciled</span>
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-12">
      {/* Background orbs */}
      <FloatingOrb size="min(30vw, 420px)" variant="hero" speed={18} interactive parallax={70} className="right-[-4vw] top-[12vh]" opacity={0.5} />
      <FloatingOrb size={170} variant="ambient" speed={13} opacity={0.35} className="left-[4vw] bottom-[6vh]" parallax={40} delay={1} />

      <Container className="relative z-10">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="tracking-eyebrow mb-[clamp(1rem,2.5vh,1.75rem)] inline-flex items-center gap-2 text-xs text-secondary">
            <span className="metallic h-2 w-2 rounded-full" /> Optiminastic · Project O2
          </span>
        </motion.div>

        {/* Bold, tight headline with inline orb */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl font-sans font-bold leading-[0.95] tracking-[-0.045em]"
          style={{ fontSize: "clamp(2.2rem, min(5.4vw, 9vh), 5rem)" }}
        >
          Financial intelligence
          <InlineOrb /> for modern business.
        </motion.h1>

        {/* Faded paragraph with inline floating objects — sized to the viewport */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="mt-[clamp(1rem,3vh,2rem)] max-w-5xl font-sans font-semibold leading-[1.18] tracking-[-0.03em] text-foreground/[0.16]"
          style={{ fontSize: "clamp(1.1rem, min(2.7vw, 3.3vh), 2.25rem)" }}
        >
          Project O2 is a platform that can <InlineCard /> gather strategic insight, automate{" "}
          <InlineFile /> tax, invoicing and CFO&nbsp;→&nbsp;CEO approvals, and help your finance team{" "}
          <InlineRing /> adapt to an ever-changing market.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-[clamp(1.5rem,4vh,3rem)] flex flex-wrap items-center gap-4"
        >
          <Button asChild size="lg">
            <Link href="/contact" data-cursor="Demo">
              Schedule Demo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Link
            href="/solutions"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <span className="border-b border-foreground/30 pb-0.5 transition-colors group-hover:border-foreground">
              Explore platform
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
