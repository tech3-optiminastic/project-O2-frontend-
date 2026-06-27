import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Container, Section } from "@/components/ui/Section";
import { BlogCard, type BlogPost } from "@/components/ui/BlogCard";
import { RevealGroup } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Insights",
  description: "Perspectives on building calm, trustworthy financial systems for modern businesses.",
};

const posts: BlogPost[] = [
  { title: "The quiet architecture of trustworthy finance", category: "Perspective", readTime: "6 min", excerpt: "Why the most advanced financial systems are the ones you never notice working.", date: "Jun 2026" },
  { title: "Reconciliation as a design problem", category: "Engineering", readTime: "9 min", excerpt: "Matching money to reality is less about data and more about composition.", date: "May 2026" },
  { title: "Approvals without friction", category: "Operations", readTime: "5 min", excerpt: "How two signatures can protect a company without slowing it down.", date: "May 2026" },
  { title: "What GST automation really removes", category: "Taxation", readTime: "7 min", excerpt: "The hidden cost of manual tax tracking — and the calm of getting it right by default.", date: "Apr 2026" },
  { title: "Designing for the CFO's attention", category: "Product", readTime: "8 min", excerpt: "Information hierarchy for the people who carry a company's numbers.", date: "Apr 2026" },
  { title: "The audit trail as a feature, not a chore", category: "Compliance", readTime: "6 min", excerpt: "Traceability that leadership trusts is built, not bolted on.", date: "Mar 2026" },
];

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Thinking, written plainly"
        lede="Notes on finance, design and the discipline of building systems people can trust."
      />
      <Section className="pt-0">
        <Container>
          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <BlogCard key={p.title} post={p} index={i} />
            ))}
          </RevealGroup>
        </Container>
      </Section>
      <CTA />
    </>
  );
}
