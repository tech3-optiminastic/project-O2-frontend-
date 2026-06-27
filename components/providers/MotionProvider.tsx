"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// We intentionally opt into full motion (reducedMotion="never"), so framer-motion's
// dev-only "Reduced Motion enabled" warning is noise here. Filter just that message.
if (typeof window !== "undefined") {
  const w = window as unknown as { __o2WarnPatched?: boolean };
  if (!w.__o2WarnPatched) {
    w.__o2WarnPatched = true;
    const orig = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Reduced Motion")) return;
      orig(...args);
    };
  }
}

/**
 * Forces motion on across the app (reducedMotion="never").
 * The product is animation-led by design, so we opt into full motion and
 * also silence framer-motion's reduced-motion dev warning.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
