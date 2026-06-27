"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Container, Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { TrendChart } from "@/components/charts/TrendChart";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { formatINR } from "@/lib/utils";

const cashflow = [
  { label: "Jan", value: 42 },
  { label: "Feb", value: 55 },
  { label: "Mar", value: 48 },
  { label: "Apr", value: 71 },
  { label: "May", value: 66 },
  { label: "Jun", value: 84 },
  { label: "Jul", value: 92 },
];

export function PlatformPreview() {
  return (
    <Section id="platform" className="relative overflow-hidden">
      <FloatingOrb size={460} variant="ambient" speed={20} opacity={0.35} className="-right-32 top-10" parallax={50} />
      <Container className="relative z-10">
        <SectionTitle
          index="03"
          eyebrow="Platform"
          title="The dashboard your CFO has been waiting for"
          description="Glass, light and exact — every number reconciled, every approval traceable, every report a click away."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative mt-20"
        >
          {/* Main glass dashboard */}
          <div className="glass relative overflow-hidden rounded-[2rem] p-2">
            <div className="rounded-[1.6rem] border border-line/60 bg-background/60 p-6 md:p-8">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-line pb-5">
                <div className="flex items-center gap-3">
                  <span className="metallic h-6 w-6 rounded-full" />
                  <span className="text-sm font-medium">Project O2 · Overview</span>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-silver" />
                </div>
              </div>

              {/* KPI row */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Net cash position", value: formatINR(48200000), delta: "+12.4%", icon: TrendingUp },
                  { label: "Pending approvals", value: "7", delta: "CFO · CEO", icon: Clock },
                  { label: "Reconciled this month", value: "99.98%", delta: "Auto-matched", icon: CheckCircle2 },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-line bg-white/50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-secondary">{kpi.label}</span>
                      <kpi.icon className="h-4 w-4 text-ink-40" strokeWidth={1.5} />
                    </div>
                    <p className="mt-3 text-2xl font-light tracking-tight">{kpi.value}</p>
                    <p className="mt-1 text-xs text-ink-40">{kpi.delta}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="mt-4 rounded-2xl border border-line bg-white/50 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-secondary">Cash flow · last 7 months</span>
                  <span className="text-xs text-ink-40">₹ crore</span>
                </div>
                <TrendChart data={cashflow} height={200} showAxis />
              </div>
            </div>
          </div>

          {/* Floating glass cards */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -left-4 top-24 hidden w-56 rounded-2xl p-4 md:block"
          >
            <p className="text-xs text-secondary">Invoice locked</p>
            <p className="mt-2 text-sm font-medium">INV-2048 · Northwind</p>
            <p className="mt-1 text-xs text-ink-40">Payment received · immutable</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass absolute -right-4 bottom-16 hidden w-56 rounded-2xl p-4 md:block"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
              <p className="text-sm font-medium">CEO approved</p>
            </div>
            <p className="mt-2 text-xs text-ink-40">Payout ₹12,40,000 · ready for release</p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
