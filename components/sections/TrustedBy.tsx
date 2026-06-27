"use client";

import { Marquee } from "@/components/ui/Marquee";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const companies = [
  "NORTHWIND",
  "VERTEX",
  "HALO",
  "MERIDIAN",
  "AXIOM",
  "LUMEN",
  "OBSIDIAN",
  "QUANTA",
];

export function TrustedBy() {
  return (
    <Section className="py-20">
      <Container>
        <Reveal className="mb-12 text-center">
          <span className="tracking-eyebrow text-xs text-ink-40">
            Trusted by finance teams at modern businesses
          </span>
        </Reveal>
      </Container>
      <Marquee speed={36}>
        {companies.map((c) => (
          <span
            key={c}
            className="select-none text-2xl font-light tracking-[0.2em] text-ink-40 transition-colors duration-500 hover:text-foreground"
          >
            {c}
          </span>
        ))}
      </Marquee>
    </Section>
  );
}
