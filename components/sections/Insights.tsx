"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/lib/site";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function Insights() {
  return (
    <Section id="insights">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionTitle index="07" eyebrow="Insights" title="Thinking, written plainly" />
          <Button asChild variant="secondary" size="sm">
            <Link href="/insights">All insights</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {insights.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.08}>
              <Link
                href="/insights"
                className="group flex h-full flex-col justify-between bg-background p-8 transition-colors duration-500 hover:bg-mist/60"
              >
                <div className="flex items-center justify-between text-xs text-ink-40">
                  <span className="tracking-eyebrow">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="mt-20">
                  <h3 className="flex items-start gap-2 text-2xl font-light leading-snug tracking-tight">
                    {post.title}
                    <ArrowUpRight className="mt-1.5 h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-60" />
                  </h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-secondary">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
