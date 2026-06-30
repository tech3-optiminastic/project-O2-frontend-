"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Package, BadgeCheck, Plus } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import {
  Panel,
  MetricCard,
  Table,
  Row,
  Cell,
  Empty,
  StatusPill,
  DataField,
  Field,
  inputClass,
} from "@/components/portal/ui";
import { Modal } from "@/components/portal/Modal";
import { Select } from "@/components/portal/Select";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@/lib/auth";
import { fadeUp, stagger } from "@/lib/motion";
import { formatINR, formatDate } from "@/lib/utils";
import { api, ApiError, type Vendor, type VendorInvoice, type Allocation, type Client } from "@/lib/api";

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { hasRole } = useAuth();
  const vid = Number(id);

  const { data: vendor, loading, refetch } = useApi<Vendor>(id ? `/vendors/${id}` : null);
  const { data: allInvoices, refetch: refetchInvoices } = useApi<VendorInvoice[]>("/vendors/invoices/all");
  const { data: allAllocations, refetch: refetchAllocations } = useApi<Allocation[]>("/vendors/allocations/all");
  const { data: clients } = useApi<Client[]>("/clients");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [allocOpen, setAllocOpen] = useState(false);
  const [invOpen, setInvOpen] = useState(false);

  const canManage = hasRole("ADMIN_CEO", "CFO", "FINANCE_MANAGER");
  const canAddInvoice = hasRole("ADMIN_CEO", "CFO", "FINANCE_MANAGER", "FINANCE_EXECUTIVE");
  const invoices = (allInvoices ?? []).filter((i) => i.vendor_id === vid);
  const allocations = (allAllocations ?? []).filter((a) => a.vendor_id === vid);

  const payable = invoices.reduce((s, i) => s + i.net_payable, 0);
  const tds = invoices.reduce((s, i) => s + i.tds_amount, 0);
  const contracted = allocations.reduce((s, a) => s + a.agreed_cost, 0);

  async function verify() {
    setBusy(true);
    setErr(null);
    try {
      await api.post(`/vendors/${id}/verify`);
      refetch();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not verify");
    } finally {
      setBusy(false);
    }
  }

  if (!loading && !vendor) {
    return (
      <PortalShell>
        <Empty message="Vendor not found." />
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <motion.div className="flex flex-col gap-8" initial="hidden" animate="show" variants={stagger(0.08, 0.04)}>
        <motion.button
          variants={fadeUp}
          onClick={() => router.push("/portal/vendors")}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All vendors
        </motion.button>

        {/* Identity header */}
        <motion.div variants={fadeUp} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="metallic flex h-16 w-16 items-center justify-center rounded-2xl">
              <Package className="h-6 w-6 text-foreground/70" />
            </span>
            <div>
              <h1 className="font-sans text-4xl font-bold leading-[0.95] tracking-[-0.04em]">
                {vendor?.business_name ?? "…"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-secondary">
                {vendor?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {vendor.email}
                  </span>
                )}
                {vendor?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {vendor.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={vendor?.is_verified ? "Verified" : vendor?.approval_status ?? "Pending"} />
            {vendor && !vendor.is_verified && canManage && (
              <Button size="sm" magnetic={false} onClick={verify} disabled={busy}>
                <BadgeCheck className="h-4 w-4" /> {busy ? "Verifying…" : "Verify"}
              </Button>
            )}
          </div>
        </motion.div>

        {err && <p className="text-sm text-foreground/80">⚠ {err}</p>}

        {/* KPIs */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Net payable" value={formatINR(payable)} sub={`${invoices.length} invoices`} spark={invoices.map((i) => i.net_payable).slice(-9)} />
          <MetricCard label="TDS deducted" value={formatINR(tds)} sub="Withheld at source" spark={invoices.map((i) => i.tds_amount).slice(-9)} />
          <MetricCard label="Contracted" value={formatINR(contracted)} sub={`${allocations.length} allocations`} spark={allocations.map((a) => a.agreed_cost).slice(-9)} />
          <MetricCard label="Onboarding" value={vendor?.is_verified ? "Verified" : "Pending"} sub={vendor ? formatDate(vendor.created_at) : ""} spark={[3, 5, 4, 6, 5, 7, 6, 8, vendor?.is_verified ? 10 : 5]} />
        </motion.div>

        {/* Tax + bank + compliance */}
        <motion.div variants={fadeUp}>
          <Panel>
            <h2 className="mb-5 text-sm font-medium tracking-eyebrow text-secondary">Tax, bank &amp; compliance</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <DataField label="Contact person" value={vendor?.contact_person} />
              <DataField label="GST number" value={vendor?.gst_number} mono />
              <DataField label="PAN" value={vendor?.pan} mono />
              <DataField label="Bank account holder" value={vendor?.bank_account_holder} />
              <DataField label="Bank name" value={vendor?.bank_name} />
              <DataField label="Account number" value={vendor?.account_number} mono />
              <DataField label="IFSC code" value={vendor?.ifsc_code} mono />
              <DataField label="Tax applicable" value={vendor ? (vendor.tax_applicable ? "Yes" : "No") : null} />
              <DataField label="Annual service contract" value={vendor?.annual_service_contract} />
              <DataField label="Address" value={vendor?.address} className="sm:col-span-2 lg:col-span-1" />
              <DataField label="Compliance documents" value={vendor?.compliance_documents} className="sm:col-span-2 lg:col-span-2" />
            </div>
          </Panel>
        </motion.div>

        {/* Allocations */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-eyebrow text-secondary">Project allocations</h2>
            {canManage && (
              <Button size="sm" variant="secondary" magnetic={false} onClick={() => setAllocOpen(true)}>
                <Plus className="h-4 w-4" /> Allocate
              </Button>
            )}
          </div>
          {allocations.length > 0 ? (
            <Table head={["Project", "Agreed cost", "Margin", "Owner", "Status"]}>
              {allocations.map((a) => (
                <Row key={a.id}>
                  <Cell className="font-medium">{a.project_name}</Cell>
                  <Cell className="tabular-nums">{formatINR(a.agreed_cost)}</Cell>
                  <Cell className="tabular-nums text-ink-40">{formatINR(a.vendor_margin)}</Cell>
                  <Cell className="text-ink-40">{a.internal_owner ?? "—"}</Cell>
                  <Cell>
                    <StatusPill status={a.status} />
                  </Cell>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty message="No project allocations yet." />
          )}
        </motion.div>

        {/* Vendor invoices */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-eyebrow text-secondary">Vendor invoices</h2>
            {canAddInvoice && (
              <Button size="sm" variant="secondary" magnetic={false} onClick={() => setInvOpen(true)}>
                <Plus className="h-4 w-4" /> New invoice
              </Button>
            )}
          </div>
          {invoices.length > 0 ? (
            <Table head={["Invoice", "Date", "Amount", "TDS", "Net payable", "Status"]}>
              {invoices.map((inv) => (
                <Row key={inv.id}>
                  <Cell className="font-medium">{inv.invoice_number}</Cell>
                  <Cell className="text-ink-40">{formatDate(inv.invoice_date)}</Cell>
                  <Cell className="tabular-nums">{formatINR(inv.invoice_amount)}</Cell>
                  <Cell className="tabular-nums text-ink-40">{formatINR(inv.tds_amount)}</Cell>
                  <Cell className="tabular-nums">{formatINR(inv.net_payable)}</Cell>
                  <Cell>
                    <StatusPill status={inv.status} />
                  </Cell>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty message="No vendor invoices yet." />
          )}
        </motion.div>
      </motion.div>

      <AllocationForm
        open={allocOpen}
        onOpenChange={setAllocOpen}
        vendorId={vid}
        clients={clients ?? []}
        onSaved={refetchAllocations}
      />
      <VendorInvoiceForm
        open={invOpen}
        onOpenChange={setInvOpen}
        vendorId={vid}
        allocations={allocations}
        onSaved={refetchInvoices}
      />
    </PortalShell>
  );
}

function AllocationForm({
  open,
  onOpenChange,
  vendorId,
  clients,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  vendorId: number;
  clients: Client[];
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/vendors/allocations", {
        vendor_id: vendorId,
        client_id: fd.get("client_id") && fd.get("client_id") !== "none" ? Number(fd.get("client_id")) : null,
        project_name: fd.get("project_name"),
        scope_of_work: fd.get("scope_of_work") || null,
        agreed_cost: Number(fd.get("agreed_cost") || 0),
        vendor_margin: Number(fd.get("vendor_margin") || 0),
        allocation_percent: Number(fd.get("allocation_percent") || 100),
        start_date: fd.get("start_date") || null,
        end_date: fd.get("end_date") || null,
        expected_report_date: fd.get("expected_report_date") || null,
        internal_owner: fd.get("internal_owner") || null,
        status: fd.get("status"),
      });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save allocation");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Allocate vendor to project" description="Link this vendor to a client deliverable, with cost and margin.">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Project name">
          <input name="project_name" required className={inputClass} />
        </Field>
        <Field label="Client (optional)">
          <Select
            name="client_id"
            defaultValue="none"
            options={[{ value: "none", label: "— None —" }, ...clients.map((c) => ({ value: String(c.id), label: c.business_name }))]}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Scope of work">
            <input name="scope_of_work" className={inputClass} />
          </Field>
        </div>
        <Field label="Agreed cost (₹)">
          <input name="agreed_cost" type="number" step="0.01" defaultValue={0} className={inputClass} />
        </Field>
        <Field label="Vendor margin (%)">
          <input name="vendor_margin" type="number" step="0.01" defaultValue={0} className={inputClass} />
        </Field>
        <Field label="Allocation (% of work)">
          <input name="allocation_percent" type="number" step="1" defaultValue={100} className={inputClass} />
        </Field>
        <Field label="Internal project owner">
          <input name="internal_owner" className={inputClass} />
        </Field>
        <Field label="Start date">
          <input name="start_date" type="date" className={inputClass} />
        </Field>
        <Field label="End date">
          <input name="end_date" type="date" className={inputClass} />
        </Field>
        <Field label="Expected report date">
          <input name="expected_report_date" type="date" className={inputClass} />
        </Field>
        <Field label="Status of work">
          <Select
            name="status"
            defaultValue="Not Started"
            options={["Not Started", "In Progress", "Report Due", "Completed", "On Hold"].map((s) => ({ value: s, label: s }))}
          />
        </Field>
        {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
        <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" magnetic={false} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" magnetic={false} disabled={saving}>{saving ? "Saving…" : "Save allocation"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function VendorInvoiceForm({
  open,
  onOpenChange,
  vendorId,
  allocations,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  vendorId: number;
  allocations: Allocation[];
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [amount, setAmount] = useState(0);
  const [gst, setGst] = useState(0);
  const [tdsRate, setTdsRate] = useState(2);

  const tds = +((amount * tdsRate) / 100).toFixed(2);
  const net = +(amount + gst - tds).toFixed(2);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/vendors/invoices", {
        vendor_id: vendorId,
        allocation_id: fd.get("allocation_id") && fd.get("allocation_id") !== "none" ? Number(fd.get("allocation_id")) : null,
        invoice_number: fd.get("invoice_number"),
        invoice_date: fd.get("invoice_date"),
        invoice_amount: Number(fd.get("invoice_amount") || 0),
        gst_amount: Number(fd.get("gst_amount") || 0),
        tds_applicable: fd.get("tds_applicable") === "on",
        tds_rate: Number(fd.get("tds_rate") || 0),
      });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save invoice");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Record vendor invoice" description="Net payable is computed as amount + GST − TDS.">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Invoice number">
          <input name="invoice_number" required className={inputClass} />
        </Field>
        <Field label="Invoice date">
          <input name="invoice_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
        </Field>
        <Field label="Project allocation (optional)">
          <Select
            name="allocation_id"
            defaultValue="none"
            options={[{ value: "none", label: "— None —" }, ...allocations.map((a) => ({ value: String(a.id), label: a.project_name }))]}
          />
        </Field>
        <Field label="Invoice amount (₹)">
          <input name="invoice_amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="GST amount (₹)">
          <input name="gst_amount" type="number" step="0.01" value={gst} onChange={(e) => setGst(Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="TDS rate (%)">
          <input name="tds_rate" type="number" step="0.01" value={tdsRate} onChange={(e) => setTdsRate(Number(e.target.value))} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-light text-secondary sm:col-span-2">
          <input type="checkbox" name="tds_applicable" defaultChecked className="accent-foreground" /> TDS applicable
        </label>

        <div className="sm:col-span-2 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-mist/50 p-4 text-center text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-ink-40">TDS</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(tds)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">GST</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(gst)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-40">Net payable</p>
            <p className="mt-1 font-medium tabular-nums">{formatINR(net)}</p>
          </div>
        </div>

        {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
        <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" magnetic={false} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" magnetic={false} disabled={saving}>{saving ? "Saving…" : "Save invoice"}</Button>
        </div>
      </form>
    </Modal>
  );
}
