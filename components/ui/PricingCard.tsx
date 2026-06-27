"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Button } from "@/components/ui/Button";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta?: string;
}

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border p-8",
        tier.featured
          ? "glass-strong border-foreground/10 shadow-[0_50px_100px_-50px_rgba(17,17,17,0.35)]"
          : "border-line bg-white/50",
      )}
    >
      {tier.featured && (
        <FloatingOrb size={180} variant="card" speed={13} opacity={0.7} className="-right-12 -top-12" />
      )}
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight">{tier.name}</h3>
          {tier.featured && (
            <span className="rounded-full bg-foreground px-3 py-1 text-xs text-background">Popular</span>
          )}
        </div>
        <p className="mt-4 text-sm font-light text-secondary">{tier.description}</p>
        <div className="mt-8 flex items-end gap-1">
          <span className="text-5xl font-extralight tracking-tight">{tier.price}</span>
          {tier.cadence && <span className="mb-1.5 text-sm text-secondary">/{tier.cadence}</span>}
        </div>
        <ul className="mt-8 flex flex-1 flex-col gap-3">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm font-light text-foreground/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
              {f}
            </li>
          ))}
        </ul>
        <Button
          asChild
          variant={tier.featured ? "primary" : "secondary"}
          className="mt-10 w-full"
          magnetic={false}
        >
          <Link href="/contact">{tier.cta ?? "Get started"}</Link>
        </Button>
      </div>
    </motion.div>
  );
}
