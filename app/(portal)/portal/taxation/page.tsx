"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import { PageHeading, MetricCard, Panel, Table, Row, Cell, Empty, StatusPill } from "@/components/portal/ui";
import { AnimatedNumber } from "@/components/portal/AnimatedNumber";
import { useApi } from "@/lib/useApi";
import { formatINR } from "@/lib/utils";
import type { TaxationSummary } from "@/lib/api";

const spark = (s: number): number[] => Array.from({ length: 18 }, (_, i) => 20 + ((s * (i + 3) * 7) % 80));

interface GstPendingRow {
  id: number;
  invoice_number: string;
  taxable_value: number;
  gst_amount: number;
  gst_status: string;
}

export default function TaxationPage() {
  const { data, loading } = useApi<TaxationSummary>("/taxation/summary");
  const { data: pending } = useApi<GstPendingRow[]>("/taxation/gst/pending");

  return (
    <PortalShell>
      <div className="flex flex-col gap-8">
        <PageHeading title="Taxation" description="Automated GST and TDS — collection, payment and reconciliation status." />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="GST TOTAL"
            value={loading ? "—" : <AnimatedNumber value={data?.gst_total ?? 0} format={formatINR} />}
            sub="Across client invoices"
            spark={spark(3)}
          />
          <MetricCard
            label="CLIENT TDS RECEIVABLE"
            value={loading ? "—" : <AnimatedNumber value={data?.client_tds_receivable ?? 0} format={formatINR} />}
            sub="Deducted by clients"
            spark={spark(6)}
          />
          <MetricCard
            label="VENDOR TDS PAYABLE"
            value={loading ? "—" : <AnimatedNumber value={data?.vendor_tds_payable ?? 0} format={formatINR} />}
            sub="Deducted on payouts"
            spark={spark(4)}
          />
          <MetricCard
            label="INVOICES"
            value={loading ? "—" : `${data?.client_invoice_count ?? 0} / ${data?.vendor_invoice_count ?? 0}`}
            sub="Client / vendor"
            spark={spark(8)}
          />
        </div>

        {/* GST by status */}
        <Panel>
          <h2 className="mb-5 text-lg font-light tracking-tight">GST pendency</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {data &&
              Object.entries(data.gst_by_status).map(([status, amount]) => (
                <div key={status} className="rounded-2xl border border-line bg-white/50 p-4">
                  <p className="text-xs text-ink-40">{status.replace("GST ", "")}</p>
                  <p className="mt-2 text-lg font-light tabular-nums">{formatINR(amount)}</p>
                </div>
              ))}
          </div>
        </Panel>

        {/* Pending GST invoices */}
        <div>
          <h2 className="mb-4 text-lg font-light tracking-tight">Invoices with unreconciled GST</h2>
          {pending && pending.length > 0 ? (
            <Table head={["Invoice", "Taxable", "GST", "Status"]}>
              {pending.map((r) => (
                <Row key={r.id}>
                  <Cell className="font-medium">{r.invoice_number}</Cell>
                  <Cell>{formatINR(r.taxable_value)}</Cell>
                  <Cell>{formatINR(r.gst_amount)}</Cell>
                  <Cell>
                    <StatusPill status={r.gst_status} />
                  </Cell>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty message="All GST reconciled." />
          )}
        </div>
      </div>
    </PortalShell>
  );
}
