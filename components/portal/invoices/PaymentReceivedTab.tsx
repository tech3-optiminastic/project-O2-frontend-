"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MetricCard, Panel, Table, Row, Cell, Empty, StatusPill } from "@/components/portal/ui";
import { AnimatedNumber } from "@/components/portal/AnimatedNumber";
import { useApi } from "@/lib/useApi";
import { formatINR, formatDate } from "@/lib/utils";
import type { TaxationSummary, PaymentReceipt } from "@/lib/api";

const spark = (s: number): number[] => Array.from({ length: 18 }, (_, i) => 20 + ((s * (i + 3) * 7) % 80));

interface GstPendingRow {
  id: number;
  invoice_number: string;
  taxable_value: number;
  gst_amount: number;
  gst_status: string;
}

/**
 * The "Payment Received" tab — money coming in: client receipts, the TDS
 * clients deduct, and GST collected. Summary KPIs plus a full receipts ledger.
 */
export function PaymentReceivedTab() {
  const router = useRouter();
  const { data: summary, loading: summaryLoading } = useApi<TaxationSummary>("/taxation/summary");
  const { data: receipts, loading: receiptsLoading } = useApi<PaymentReceipt[]>("/taxation/receipts");
  const { data: gstPending } = useApi<GstPendingRow[]>("/taxation/gst/pending");

  const totalReceived = useMemo(
    () => (receipts ?? []).reduce((s, r) => s + r.amount, 0),
    [receipts],
  );
  const tdsDeducted = useMemo(
    () => (receipts ?? []).reduce((s, r) => s + r.tds_deducted, 0),
    [receipts],
  );

  return (
    <div className="flex flex-col gap-8">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="TOTAL RECEIVED"
          value={receiptsLoading ? "—" : <AnimatedNumber value={totalReceived} format={formatINR} />}
          sub={`${receipts?.length ?? 0} payments`}
          spark={spark(3)}
        />
        <MetricCard
          label="GST COLLECTED"
          value={summaryLoading ? "—" : <AnimatedNumber value={summary?.gst_total ?? 0} format={formatINR} />}
          sub="Across client invoices"
          spark={spark(6)}
        />
        <MetricCard
          label="CLIENT TDS RECEIVABLE"
          value={summaryLoading ? "—" : <AnimatedNumber value={summary?.client_tds_receivable ?? 0} format={formatINR} />}
          sub="Deducted by clients"
          spark={spark(4)}
        />
        <MetricCard
          label="TDS DEDUCTED (PAID)"
          value={receiptsLoading ? "—" : <AnimatedNumber value={tdsDeducted} format={formatINR} />}
          sub="On receipts so far"
          spark={spark(8)}
        />
      </div>

      {/* Receipts ledger */}
      <div>
        <h2 className="mb-4 text-lg font-light tracking-tight">Payments received</h2>
        {receipts && receipts.length > 0 ? (
          <Table head={["Date", "Invoice", "Amount", "TDS deducted", "GST", "Mode", "Reference"]}>
            {receipts.map((r) => (
              <Row key={r.id} onClick={() => router.push(`/portal/invoices/${r.invoice_id}`)}>
                <Cell className="text-ink-40">{formatDate(r.payment_date)}</Cell>
                <Cell className="font-medium">{r.invoice_number}</Cell>
                <Cell className="tabular-nums">{formatINR(r.amount)}</Cell>
                <Cell className="tabular-nums">{formatINR(r.tds_deducted)}</Cell>
                <Cell className="tabular-nums">{formatINR(r.gst_component)}</Cell>
                <Cell className="text-ink-40">{r.payment_mode}</Cell>
                <Cell className="text-ink-40">{r.bank_reference || "—"}</Cell>
              </Row>
            ))}
          </Table>
        ) : (
          <Empty message={receiptsLoading ? "Loading receipts…" : "No payments received yet."} />
        )}
      </div>

      {/* GST pendency */}
      {summary && (
        <Panel>
          <h2 className="mb-5 text-lg font-light tracking-tight">GST pendency</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(summary.gst_by_status).map(([status, amount]) => (
              <div key={status} className="rounded-2xl border border-line bg-white/50 p-4">
                <p className="text-xs text-ink-40">{status.replace("GST ", "")}</p>
                <p className="mt-2 text-lg font-light tabular-nums">{formatINR(amount)}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Invoices with unreconciled GST */}
      <div>
        <h2 className="mb-4 text-lg font-light tracking-tight">Invoices with unreconciled GST</h2>
        {gstPending && gstPending.length > 0 ? (
          <Table head={["Invoice", "Taxable", "GST", "Status"]}>
            {gstPending.map((r) => (
              <Row key={r.id} onClick={() => router.push(`/portal/invoices/${r.id}`)}>
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
  );
}
