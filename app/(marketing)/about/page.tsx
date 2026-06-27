import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingOrb } from "@/components/orb/FloatingOrb";

export const metadata: Metadata = {
  title: "About",
  description:
    "Optiminastic builds calm, audit-ready financial systems for modern businesses — finance held to the standard of fine design.",
};

const values = [
  { title: "Minimal over decorative", body: "We remove until only the essential remains. Restraint is a feature." },
  { title: "Proof over promise", body: "Every claim a business makes about its money should be defensible." },
  { title: "Calm over urgent", body: "Good finance feels quiet. We engineer for stillness, not alarm." },
  { title: "One system", body: "Marketing site to dashboard — a single design language, end to end." },
];

const milestones = [
  { value: 18, suffix: " yrs", label: "Of compounding expertise" },
  { value: 340, suffix: "+", label: "Businesses served" },
  { value: 4, label: "Continents reconciled" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Finance, held to the standard of design"
        lede="We are Optiminastic — a team that believes the financial backbone of a business deserves the same care as its most beautiful product."
      />

      <Section className="pt-0">
        <Container>
          <div className="grid gap-12 border-t border-line pt-16 sm:grid-cols-3">
            {milestones.map((m) => (
              <StatCounter key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-mist/40">
        <FloatingOrb size={460} variant="divider" speed={18} opacity={0.4} className="-right-32 top-10" parallax={50} />
        <Container className="relative z-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
            <SectionTitle eyebrow="Our belief" title="The best financial systems are invisible" />
            <Reveal className="space-y-6 text-lg font-light leading-relaxed text-secondary">
              <p>
                Most finance software shouts. Bright dashboards, urgent reds, dense tables that
                mistake density for depth. We took the opposite path.
              </p>
              <p>
                Project O2 is monochrome, spacious and exact. It onboards clients and vendors,
                tracks every invoice, automates tax, governs approvals and reconciles to the bank —
                and it does so quietly, so your team can think.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle eyebrow="Principles" title="What we optimise for" align="center" className="mx-auto items-center" />
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-4 bg-background p-10">
                  <span className="metallic h-8 w-8 rounded-full" />
                  <h3 className="text-xl font-light tracking-tight">{v.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-secondary">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTA />
    </>
  );
}
