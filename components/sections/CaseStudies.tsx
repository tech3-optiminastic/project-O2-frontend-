"use client";

import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { FloatingOrb } from "@/components/orb/FloatingOrb";

export function CaseStudies() {
  return (
    <Section id="work">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionTitle index="05" eyebrow="Case studies" title="Quiet work, loud results" />
          <p className="max-w-sm text-sm font-light text-secondary md:text-right">
            Selected engagements where financial clarity changed the trajectory of a business.
          </p>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Card key={c.title} className="flex min-h-[26rem] flex-col justify-between p-0">
              {/* Editorial image area — abstract orb composition */}
              <div className="relative h-56 overflow-hidden rounded-t-3xl bg-mist">
                <FloatingOrb
                  size={260}
                  variant="card"
                  speed={14 + i}
                  delay={i * 0.5}
                  className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-5 top-5 z-10 rounded-full border border-line bg-white/70 px-3 py-1 text-xs text-secondary backdrop-blur">
                  {c.sector}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <p className="text-3xl font-extralight tracking-tight">{c.metric}</p>
                  <h3 className="mt-4 flex items-start gap-2 text-xl font-light leading-snug tracking-tight">
                    {c.title}
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
                  </h3>
                </div>
                <p className="mt-6 text-sm font-light leading-relaxed text-secondary">{c.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
