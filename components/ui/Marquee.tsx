"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal marquee for logos / trust strip. Pauses on reduced motion. */
export function Marquee({
  children,
  className,
  speed = 32,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = (
    <div className="flex shrink-0 items-center gap-16 px-8">{children}</div>
  );

  // Render the animated branch on the server and first client paint so the
  // markup matches during hydration; only honour reduced-motion after mount.
  if (mounted && reduce) {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-12", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {items}
        {items}
      </motion.div>
    </div>
  );
}
