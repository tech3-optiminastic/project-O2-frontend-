"use client";

import { motion } from "framer-motion";
import { process } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function Process() {
  return (
    <Section id="process" className="relative overflow-hidden bg-mist/40">
      <FloatingOrb size={360} variant="ambient" speed={17} opacity={0.4} className="-right-24 bottom-0" />
      <Container className="relative z-10">
        <SectionTitle
          index="04"
          eyebrow="Process"
          title="Five steps. One continuous loop."
          description="A disciplined cadence that turns financial chaos into a calm, repeatable rhythm."
          align="center"
          className="mx-auto items-center"
        />

        <div className="relative mt-24">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-line to-transparent lg:block" />

          <ol className="flex flex-col gap-12 lg:gap-4">
            {process.map((p, i) => {
              const left = i % 2 === 0;
              return (
                <motion.li
                  key={p.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  className={`relative flex flex-col items-start gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10 ${
                    left ? "" : "lg:[&>*:first-child]:order-3"
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:col-start-1 ${left ? "lg:text-right" : "lg:col-start-3 lg:text-left"}`}>
                    <h3 className="text-2xl font-light tracking-tight md:text-3xl">{p.title}</h3>
                    <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-secondary lg:ml-auto">
                      {p.body}
                    </p>
                  </div>

                  {/* Circular node */}
                  <div className="lg:col-start-2 lg:row-start-1">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <span className="metallic absolute inset-0 rounded-full shadow-[0_14px_30px_-14px_rgba(17,17,17,0.4)]" />
                      <span className="absolute inset-[18%] rounded-full border border-white/50" />
                      <span className="relative z-10 text-xs font-medium tabular-nums text-foreground/70">
                        {p.step}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for grid balance */}
                  <div className="hidden lg:block" />
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
