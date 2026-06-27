"use client";

import { useState } from "react";
import { Plus, Lock, Copy } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { PageHeading, Table, Row, Cell, Empty, Field, inputClass, StatusPill, Panel } from "@/components/portal/ui";
import { Modal } from "@/components/portal/Modal";
import { Select } from "@/components/portal/Select";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/lib/useApi";
import { api, ApiError, type Invoice, type Client } from "@/lib/api";
import { formatINR, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const { data, loading, refetch } = useApi<Invoice[]>("/invoices");
  const { data: clients } = useApi<Client[]>("/clients");
  const [createOpen, setCreateOpen] = useState(false);
  const [active, setActive] = useState<Invoice | null>(null);

  const clientName = (id: number) => clients?.find((c) => c.id === id)?.business_name ?? `Client #${id}`;

  async function openDetail(id: number) {
    setActive(await api.get<Invoice>(`/invoices/${id}`));
  }

  async function duplicate(id: number) {
    await api.post(`/invoices/${id}/duplicate`);
    refetch();
  }

  return (
    <PortalShell>
      <div className="flex flex-col gap-8">
        <PageHeading
          title="Client Invoices"
          description="A single source of truth. Invoices lock automatically once a payment is recorded."
          action={
            <Button size="sm" magnetic={false} onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> New invoice
            </Button>
          }
        />

        {data && data.length > 0 ? (
          <Table head={["Invoice", "Client", "Total", "Pending", "Status", "GST", ""]}>
            {data.map((i) => (
              <Row key={i.id} onClick={() => openDetail(i.id)}>
                <Cell className="font-medium">
                  <span className="flex items-center gap-2">
                    {i.is_locked && <Lock className="h-3 w-3 text-ink-40" />}
                    {i.invoice_number}
                  </span>
                </Cell>
                <Cell>{clientName(i.client_id)}</Cell>
                <Cell>{formatINR(i.total_amount)}</Cell>
                <Cell>{formatINR(i.amount_pending)}</Cell>
                <Cell>
                  <StatusPill status={i.status} />
                </Cell>
                <Cell className="text-ink-40">{i.gst_status}</Cell>
                <Cell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicate(i.id);
                    }}
                    className="text-ink-40 transition-colors hover:text-foreground"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </Cell>
              </Row>
            ))}
          </Table>
        ) : (
          <Empty message={loading ? "Loading invoices…" : "No invoices yet."} />
        )}
      </div>

      <CreateInvoice open={createOpen} onOpenChange={setCreateOpen} clients={clients ?? []} onSaved={refetch} />
      {active && (
        <InvoiceDetail
          invoice={active}
          clientName={clientName(active.client_id)}
          onClose={() => setActive(null)}
          onChanged={async () => {
            await openDetail(active.id);
            refetch();
          }}
        />
      )}
    </PortalShell>
  );
}

