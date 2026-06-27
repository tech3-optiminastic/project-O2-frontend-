import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Financial strategy, wealth advisory, corporate finance, investment planning, risk analysis and digital transformation — one cohesive financial function.",
};

const capabilities = [
  { k: "Onboarding", v: "Automated client & vendor intake with KYC, tax and bank verification." },
  { k: "Invoicing", v: "A single source of truth for every client and vendor invoice." },
  { k: "Taxation", v: "GST and TDS calculated, tracked and reconciled — automatically." },
  { k: "Approvals", v: "Governed CFO → CEO sign-off on every outgoing payment." },
  { k: "Reconciliation", v: "System truth matched to bank reality, continuously." },
  { k: "Reporting", v: "Vendor reports reviewed and delivered to clients, traceably." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="The financial function, reimagined"
        lede="Six disciplines and an operating system beneath them — engineered to remove friction from the way capital moves through your business."
      >
        <Button asChild size="lg">
          <Link href="/contact">Schedule Demo</Link>
        </Button>
      </PageHero>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-3 bg-background p-8">
                  <span className="text-xs text-ink-40 tabular-nums">0{i + 1}</span>
                  <h3 className="text-xl font-light tracking-tight">{c.k}</h3>
                  <p className="text-sm font-light leading-relaxed text-secondary">{c.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Services />
      <Process />
      <CTA />
    </>
  );
}
