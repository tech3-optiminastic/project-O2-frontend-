/** Typed client for the Project O2 FastAPI backend. */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8009/api";

/** Only emails on this domain may sign up or be invited (mirrors backend WORKSPACE_EMAIL_DOMAIN). */
export const WORKSPACE_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_WORKSPACE_EMAIL_DOMAIN ?? "optiminastic.com";

/** True if the email belongs to the workspace domain. */
export function isWorkspaceEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@" + WORKSPACE_EMAIL_DOMAIN.toLowerCase());
}

const TOKEN_KEY = "o2_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail =
      (data && (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))) ||
      res.statusText;
    throw new ApiError(res.status, detail);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  async login(email: string, password: string) {
    const form = new URLSearchParams({ username: email, password });
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new ApiError(res.status, d.detail ?? "Login failed");
    }
    return (await res.json()) as { access_token: string; token_type: string };
  },

  uploadStatement(file: File, bankName: string, accountNumber: string) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bank_name", bankName);
    fd.append("account_number", accountNumber);
    return request<BankStatementDetail>("/verification/statements", { method: "POST", body: fd });
  },
};

/* ----------------------------- Types ----------------------------- */

export type Role = "ADMIN_CEO" | "CFO" | "FINANCE_MANAGER" | "FINANCE_EXECUTIVE";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
}

export interface SignupAvailability {
  available: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export type InvitationStatus = "Pending" | "Accepted" | "Revoked";

export interface Invitation {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  expires_at: string;
  accepted_at?: string | null;
  created_at: string;
  accept_url?: string | null;
  email_sent?: boolean | null;
}

export interface InvitePreview {
  name: string;
  email: string;
  role: Role;
  valid: boolean;
}

export interface DashboardSummary {
  total_clients: number;
  total_vendors: number;
  total_invoices: number;
  net_receivable: number;
  net_payable: number;
  pending_approvals: number;
  gst_pending: number;
  reconciliation_rate: number;
  recent_invoices: RecentInvoice[];
  approvals_queue: ApprovalQueueItem[];
  cashflow: { label: string; value: number }[];
}

export interface RecentInvoice {
  id: number;
  invoice_number: string;
  client_id: number;
  total_amount: number;
  amount_pending: number;
  status: string;
  is_locked: boolean;
}

export interface ApprovalQueueItem {
  id: number;
  payee_name: string;
  amount: number;
  net_payable: number;
  status: string;
}

export interface Agent {
  id: number;
  business_name: string;
  legal_name?: string | null;
  contact_person?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  gst_number?: string | null;
  pan?: string | null;
  bank_account_holder?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  commission_rate: number;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
}

export interface Client {
  id: number;
  business_name: string;
  legal_name?: string | null;
  email: string;
  phone?: string | null;
  billing_address?: string | null;
  gst_number?: string | null;
  coi?: string | null;
  category?: string | null;
  notes?: string | null;
  agent_id?: number | null;
  created_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  bank_reference?: string | null;
  payment_mode: string;
  tds_deducted: number;
  gst_component: number;
  remarks?: string | null;
  attachment?: string | null;
}

export interface PaymentReceipt {
  id: number;
  invoice_id: number;
  invoice_number: string;
  client_id: number;
  amount: number;
  payment_date: string;
  payment_mode: string;
  bank_reference?: string | null;
  tds_deducted: number;
  gst_component: number;
  remarks?: string | null;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  agent_id?: number | null;
  invoice_date: string;
  due_date?: string | null;
  service_description?: string | null;
  taxable_value: number;
  gst_rate: number;
  gst_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  is_interstate: boolean;
  tds_applicable: boolean;
  tds_rate: number;
  expected_tds: number;
  total_amount: number;
  amount_received: number;
  amount_pending: number;
  status: string;
  gst_status: string;
  is_locked: boolean;
  locked_at?: string | null;
  supporting_document?: string | null;
  internal_remarks?: string | null;
  created_at: string;
  payments?: Payment[];
}

export interface Vendor {
  id: number;
  business_name: string;
  legal_name?: string | null;
  contact_person?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  gst_number?: string | null;
  pan?: string | null;
  bank_account_holder?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  tax_applicable?: boolean;
  compliance_documents?: string | null;
  annual_service_contract?: string | null;
  approval_status: string;
  is_verified: boolean;
  created_at: string;
}

export interface Allocation {
  id: number;
  vendor_id: number;
  client_id?: number | null;
  project_name: string;
  scope_of_work?: string | null;
  agreed_cost: number;
  vendor_margin: number;
  allocation_percent: number;
  start_date?: string | null;
  end_date?: string | null;
  expected_report_date?: string | null;
  internal_owner?: string | null;
  status: string;
}

export interface VendorInvoice {
  id: number;
  vendor_id: number;
  invoice_number: string;
  invoice_date: string;
  invoice_amount: number;
  gst_amount: number;
  tds_amount: number;
  net_payable: number;
  status: string;
}

export interface ApprovalAction {
  id: number;
  approver_name: string;
  approver_role: string;
  decision: string;
  comments?: string | null;
  created_at: string;
}

export interface Approval {
  id: number;
  payee_name: string;
  amount: number;
  purpose?: string | null;
  tax_deductions: number;
  net_payable: number;
  bank_details?: string | null;
  status: string;
  cfo_comment?: string | null;
  ceo_comment?: string | null;
  payment_reference?: string | null;
  released_at?: string | null;
  created_at: string;
  actions?: ApprovalAction[];
}

export interface BankTransaction {
  id: number;
  statement_id: number;
  txn_date?: string | null;
  amount: number;
  utr_reference?: string | null;
  narration?: string | null;
  counterparty?: string | null;
  verification_status: string;
  match_note?: string | null;
}

export interface BankStatement {
  id: number;
  file_name: string;
  bank_name?: string | null;
  account_number?: string | null;
  uploaded_by?: string | null;
  transaction_count: number;
  matched_count: number;
  created_at: string;
}

export interface BankStatementDetail extends BankStatement {
  transactions: BankTransaction[];
}

export interface TaxationSummary {
  gst_by_status: Record<string, number>;
  gst_total: number;
  client_tds_receivable: number;
  vendor_tds_payable: number;
  client_invoice_count: number;
  vendor_invoice_count: number;
}

export interface AuditEntry {
  id: number;
  actor_name?: string | null;
  actor_role?: string | null;
  action: string;
  entity_type: string;
  entity_id?: number | null;
  detail?: string | null;
  created_at: string;
}

export interface VendorReport {
  id: number;
  project_name: string;
  reporting_period?: string | null;
  report_type?: string | null;
  review_status: string;
  client_id?: number | null;
  vendor_id?: number | null;
  created_at: string;
}
