"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { PageHeading, Table, Row, Cell, Empty, Field, inputClass } from "@/components/portal/ui";
import { Modal } from "@/components/portal/Modal";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/lib/useApi";
import { api, ApiError, type Client } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function ClientsPage() {
  const { data, loading, refetch } = useApi<Client[]>("/clients");
  const [open, setOpen] = useState(false);

  return (
    <PortalShell>
      <div className="flex flex-col gap-8">
        <PageHeading
          title="Clients"
          description="Onboarded businesses available for invoicing, taxation and reporting."
          action={
            <Button size="sm" magnetic={false} onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> New client
            </Button>
          }
        />

        {data && data.length > 0 ? (
          <Table head={["Business", "Email", "GST", "Category", "Onboarded"]}>
            {data.map((c) => (
              <Row key={c.id}>
                <Cell className="font-medium">
                  {c.business_name}
                  {c.legal_name && <span className="block text-xs text-ink-40">{c.legal_name}</span>}
                </Cell>
                <Cell>{c.email}</Cell>
                <Cell className="text-ink-40">{c.gst_number ?? "—"}</Cell>
                <Cell>{c.category ?? "—"}</Cell>
                <Cell className="text-ink-40">{formatDate(c.created_at)}</Cell>
              </Row>
            ))}
          </Table>
        ) : (
          <Empty message={loading ? "Loading clients…" : "No clients yet. Add your first."} />
        )}
      </div>

      <ClientForm open={open} onOpenChange={setOpen} onSaved={refetch} />
    </PortalShell>
  );
}

function ClientForm({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
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
      await api.post("/clients", Object.fromEntries(fd));
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Onboard a client" description="Capture the client intake details.">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Business name">
          <input name="business_name" required className={inputClass} />
        </Field>
        <Field label="Registered legal name">
          <input name="legal_name" className={inputClass} />
        </Field>
        <Field label="Official email">
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label="Phone">
          <input name="phone" className={inputClass} />
        </Field>
        <Field label="GST number">
          <input name="gst_number" className={inputClass} />
        </Field>
        <Field label="COI">
          <input name="coi" className={inputClass} />
        </Field>
        <Field label="Category">
          <input name="category" placeholder="Enterprise / Mid-market / Startup" className={inputClass} />
        </Field>
        <Field label="Billing address">
          <input name="billing_address" className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes / special instructions">
            <textarea name="notes" rows={2} className={inputClass + " h-auto py-2.5"} />
          </Field>
        </div>
        {error && <p className="sm:col-span-2 text-sm text-foreground/80">⚠ {error}</p>}
        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" magnetic={false} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" magnetic={false} disabled={saving}>
            {saving ? "Saving…" : "Save client"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
