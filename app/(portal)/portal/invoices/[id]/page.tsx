"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Lock, Pencil, Trash2, Download, Plus, Check } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Panel, Field, inputClass, StatusPill, Empty, DataField } from "@/components/portal/ui";
import { Modal } from "@/components/portal/Modal";
import { Select } from "@/components/portal/Select";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@/lib/auth";
import { fadeUp, stagger } from "@/lib/motion";
import { api, ApiError, type Invoice, type Client, type Agent } from "@/lib/api";
import { formatINR, formatDate, cn } from "@/lib/utils";

const STATUSES = [
  "Draft", "Sent", "Pending", "Partially Paid", "Fully Paid", "Overdue", "Cancelled", "Disputed", "Reconciled",
];

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { hasRole } = useAuth();

  const { data: invoice, loading, refetch } = useApi<Invoice>(id ? `/invoices/${id}` : null);
  const { data: clients } = useApi<Client[]>("/clients");
  const { data: agents } = useApi<Agent[]>("/agents");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  if (!loading && !invoice) {
    return (
      <PortalShell>
        <Empty message="Invoice not found." />
      </PortalShell>
    );
  }

  if (!invoice) {
    return (
      <PortalShell>
        <Empty message="Loading invoice…" />
      </PortalShell>
    );
  }

  const client = clients?.find((c) => c.id === invoice.client_id);
  const clientName = client?.business_name ?? `Client #${invoice.client_id}`;
  const agent = agents?.find((a) => a.id === invoice.agent_id);

  const canPay = !["Draft", "Cancelled", "Fully Paid"].includes(invoice.status);
  const canEdit = !invoice.is_locked || hasRole("ADMIN_CEO");
  const canDelete = invoice.status === "Draft" && hasRole("ADMIN_CEO", "CFO", "FINANCE_MANAGER");

  async function recordPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    const pending = invoice!.amount_pending;
    if (amount > pending + 0.01) {
      setError(`Payment of ${formatINR(amount)} exceeds the pending amount of ${formatINR(pending)}.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.post(`/invoices/${invoice!.id}/payments`, {
        amount,
        payment_date: fd.get("payment_date"),
        bank_reference: fd.get("bank_reference"),
        payment_mode: fd.get("payment_mode"),
        tds_deducted: Number(fd.get("tds_deducted") || 0),
        gst_component: Number(fd.get("gst_component") || 0),
        remarks: fd.get("remarks"),
        attachment: fd.get("attachment") || null,
      });
      (e.target as HTMLFormElement).reset();
      setPayOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to record payment");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.patch(`/invoices/${invoice!.id}`, {
        due_date: fd.get("due_date") || null,
        service_description: fd.get("service_description"),
        taxable_value: Number(fd.get("taxable_value")),
        gst_rate: Number(fd.get("gst_rate")),
        tds_rate: Number(fd.get("tds_rate") || 0),
        status: fd.get("status"),
        internal_remarks: fd.get("internal_remarks"),
      });
      setEditing(false);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update invoice");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this draft invoice? This cannot be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      await api.del(`/invoices/${invoice!.id}`);
      router.push("/portal/invoices");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete");
      setSaving(false);
    }
  }

  const financials: [string, string][] = [
    ["Taxable value", formatINR(invoice.taxable_value)],
    [`GST ${invoice.gst_rate}%`, formatINR(invoice.gst_amount)],
    invoice.is_interstate ? ["IGST", formatINR(invoice.igst)] : ["CGST", formatINR(invoice.cgst)],
    invoice.is_interstate ? ["GST status", invoice.gst_status] : ["SGST", formatINR(invoice.sgst)],
    ["Expected TDS", formatINR(invoice.expected_tds)],
    ["Total", formatINR(invoice.total_amount)],
    ["Received", formatINR(invoice.amount_received)],
    ["Pending", formatINR(invoice.amount_pending)],
  ];

  return (
    <PortalShell>
      <motion.div className="flex flex-col gap-8" initial="hidden" animate="show" variants={stagger(0.08, 0.04)}>
        <motion.button
          variants={fadeUp}
          onClick={() => router.push("/portal/invoices")}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All invoices
        </motion.button>

        {/* Identity header */}
        <motion.div variants={fadeUp} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="metallic flex h-16 w-16 items-center justify-center rounded-2xl">
              <FileText className="h-6 w-6 text-foreground/70" />
            </span>
            <div>
              <h1 className="font-sans text-4xl font-bold leading-[0.95] tracking-[-0.04em]">
                {invoice.invoice_number}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => router.push(`/portal/clients/${invoice.client_id}`)}
                  className="text-sm text-secondary transition-colors hover:text-foreground"
                >
                  {clientName}
                </button>
                <StatusPill status={invoice.status} />
                {invoice.is_locked && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs text-secondary">
                    <Lock className="h-3 w-3" /> Locked since {invoice.locked_at ? formatDate(invoice.locked_at) : "payment"}
                  </span>
                )}
                {agent && (
                  <button
                    onClick={() => router.push(`/portal/agents/${agent.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs text-secondary transition-colors hover:text-foreground"
                  >
                    Agent · {agent.business_name} ({agent.commission_rate}%)
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 text-xs text-secondary transition-colors hover:text-foreground"
              title="Download / print"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            {canEdit && (
              <button
                onClick={() => setEditing((v) => !v)}
                className="inline-flex items-center gap-1 text-xs text-secondary transition-colors hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" /> {editing ? "Cancel edit" : "Edit"}
              </button>
            )}
            {canDelete && (
              <button
                onClick={remove}
                disabled={saving}
                className="inline-flex items-center gap-1 text-xs text-secondary transition-colors hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </div>
        </motion.div>

        {invoice.is_locked && hasRole("ADMIN_CEO") && editing && (
          <motion.p variants={fadeUp} className="rounded-xl border border-line bg-mist/60 px-3 py-2 text-xs text-secondary">
            This invoice is locked. As CEO, edits here are recorded as a correction in the audit trail.
          </motion.p>
        )}

        {editing ? (
          /* ---- Edit form ---- */
          <motion.div variants={fadeUp}>
            <Panel>
              <form onSubmit={saveEdit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Status">
                  <Select name="status" defaultValue={invoice.status} options={STATUSES.map((s) => ({ value: s, label: s }))} />
                </Field>
                <Field label="Due date">
                  <input name="due_date" type="date" defaultValue={invoice.due_date ?? ""} className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Service description">
                    <input name="service_description" defaultValue={invoice.service_description ?? ""} className={inputClass} />
                  </Field>
                </div>
                <Field label="Taxable value (₹)">
                  <input name="taxable_value" type="number" step="0.01" defaultValue={invoice.taxable_value} className={inputClass} />
                </Field>
                <Field label="GST rate (%)">
                  <input name="gst_rate" type="number" step="0.01" defaultValue={invoice.gst_rate} className={inputClass} />
                </Field>
                <Field label="TDS rate (%)">
                  <input name="tds_rate" type="number" step="0.01" defaultValue={invoice.tds_rate} className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Internal remarks">
                    <input name="internal_remarks" defaultValue={invoice.internal_remarks ?? ""} className={inputClass} />
                  </Field>
                </div>
                {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
                <div className="sm:col-span-2 flex justify-end gap-3">
                  <Button type="button" variant="secondary" size="sm" magnetic={false} onClick={() => setEditing(false)}>Cancel</Button>
                  <Button type="submit" size="sm" magnetic={false} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
                </div>
              </form>
            </Panel>
          </motion.div>
        ) : (
          <>
            {/* Financials incl. CGST/SGST/IGST */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {financials.map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line bg-white/50 p-4">
                  <p className="text-xs text-ink-40">{k}</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">{v}</p>
                </div>
              ))}
            </motion.div>

            {/* Meta */}
            <motion.div variants={fadeUp}>
              <Panel>
                <h2 className="mb-5 text-sm font-medium tracking-eyebrow text-secondary">Invoice details</h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                  <DataField label="Client" value={clientName} />
                  <DataField label="Referral agent" value={agent ? `${agent.business_name} · ${agent.commission_rate}%` : null} />
                  <DataField label="Invoice date" value={formatDate(invoice.invoice_date)} />
                  <DataField label="Due date" value={invoice.due_date ? formatDate(invoice.due_date) : null} />
                  <DataField label="GST status" value={invoice.gst_status} />
                  <DataField label="TDS applicable" value={invoice.tds_applicable ? `Yes · ${invoice.tds_rate}%` : "No"} />
                  <DataField label="Service description" value={invoice.service_description} className="sm:col-span-2 lg:col-span-2" />
                  <DataField label="Supporting document" value={invoice.supporting_document} />
                  <DataField label="Internal remarks" value={invoice.internal_remarks} className="sm:col-span-2 lg:col-span-3" />
                </div>
              </Panel>
            </motion.div>

            {/* Payments — stepper */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium tracking-eyebrow text-secondary">Payment progress</h2>
                {canPay && (
                  <Button size="sm" magnetic={false} onClick={() => { setError(null); setPayOpen(true); }}>
                    <Plus className="h-4 w-4" /> Record payment
                  </Button>
                )}
              </div>

              <PaymentStepper invoice={invoice} />
            </motion.div>

          </>
        )}
      </motion.div>

      {/* Record payment dialog */}
      <Modal
        open={payOpen}
        onOpenChange={setPayOpen}
        title="Record a payment"
        description="Recording a payment locks the invoice's financial fields."
      >
        <form onSubmit={recordPayment} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={`Amount (₹) · max ${formatINR(invoice.amount_pending)}`}>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={invoice.amount_pending}
              required
              defaultValue={invoice.amount_pending}
              className={inputClass}
            />
          </Field>
          <Field label="Date">
            <input name="payment_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
          </Field>
          <Field label="Bank reference / UTR">
            <input name="bank_reference" className={inputClass} />
          </Field>
          <Field label="Mode">
            <Select name="payment_mode" defaultValue="NEFT" options={["NEFT", "RTGS", "IMPS", "UPI", "Cheque", "Cash", "Other"].map((m) => ({ value: m, label: m }))} />
          </Field>
          <Field label="TDS deducted by client (₹)">
            <input name="tds_deducted" type="number" step="0.01" defaultValue={0} className={inputClass} />
          </Field>
          <Field label="GST component (₹)">
            <input name="gst_component" type="number" step="0.01" defaultValue={0} className={inputClass} />
          </Field>
          <Field label="Remarks">
            <input name="remarks" className={inputClass} />
          </Field>
          <Field label="Attachment (reference / link)">
            <input name="attachment" className={inputClass} />
          </Field>
          {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
          <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
            <Button type="button" variant="secondary" magnetic={false} onClick={() => setPayOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" magnetic={false} disabled={saving}>
              {saving ? "Recording…" : "Record payment (locks invoice)"}
            </Button>
          </div>
        </form>
      </Modal>
    </PortalShell>
  );
}

/** Vertical stepper showing payment progress toward the invoice total. */
function PaymentStepper({ invoice }: { invoice: Invoice }) {
  const payments = invoice.payments ?? [];
  const total = invoice.total_amount;
  const received = invoice.amount_received;
  const pending = invoice.amount_pending;
  const pct = total > 0 ? Math.min(100, Math.round((received / total) * 100)) : 0;
  const fullyPaid = pending <= 0.01;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress summary */}
      <div className="rounded-2xl border border-line bg-white/50 p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-2xl font-light tabular-nums">
            {formatINR(received)}
            <span className="ml-1.5 text-sm text-ink-40">of {formatINR(total)}</span>
          </p>
          <p className="text-sm text-secondary">{fullyPaid ? "Fully paid" : `${formatINR(pending)} pending`}</p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-mist">
          <div className="h-full rounded-full bg-foreground transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Steps */}
      <ol className="relative flex flex-col">
        {payments.map((p, idx) => (
          <li key={p.id} className="relative flex gap-4 pb-6">
            <span className="absolute left-[13px] top-7 bottom-0 w-px bg-line" />
            <span className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-white">
              {idx + 1}
            </span>
            <div className="flex-1 rounded-xl border border-line bg-white/50 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium tabular-nums">{formatINR(p.amount)}</span>
                <span className="text-xs text-ink-40">{formatDate(p.payment_date)}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-40">
                <span>{p.payment_mode} · {p.bank_reference ?? "—"}</span>
                <span>TDS {formatINR(p.tds_deducted)}</span>
                {p.gst_component ? <span>GST {formatINR(p.gst_component)}</span> : null}
              </div>
            </div>
          </li>
        ))}

        {/* Final step — completed or remaining */}
        <li className="relative flex gap-4">
          <span
            className={cn(
              "relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
              fullyPaid ? "bg-foreground text-white" : "border border-dashed border-ink-40 bg-background text-ink-40",
            )}
          >
            {fullyPaid ? <Check className="h-4 w-4" /> : payments.length + 1}
          </span>
          <div className="flex-1 rounded-xl border border-dashed border-line bg-mist/30 px-4 py-3 text-sm">
            {fullyPaid ? (
              <span className="font-medium">Fully paid</span>
            ) : (
              <span className="text-secondary">
                Remaining <span className="font-medium tabular-nums text-foreground">{formatINR(pending)}</span>
                {payments.length === 0 && " — no payments recorded yet"}
              </span>
            )}
          </div>
        </li>
      </ol>
    </div>
  );
}
