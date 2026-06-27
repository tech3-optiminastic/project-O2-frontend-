"use client";

import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/site";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function Services() {
  return (
    <Section id="services">
      <Container>
        <SectionTitle
          index="01"
          eyebrow="Services"
          title="A complete financial function, quietly engineered"
          description="Six disciplines, one cohesive system — each built to remove friction, not add it."
        />

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Card key={s.slug} className="min-h-[18rem]">
              {/* Per-card orb */}
              <FloatingOrb
                size={150}
                variant="card"
                speed={12 + i}
                opacity={0.85}
                delay={i * 0.4}
                className="-right-10 -top-10 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="text-xs text-ink-40 tabular-nums">0{i + 1}</span>
                <div className="mt-16">
                  <h3 className="flex items-center gap-2 text-2xl font-light tracking-tight">
                    {s.title}
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60" />
                  </h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-secondary">
                    {s.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
