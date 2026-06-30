"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PortalShell } from "@/components/portal/PortalShell";
import { PageHeading } from "@/components/portal/ui";
import { useAuth } from "@/lib/auth";
import { OverviewTab } from "@/components/portal/invoices/OverviewTab";
import { PaymentReceivedTab } from "@/components/portal/invoices/PaymentReceivedTab";
import { PayoutPanel } from "@/components/portal/PayoutPanel";

type TabKey = "overview" | "received" | "payout";

export default function InvoicesPage() {
  const { hasRole } = useAuth();
  // Payment Received (TDS/GST) and Payout (approvals) are NON_EXEC-only, mirroring
  // the server guards on /taxation/* and /approvals/*.
  const canFinance = hasRole("ADMIN_CEO", "CFO", "FINANCE_MANAGER");
  const [tab, setTab] = useState<TabKey>("overview");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    ...(canFinance
      ? ([
          { key: "received", label: "Payment Received" },
          { key: "payout", label: "Payout" },
        ] as { key: TabKey; label: string }[])
      : []),
  ];

  const active: TabKey = tabs.some((t) => t.key === tab) ? tab : "overview";

  return (
    <PortalShell>
      <div className="flex flex-col gap-8">
        <PageHeading
          title="Client Invoices"
          description="A single source of truth. Invoices lock automatically once a payment is recorded."
        />

        {/* Tab switcher — Overview / Payment Received / Payout */}
        {tabs.length > 1 && (
          <div className="flex w-fit items-center gap-1 rounded-full border border-line bg-white/50 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "relative rounded-full px-4 py-2 text-xs font-medium transition-colors " +
                  (active === t.key ? "text-background" : "text-secondary hover:text-foreground")
                }
              >
                {active === t.key && (
                  <motion.span
                    layoutId="invoice-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {t.label}
              </button>
            ))}
          </div>
        )}

        {active === "overview" && <OverviewTab />}
        {active === "received" && <PaymentReceivedTab />}
        {active === "payout" && <PayoutPanel />}
      </div>
    </PortalShell>
  );
}
