import type { Metadata } from "next";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Section";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a consultation with Optiminastic and see Project O2 in action.",
};

const details = [
  { icon: Mail, label: "Email", value: siteConfig.email },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Studio", value: "Bengaluru · Singapore" },
];

export default function ContactPage() {
  return (
    <Section className="grain relative min-h-[100svh] overflow-hidden pt-40 md:pt-52">
      <FloatingOrb size="min(48vw, 620px)" variant="hero" speed={18} parallax={70} interactive className="-left-24 top-1/3" opacity={0.85} />

      <Container className="relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          {/* Left */}
          <div>
            <Reveal>
              <span className="tracking-eyebrow text-xs text-secondary">Contact</span>
              <h1 className="mt-8 text-balance text-5xl font-extralight leading-[1.02] tracking-tight sm:text-6xl">
                Let&apos;s build financial confidence together
              </h1>
              <p className="mt-8 max-w-md text-lg font-light leading-relaxed text-secondary">
                Tell us where your finance operations are today. We&apos;ll show you what calm,
                reconciled and audit-ready looks like.
              </p>
            </Reveal>

            <div className="mt-12 flex flex-col gap-6">
              {details.map((d, i) => (
                <Reveal key={d.label} delay={i * 0.06}>
                  <a href="#" className="group flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
                      <d.icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="block text-xs tracking-eyebrow text-ink-40">{d.label}</span>
                      <span className="flex items-center gap-1 text-sm text-foreground">
                        {d.value}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <Reveal delay={0.1} variant="blur">
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
