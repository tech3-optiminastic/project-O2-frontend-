import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Project O2 — secure finance platform portal.",
  robots: { index: false, follow: false },
};

export default function PortalRootLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
