"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Lock, Copy, Search } from "lucide-react";
import { Table, Row, Cell, Empty, Field, inputClass, StatusPill } from "@/components/portal/ui";
import { Modal } from "@/components/portal/Modal";
import { Select } from "@/components/portal/Select";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/lib/useApi";
import { api, ApiError, type Invoice, type Client, type Agent } from "@/lib/api";
import { formatINR } from "@/lib/utils";

const STATUSES = [
  "Draft", "Sent", "Pending", "Partially Paid", "Fully Paid", "Overdue", "Cancelled", "Disputed", "Reconciled",
];

/** The "Overview" tab — the full client-invoice list with search, filters and creation. */
export function OverviewTab() {
  const { data: clients } = useApi<Client[]>("/clients");
  const { data: agents } = useApi<Agent[]>("/agents");
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  // Spec: search invoices by client, number/description, status.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [clientId, setClientId] = useState("all");

  const path = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim()) p.set("search", search.trim());
    if (status !== "all") p.set("status", status);
    if (clientId !== "all") p.set("client_id", clientId);
    const qs = p.toString();
    return `/invoices${qs ? `?${qs}` : ""}`;
  }, [search, status, clientId]);

  const { data, loading, refetch } = useApi<Invoice[]>(path);

  const clientName = (id: number) => clients?.find((c) => c.id === id)?.business_name ?? `Client #${id}`;

  async function duplicate(id: number) {
    await api.post(`/invoices/${id}/duplicate`);
    refetch();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filters + create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number, amount or description…"
            className={inputClass + " pl-10"}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            value={clientId}
            onValueChange={setClientId}
            className="min-w-[160px] flex-1 sm:flex-none"
            options={[{ value: "all", label: "All clients" }, ...(clients ?? []).map((c) => ({ value: String(c.id), label: c.business_name }))]}
          />
          <Select
            value={status}
            onValueChange={setStatus}
            className="min-w-[150px] flex-1 sm:flex-none"
            options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
          />
          <Button size="sm" magnetic={false} onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        </div>
      </div>

      {data && data.length > 0 ? (
        <Table head={["Invoice", "Client", "Total", "Pending", "Status", "GST", ""]}>
          {data.map((i) => (
            <Row key={i.id} onClick={() => router.push(`/portal/invoices/${i.id}`)}>
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
        <Empty message={loading ? "Loading invoices…" : "No invoices match these filters."} />
      )}

      <CreateInvoice open={createOpen} onOpenChange={setCreateOpen} clients={clients ?? []} agents={agents ?? []} onSaved={refetch} />
    </div>
  );
}

function CreateInvoice({
  open,
  onOpenChange,
  clients,
  agents,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clients: Client[];
  agents: Agent[];
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [taxable, setTaxable] = useState(100000);
  const [rate, setRate] = useState(18);
  const [interstate, setInterstate] = useState(false);
  const [agentId, setAgentId] = useState("none");

  const gst = +(taxable * rate / 100).toFixed(2);
  const total = +(taxable + gst).toFixed(2);
  const half = +(gst / 2).toFixed(2);

  // When an agent is chosen, narrow the client list to that agent's clients.
  const visibleClients = agentId === "none" ? clients : clients.filter((c) => c.agent_id === Number(agentId));

  // Reference: the selected agent's existing invoices (across all their clients).
  const { data: agentInvoices } = useApi<Invoice[]>(agentId === "none" ? null : `/invoices?agent_id=${agentId}`);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/invoices", {
        client_id: Number(fd.get("client_id")),
        agent_id: agentId !== "none" ? Number(agentId) : null,
        invoice_date: fd.get("invoice_date"),
        due_date: fd.get("due_date") || null,
        service_description: fd.get("service_description"),
        taxable_value: Number(fd.get("taxable_value")),
        gst_rate: Number(fd.get("gst_rate")),
        is_interstate: interstate,
        tds_applicable: fd.get("tds_applicable") === "on",
        tds_rate: Number(fd.get("tds_rate") || 0),
        status: fd.get("status"),
        supporting_document: fd.get("supporting_document") || null,
        internal_remarks: fd.get("internal_remarks") || null,
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
        <Field label="Agent (optional)">
          <Select
            value={agentId}
            onValueChange={setAgentId}
            placeholder="No agent"
            options={[
              { value: "none", label: "— No agent —" },
              ...agents.map((a) => ({ value: String(a.id), label: `${a.business_name} · ${a.commission_rate}%` })),
            ]}
          />
        </Field>
        <Field label="Client">
          <Select
            name="client_id"
            required
            placeholder="Select client"
            // key forces a remount so the default updates when the agent filter changes
            key={agentId}
            defaultValue={visibleClients[0] ? String(visibleClients[0].id) : undefined}
            options={visibleClients.map((c) => ({ value: String(c.id), label: c.business_name }))}
          />
        </Field>

        {/* Reference: the chosen agent's existing invoices */}
        {agentId !== "none" && (
          <div className="sm:col-span-2 rounded-2xl border border-line bg-mist/40 p-4">
            <p className="mb-2 text-xs tracking-eyebrow text-secondary">
              This agent&apos;s invoices ({agentInvoices?.length ?? 0})
            </p>
            {agentInvoices && agentInvoices.length > 0 ? (
              <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
                {agentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 text-xs">
                    <span className="font-medium">{inv.invoice_number}</span>
                    <span className="tabular-nums text-ink-40">{formatINR(inv.total_amount)}</span>
                    <span className="text-ink-40">{inv.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-40">No invoices for this agent yet.</p>
            )}
          </div>
        )}
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
        <div className="sm:col-span-2">
          <Field label="Supporting document (reference / link)">
            <input name="supporting_document" className={inputClass} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Internal remarks">
            <input name="internal_remarks" className={inputClass} />
          </Field>
        </div>

        {/* Live GST preview with CGST/SGST/IGST split */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-mist/50 p-4 text-center text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-ink-40">Taxable</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(taxable)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">{interstate ? "IGST" : "CGST + SGST"}</p>
            <p className="mt-1 font-medium tabular-nums">{interstate ? formatINR(gst) : `${formatINR(half)} × 2`}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">GST total</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(gst)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">Invoice total</p>
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
