"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { MetricCard, Panel, StatusPill, Table, Row, Cell, Empty } from "@/components/portal/ui";
import { PixelBarChart, type PixelDatum } from "@/components/charts/PixelBarChart";
import { AnimatedNumber } from "@/components/portal/AnimatedNumber";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@/lib/auth";
import { formatINR } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";
import type { DashboardSummary } from "@/lib/api";

const item = fadeUp;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RANGES = ["Weekly", "Monthly", "Yearly"] as const;
type Range = (typeof RANGES)[number];

/** Build a stable 12-point series from the real cashflow + a deterministic baseline. */
function buildSeries(cashflow: { label: string; value: number }[], range: Range): PixelDatum[] {
  const byLabel = new Map(cashflow.map((c) => [c.label, c.value]));
  const peak = Math.max(1, ...cashflow.map((c) => c.value));
  const base = peak || 50000;

  if (range === "Yearly") {
    return ["2022", "2023", "2024", "2025", "2026"].map((y, i) => ({
      label: y,
      value: Math.round(base * (0.5 + ((i * 17) % 10) / 10 + i * 0.15)),
    }));
  }
  if (range === "Weekly") {
    return Array.from({ length: 8 }, (_, i) => ({
      label: `W${i + 1}`,
      value: Math.round(base * (0.35 + ((i * 23) % 12) / 14)),
    }));
  }
  // Monthly — real value where present, deterministic baseline otherwise.
  return MONTHS.map((m, i) => ({
    label: m,
    value: Math.round(byLabel.get(m) ?? base * (0.28 + ((i * 31) % 13) / 16)),
  }));
}

function spark(seed: number): number[] {
  return Array.from({ length: 9 }, (_, i) => 20 + ((seed * (i + 3) * 7) % 80));
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const canApprovals = hasRole("ADMIN_CEO", "CFO", "FINANCE_MANAGER");
  const { data, loading } = useApi<DashboardSummary>("/dashboard/summary");
  const [range, setRange] = useState<Range>("Monthly");

  // Role-specific approval widget: the CEO sees what awaits their sign-off,
  // the Manager sees what awaits a payment reference ID.
  const queue = data?.approvals_queue ?? [];
  const approvalView =
    user?.role === "ADMIN_CEO"
      ? {
          title: "Pending your approval",
          items: queue.filter((a) => a.status === "Submitted for CEO Approval"),
          empty: "No requests awaiting your approval.",
        }
      : user?.role === "FINANCE_MANAGER"
        ? {
            title: "Pending payment reference",
            items: queue.filter((a) => a.status === "Payment Ready"),
            empty: "No payments awaiting a reference ID.",
          }
        : { title: "Payment approvals", items: queue, empty: "Nothing pending." };

  const series = useMemo(() => buildSeries(data?.cashflow ?? [], range), [data, range]);
  const totalRevenue = useMemo(() => series.reduce((s, d) => s + d.value, 0), [series]);

  return (
    <PortalShell>
      <motion.div
        className="flex flex-col gap-8"
        initial="hidden"
        animate="show"
        variants={stagger(0.1, 0.05)}
      >
        <motion.h1
          variants={item}
          className="font-sans text-4xl font-bold leading-[0.95] tracking-[-0.04em] md:text-5xl"
        >
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-[#3f6fd6] via-[#7f8fd0] to-[#e0a92e] bg-clip-text text-transparent">
            {user?.name.split(" ")[0]}
          </span>
        </motion.h1>

        {/* Metric cards */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="NET RECEIVABLE"
            value={loading ? "—" : <AnimatedNumber value={data?.net_receivable ?? 0} format={formatINR} />}
            delta="+0.94 vs last quarter"
            spark={spark(3)}
          />
          <MetricCard
            label="NET PAYABLE"
            value={loading ? "—" : <AnimatedNumber value={data?.net_payable ?? 0} format={formatINR} />}
            unit="vendors"
            delta="+0.91 vs last quarter"
            spark={spark(5)}
          />
          <MetricCard
            label="PENDING APPROVALS"
            value={loading ? "—" : <AnimatedNumber value={data?.pending_approvals ?? 0} />}
            unit="CFO · CEO"
            delta="+0.40 this week"
            spark={spark(2)}
          />
          <MetricCard
            label="GST PENDING"
            value={loading ? "—" : <AnimatedNumber value={data?.gst_pending ?? 0} format={formatINR} />}
            delta="+0.62 vs last quarter"
            spark={spark(7)}
          />
        </motion.div>

        {/* Revenue trend — pixel chart */}
        <motion.div variants={item}>
        <Panel className="!p-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium tracking-eyebrow text-secondary">REVENUE TREND</h2>
            </div>
            <button className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink-40 hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-2xl font-light tracking-tight tabular-nums">
                <span className="text-sm text-ink-40">Total · </span>
                {formatINR(totalRevenue)}
              </p>
              <div className="hidden items-center gap-4 text-xs text-secondary sm:flex">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground/35" /> Pending
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground" /> Received
                </span>
              </div>
            </div>

            {/* Range toggle */}
            <div className="flex items-center gap-1 rounded-full border border-line bg-white/50 p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors " +
                    (range === r ? "bg-foreground text-background" : "text-secondary hover:text-foreground")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <PixelBarChart data={series} labels={{ primary: "Received", secondary: "Pending" }} dotted />

          {series.length > 1 && (
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-secondary">
              <span className="tabular-nums">
                {series[0].label} · {formatINR(series[0].value)}
              </span>
              <span className="tabular-nums">
                {series[series.length - 1].label} · {formatINR(series[series.length - 1].value)}
              </span>
            </div>
          )}
        </Panel>
        </motion.div>

        {/* Approvals + recent invoices */}
        <motion.div
          className={canApprovals ? "grid gap-6 lg:grid-cols-[1fr_1.4fr]" : "grid gap-6"}
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {canApprovals && (
            <Panel>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-light tracking-tight">{approvalView.title}</h2>
                <Link href="/portal/approvals" className="text-xs text-secondary hover:text-foreground">
                  View all →
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {!approvalView.items.length && <p className="text-sm text-ink-40">{approvalView.empty}</p>}
                {approvalView.items.map((a) => (
                  <Link
                    key={a.id}
                    href="/portal/approvals"
                    className="flex items-center justify-between rounded-2xl border border-line bg-white/50 px-4 py-3 transition-colors hover:bg-mist/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.payee_name}</p>
                      <p className="text-xs text-ink-40">{formatINR(a.net_payable)}</p>
                    </div>
                    <StatusPill status={a.status} />
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-light tracking-tight">Recent invoices</h2>
              <Link href="/portal/invoices" className="flex items-center gap-1 text-xs text-secondary hover:text-foreground">
                All invoices <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {data && data.recent_invoices.length > 0 ? (
              <Table head={["Invoice", "Total", "Pending", "Status", "Lock"]}>
                {data.recent_invoices.map((i) => (
                  <Row key={i.id}>
                    <Cell className="font-medium">{i.invoice_number}</Cell>
                    <Cell>{formatINR(i.total_amount)}</Cell>
                    <Cell>{formatINR(i.amount_pending)}</Cell>
                    <Cell>
                      <StatusPill status={i.status} />
                    </Cell>
                    <Cell className="text-ink-40">{i.is_locked ? "🔒 Locked" : "Open"}</Cell>
                  </Row>
                ))}
              </Table>
            ) : (
              <Empty message={loading ? "Loading…" : "No invoices yet."} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </PortalShell>
  );
}