function CreateInvoice({
  open,
  onOpenChange,
  clients,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clients: Client[];
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [taxable, setTaxable] = useState(100000);
  const [rate, setRate] = useState(18);
  const [interstate, setInterstate] = useState(false);

  const gst = +(taxable * rate / 100).toFixed(2);
  const total = +(taxable + gst).toFixed(2);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/invoices", {
        client_id: Number(fd.get("client_id")),
        invoice_date: fd.get("invoice_date"),
        due_date: fd.get("due_date") || null,
        service_description: fd.get("service_description"),
        taxable_value: Number(fd.get("taxable_value")),
        gst_rate: Number(fd.get("gst_rate")),
        is_interstate: interstate,
        tds_applicable: fd.get("tds_applicable") === "on",
        tds_rate: Number(fd.get("tds_rate") || 0),
        status: fd.get("status"),
      });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create invoice" description="GST is calculated automatically.">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Client">
          <Select
            name="client_id"
            required
            placeholder="Select client"
            defaultValue={clients[0] ? String(clients[0].id) : undefined}
            options={clients.map((c) => ({ value: String(c.id), label: c.business_name }))}
          />
        </Field>
        <Field label="Status">
          <Select
            name="status"
            defaultValue="Sent"
            options={[
              { value: "Draft", label: "Draft" },
              { value: "Sent", label: "Sent" },
              { value: "Pending", label: "Pending" },
            ]}
          />
        </Field>
        <Field label="Invoice date">
          <input name="invoice_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
        </Field>
        <Field label="Due date">
          <input name="due_date" type="date" className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Service description">
            <input name="service_description" className={inputClass} />
          </Field>
        </div>
        <Field label="Taxable value (₹)">
          <input
            name="taxable_value"
            type="number"
            step="0.01"
            value={taxable}
            onChange={(e) => setTaxable(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="GST rate (%)">
          <input name="gst_rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="TDS rate (%)">
          <input name="tds_rate" type="number" step="0.01" defaultValue={0} className={inputClass} />
        </Field>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm font-light text-secondary">
            <input type="checkbox" name="tds_applicable" className="accent-foreground" /> TDS applicable
          </label>
          <label className="flex items-center gap-2 text-sm font-light text-secondary">
            <input type="checkbox" checked={interstate} onChange={(e) => setInterstate(e.target.checked)} className="accent-foreground" /> Inter-state (IGST)
          </label>
        </div>

        {/* Live GST preview */}
        <div className="sm:col-span-2 grid grid-cols-3 gap-3 rounded-2xl border border-line bg-mist/50 p-4 text-center text-sm">
          <div>
            <p className="text-xs text-ink-40">GST {interstate ? "(IGST)" : "(CGST+SGST)"}</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(gst)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">Taxable</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(taxable)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">Total</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(total)}</p>
          </div>
        </div>

        {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
        <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" magnetic={false} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" magnetic={false} disabled={saving}>
            {saving ? "Saving…" : "Create invoice"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function InvoiceDetail({
  invoice,
  clientName,
  onClose,
  onChanged,
}: {
  invoice: Invoice;
  clientName: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canPay = !["Draft", "Cancelled", "Fully Paid"].includes(invoice.status);

  async function recordPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post(`/invoices/${invoice.id}/payments`, {
        amount: Number(fd.get("amount")),
        payment_date: fd.get("payment_date"),
        bank_reference: fd.get("bank_reference"),
        payment_mode: fd.get("payment_mode"),
        tds_deducted: Number(fd.get("tds_deducted") || 0),
        remarks: fd.get("remarks"),
      });
      (e.target as HTMLFormElement).reset();
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to record payment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onOpenChange={(v) => !v && onClose()} title={invoice.invoice_number} description={clientName}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={invoice.status} />
          {invoice.is_locked && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs text-secondary">
              <Lock className="h-3 w-3" /> Locked since {invoice.locked_at ? formatDate(invoice.locked_at) : "payment"}
            </span>
          )}
        </div>

        {/* Financials */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Taxable", formatINR(invoice.taxable_value)],
            [`GST ${invoice.gst_rate}%`, formatINR(invoice.gst_amount)],
            ["Total", formatINR(invoice.total_amount)],
            ["Pending", formatINR(invoice.amount_pending)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-line bg-white/50 p-4">
              <p className="text-xs text-ink-40">{k}</p>
              <p className="mt-1 text-sm font-medium tabular-nums">{v}</p>
            </div>
          ))}
        </div>

        {/* Payments */}
        <div>
          <p className="mb-2 text-xs tracking-eyebrow text-secondary">Payments received</p>
          {invoice.payments && invoice.payments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {invoice.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-line bg-white/50 px-4 py-2.5 text-sm">
                  <span className="font-medium tabular-nums">{formatINR(p.amount)}</span>
                  <span className="text-ink-40">{p.payment_mode} · {p.bank_reference ?? "—"}</span>
                  <span className="text-ink-40">{formatDate(p.payment_date)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-40">No payments recorded yet.</p>
          )}
        </div>

        {/* Record payment */}
        {canPay && (
          <Panel className="!rounded-2xl">
            <p className="mb-4 text-sm font-medium">Record a payment</p>
            <form onSubmit={recordPayment} className="grid grid-cols-2 gap-3">
              <Field label="Amount (₹)">
                <input name="amount" type="number" step="0.01" required className={inputClass} />
              </Field>
              <Field label="Date">
                <input name="payment_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
              </Field>
              <Field label="Bank reference / UTR">
                <input name="bank_reference" className={inputClass} />
              </Field>
              <Field label="Mode">
                <Select
                  name="payment_mode"
                  defaultValue="NEFT"
                  options={["NEFT", "RTGS", "IMPS", "UPI", "Cheque", "Cash", "Other"].map((m) => ({ value: m, label: m }))}
                />
              </Field>
              <Field label="TDS deducted (₹)">
                <input name="tds_deducted" type="number" step="0.01" defaultValue={0} className={inputClass} />
              </Field>
              <Field label="Remarks">
                <input name="remarks" className={inputClass} />
              </Field>
              {error && <p className="col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
              <div className="col-span-2 flex justify-end">
                <Button type="submit" size="sm" magnetic={false} disabled={saving}>
                  {saving ? "Recording…" : "Record payment (locks invoice)"}
                </Button>
              </div>
            </form>
          </Panel>
        )}
      </div>
    </Modal>
  );
}
