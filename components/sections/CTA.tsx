"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Section";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Button } from "@/components/ui/Button";
import { TextReveal, Reveal } from "@/components/ui/Reveal";

export function CTA() {
  return (
    <Section id="cta" className="grain relative overflow-hidden">
      {/* Huge floating orb */}
      <FloatingOrb
        size="min(70vw, 760px)"
        variant="cta"
        speed={18}
        interactive
        parallax={70}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        opacity={0.9}
      />

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal>
            <span className="tracking-eyebrow text-xs text-secondary">Get started</span>
          </Reveal>
          <h2 className="mt-8 text-balance text-5xl font-extralight leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            <TextReveal text="Let's Build Financial Confidence Together" />
          </h2>
          <Reveal delay={0.15} className="mt-8 max-w-lg text-lg font-light leading-relaxed text-secondary">
            One platform for onboarding, invoicing, approvals and reconciliation — designed to feel
            as considered as the decisions it supports.
          </Reveal>
          <Reveal delay={0.25} className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact" data-cursor="Let's talk">
                Schedule Demo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="glass">
              <Link href="/portal/login">Enter Client Portal</Link>
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
