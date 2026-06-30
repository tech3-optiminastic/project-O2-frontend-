"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import { PayoutPanel } from "@/components/portal/PayoutPanel";

export default function ApprovalsPage() {
  return (
    <PortalShell>
      <PayoutPanel
        title="Payment Approvals"
        description="CEO sign-off, then the Manager records the payment reference to complete it."
      />
    </PortalShell>
  );
}
