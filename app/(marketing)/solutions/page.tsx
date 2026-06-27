import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PlatformPreview } from "@/components/sections/PlatformPreview";
import { CTA } from "@/components/sections/CTA";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PricingCard, type PricingTier } from "@/components/ui/PricingCard";
import { Reveal } from "@/components/ui/Reveal";
import { Users, FileText, Receipt, ShieldCheck, BarChart3, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Project O2 — a secure finance platform with client & vendor onboarding, invoice locking, GST/TDS automation, CFO→CEO approvals, and bank reconciliation.",
};

const modules = [
  { icon: Users, title: "Client & Vendor Onboarding", body: "Structured intake with COI, GST, PAN, bank and compliance verification before anyone is live." },
  { icon: FileText, title: "Invoice Intelligence", body: "Create, lock and track invoices. Once paid, critical fields become immutable by design." },
  { icon: Receipt, title: "GST & TDS Automation", body: "CGST/SGST/IGST splits, client and vendor TDS, and pendency tracked end to end." },
  { icon: ShieldCheck, title: "Governed Approvals", body: "Two-level CFO → CEO sign-off with an immutable audit trail on every payout." },
  { icon: BarChart3, title: "Reporting", body: "Receive vendor reports, review internally, and deliver to clients — all logged." },
  { icon: CheckCircle2, title: "Bank Reconciliation", body: "Match statements to records by amount, date, UTR and narration. Flag mismatches." },
];

const tiers: PricingTier[] = [
  {
    name: "Essential",
    price: "₹49k",
    cadence: "mo",
    description: "For lean finance teams establishing a single source of truth.",
    features: ["Up to 5 users", "Client & vendor onboarding", "Invoice management & locking", "GST/TDS automation", "Email support"],
  },
  {
    name: "Growth",
    price: "₹1.2L",
    cadence: "mo",
    description: "For scaling businesses that need governed approvals and reconciliation.",
    features: ["Up to 25 users", "Everything in Essential", "CFO → CEO approvals", "Bank reconciliation", "Reporting workflows", "Priority support"],
    featured: true,
    cta: "Schedule Demo",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For leadership that needs full audit-grade control and bespoke workflows.",
    features: ["Unlimited users", "Everything in Growth", "Role-based access controls", "Dedicated success partner", "Custom integrations", "SLA & audit support"],
    cta: "Talk to us",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions · Project O2"
        title="One platform for the entire money trail"
        lede="From onboarding to bank reconciliation, Project O2 holds your finance operations in a single, audit-ready system — with the same quiet precision throughout."
      />

      <Section className="pt-0">
        <Container>
          <SectionTitle eyebrow="Modules" title="Everything, reconciled" />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-line bg-white/50 p-8 transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(17,17,17,0.2)]">
                  <m.icon className="h-5 w-5" strokeWidth={1.4} />
                  <h3 className="text-xl font-light tracking-tight">{m.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-secondary">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <PlatformPreview />

      <Section>
        <Container>
          <SectionTitle
            eyebrow="Pricing"
            title="Simple, transparent, monochrome"
            description="No hidden fees. No bright-coloured upsells. Just the platform, priced honestly."
            align="center"
            className="mx-auto items-center"
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <PricingCard key={t.name} tier={t} />
            ))}
          </div>
        </Container>
      </Section>

      <CTA />
    </>
  );
}
