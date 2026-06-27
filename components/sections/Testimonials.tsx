"use client";

import { testimonials } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GlassCard } from "@/components/ui/Card";
import { FloatingOrb } from "@/components/orb/FloatingOrb";

export function Testimonials() {
  return (
    <Section id="testimonials" className="relative overflow-hidden">
      <FloatingOrb size={500} variant="divider" speed={19} opacity={0.4} className="-left-40 top-1/4" parallax={50} />
      <Container className="relative z-10">
        <SectionTitle
          index="06"
          eyebrow="Testimonials"
          title="The people who hold the numbers"
          align="center"
          className="mx-auto items-center"
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <GlassCard key={t.name} className="flex flex-col justify-between">
              {/* Circular accent */}
              <div className="relative mb-8 h-10 w-10">
                <FloatingOrb size={40} variant="card" speed={10 + i} className="!relative inset-0" delay={i * 0.3} />
              </div>
              <p className="text-lg font-light leading-relaxed tracking-tight text-foreground">
                “{t.quote}”
              </p>
              <div className="mt-8 border-t border-line/60 pt-5">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-secondary">{t.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
