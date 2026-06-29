"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Handshake } from "lucide-react";
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
} from "@/components/portal/ui";
import { useApi } from "@/lib/useApi";
import { fadeUp, stagger } from "@/lib/motion";
import { formatINR, formatDate } from "@/lib/utils";
import type { Agent, Client, Invoice } from "@/lib/api";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: agent, loading } = useApi<Agent>(id ? `/agents/${id}` : null);
  const { data: allClients } = useApi<Client[]>("/clients");
  const { data: invoices } = useApi<Invoice[]>(id ? `/invoices?agent_id=${id}` : null);

  const clients = (allClients ?? []).filter((c) => c.agent_id === Number(id));
  const rows = invoices ?? [];
  const totalInvoiced = rows.reduce((s, i) => s + i.total_amount, 0);
  const taxableTotal = rows.reduce((s, i) => s + i.taxable_value, 0);
  const commission = +(taxableTotal * (agent?.commission_rate ?? 0) / 100).toFixed(2);

  const clientName = (cid: number) => clients.find((c) => c.id === cid)?.business_name ?? `Client #${cid}`;

  if (!loading && !agent) {
    return (
      <PortalShell>
        <Empty message="Agent not found." />
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <motion.div className="flex flex-col gap-8" initial="hidden" animate="show" variants={stagger(0.08, 0.04)}>
        <motion.button
          variants={fadeUp}
          onClick={() => router.push("/portal/agents")}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All agents
        </motion.button>

        {/* Identity header */}
        <motion.div variants={fadeUp} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="metallic flex h-16 w-16 items-center justify-center rounded-2xl">
              <Handshake className="h-6 w-6 text-foreground/70" />
            </span>
            <div>
              <h1 className="font-sans text-4xl font-bold leading-[0.95] tracking-[-0.04em]">
                {agent?.business_name ?? "…"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-secondary">
                {agent?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {agent.email}
                  </span>
                )}
                {agent?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {agent.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          {agent && <StatusPill status={agent.is_active ? "Active" : "Inactive"} />}
        </motion.div>

        {/* KPIs */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Clients introduced" value={clients.length} sub="Referred businesses" spark={clients.map((_, i) => i + 1).slice(-9)} />
          <MetricCard label="Invoices" value={rows.length} sub="Raised for their clients" spark={rows.map((i) => i.total_amount).slice(-9)} />
          <MetricCard label="Total invoiced" value={formatINR(totalInvoiced)} sub="Gross billed" spark={rows.map((i) => i.total_amount).slice(-9)} />
          <MetricCard label="Commission earned" value={formatINR(commission)} sub={`At ${agent?.commission_rate ?? 0}% of taxable`} spark={rows.map((i) => i.taxable_value).slice(-9)} />
        </motion.div>

        {/* Profile */}
        <motion.div variants={fadeUp}>
          <Panel>
            <h2 className="mb-5 text-sm font-medium tracking-eyebrow text-secondary">Agent details</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <DataField label="Registered legal name" value={agent?.legal_name} />
              <DataField label="Contact person" value={agent?.contact_person} />
              <DataField label="Commission rate" value={agent ? `${agent.commission_rate}%` : null} />
              <DataField label="GST number" value={agent?.gst_number} mono />
              <DataField label="PAN" value={agent?.pan} mono />
              <DataField label="Onboarded" value={agent ? formatDate(agent.created_at) : null} />
              <DataField label="Bank account holder" value={agent?.bank_account_holder} />
              <DataField label="Bank name" value={agent?.bank_name} />
              <DataField label="Account number" value={agent?.account_number} mono />
              <DataField label="IFSC code" value={agent?.ifsc_code} mono />
              <DataField label="Address" value={agent?.address} className="sm:col-span-2 lg:col-span-2" />
              <DataField label="Notes" value={agent?.notes} className="sm:col-span-2 lg:col-span-3" />
            </div>
          </Panel>
        </motion.div>

        {/* Referred clients */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-sm font-medium tracking-eyebrow text-secondary">Referred clients</h2>
          {clients.length > 0 ? (
            <Table head={["Business", "Email", "GST", "Category"]}>
              {clients.map((c) => (
                <Row key={c.id} onClick={() => router.push(`/portal/clients/${c.id}`)}>
                  <Cell className="font-medium">{c.business_name}</Cell>
                  <Cell>{c.email}</Cell>
                  <Cell className="text-ink-40">{c.gst_number ?? "—"}</Cell>
                  <Cell>{c.category ?? "—"}</Cell>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty message="No clients linked to this agent yet." />
          )}
        </motion.div>

        {/* Agent invoices */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h2 className="text-sm font-medium tracking-eyebrow text-secondary">Invoices</h2>
          {rows.length > 0 ? (
            <Table head={["Invoice", "Client", "Date", "Total", "Status"]}>
              {rows.map((inv) => (
                <Row key={inv.id} onClick={() => router.push(`/portal/invoices/${inv.id}`)}>
                  <Cell className="font-medium">{inv.invoice_number}</Cell>
                  <Cell>{clientName(inv.client_id)}</Cell>
                  <Cell className="text-ink-40">{formatDate(inv.invoice_date)}</Cell>
                  <Cell className="tabular-nums">{formatINR(inv.total_amount)}</Cell>
                  <Cell>
                    <StatusPill status={inv.status} />
                  </Cell>
                </Row>
              ))}
            </Table>
          ) : (
            <Empty message="No invoices credited to this agent yet." />
          )}
        </motion.div>
      </motion.div>
    </PortalShell>
  );
}
