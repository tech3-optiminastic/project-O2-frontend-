"use client";

import { ShieldCheck, Gauge, Layers, Lock } from "lucide-react";
import { stats } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/Reveal";
import { FloatingOrb } from "@/components/orb/FloatingOrb";

const reasons = [
  { icon: ShieldCheck, title: "Audit-ready by design", body: "Every action leaves an immutable trail leadership can defend." },
  { icon: Gauge, title: "Reconciled in real time", body: "System truth matched to bank reality, continuously." },
  { icon: Layers, title: "One source of truth", body: "Clients, vendors, invoices and taxes in a single ledger." },
  { icon: Lock, title: "Governed approvals", body: "Nothing leaves the company without CFO and CEO sign-off." },
];

export function WhyChooseUs() {
  return (
    <Section id="why" className="relative overflow-hidden">
      <FloatingOrb size={520} variant="divider" speed={18} opacity={0.4} className="-left-40 top-20" parallax={60} />
      <Container className="relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* Left: statement */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="tracking-eyebrow text-xs text-secondary">02 · Why choose us</span>
            <h2 className="mt-6 text-balance text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              <TextReveal text="Precision you can feel. Control you can prove." />
            </h2>
            <Reveal delay={0.1} className="mt-8 max-w-md text-lg font-light leading-relaxed text-secondary">
              We hold the finance function to the standard of fine design — invisible when it works,
              unmistakable in its quality.
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {reasons.map((r) => (
                <Reveal key={r.title} className="flex flex-col gap-3">
                  <r.icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
                  <h3 className="text-base font-medium">{r.title}</h3>
                  <p className="text-sm font-light text-secondary">{r.body}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: stats */}
          <div className="grid gap-12 sm:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-line pt-8">
                <StatCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals ?? 0}
                  label={s.label}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
