"use client";

import { useState } from "react";
import { Plus, BadgeCheck } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { PageHeading, Table, Row, Cell, Empty, Field, inputClass, StatusPill } from "@/components/portal/ui";
import { Modal } from "@/components/portal/Modal";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@/lib/auth";
import { api, ApiError, type Vendor } from "@/lib/api";

export default function VendorsPage() {
  const { data, loading, refetch } = useApi<Vendor[]>("/vendors");
  const { hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canManage = hasRole("ADMIN_CEO", "CFO", "FINANCE_MANAGER");

  async function verify(id: number) {
    setBusy(id);
    setErr(null);
    try {
      await api.post(`/vendors/${id}/verify`);
      refetch();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not verify");
    } finally {
      setBusy(null);
    }
  }

  return (
    <PortalShell>
      <div className="flex flex-col gap-8">
        <PageHeading
          title="Vendors"
          description="Onboarding is complete only when tax and bank details are verified."
          action={
            <Button size="sm" magnetic={false} onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> New vendor
            </Button>
          }
        />

        {err && <p className="text-sm text-foreground/80">⚠ {err}</p>}

        {data && data.length > 0 ? (
          <Table head={["Vendor", "GST / PAN", "Bank", "Status", ""]}>
            {data.map((v) => (
              <Row key={v.id}>
                <Cell className="font-medium">
                  {v.business_name}
                  <span className="block text-xs text-ink-40">{v.email}</span>
                </Cell>
                <Cell className="text-ink-40">
                  {v.gst_number ?? "—"}
                  <span className="block">{v.pan ?? ""}</span>
                </Cell>
                <Cell className="text-ink-40">{v.bank_name ?? "—"}</Cell>
                <Cell>
                  <StatusPill status={v.is_verified ? "Verified" : v.approval_status} />
                </Cell>
                <Cell>
                  {!v.is_verified && canManage && (
                    <button
                      onClick={() => verify(v.id)}
                      disabled={busy === v.id}
                      className="inline-flex items-center gap-1.5 text-xs text-secondary transition-colors hover:text-foreground"
                    >
                      <BadgeCheck className="h-4 w-4" /> Verify
                    </button>
                  )}
                </Cell>
              </Row>
            ))}
          </Table>
        ) : (
          <Empty message={loading ? "Loading vendors…" : "No vendors yet."} />
        )}
      </div>

      <VendorForm open={open} onOpenChange={setOpen} onSaved={refetch} />
    </PortalShell>
  );
}

function VendorForm({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd);
    body.tax_applicable = (fd.get("tax_applicable") === "on") as unknown as string;
    try {
      await api.post("/vendors", { ...body, tax_applicable: fd.get("tax_applicable") === "on" });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Onboard a vendor" description="Capture tax, bank and compliance details.">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Business name">
          <input name="business_name" required className={inputClass} />
        </Field>
        <Field label="Contact person">
          <input name="contact_person" className={inputClass} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label="Phone">
          <input name="phone" className={inputClass} />
        </Field>
        <Field label="GST number">
          <input name="gst_number" className={inputClass} />
        </Field>
        <Field label="PAN">
          <input name="pan" className={inputClass} />
        </Field>
        <Field label="Bank account holder">
          <input name="bank_account_holder" className={inputClass} />
        </Field>
        <Field label="Bank name">
          <input name="bank_name" className={inputClass} />
        </Field>
        <Field label="Account number">
          <input name="account_number" className={inputClass} />
        </Field>
        <Field label="IFSC code">
          <input name="ifsc_code" className={inputClass} />
        </Field>
        {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
        <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" magnetic={false} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" magnetic={false} disabled={saving}>
            {saving ? "Saving…" : "Save vendor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
