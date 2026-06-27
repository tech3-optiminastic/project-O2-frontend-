import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Max-width container with consistent gutters. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 md:px-10", className)}>{children}</div>;
}

/** Vertical section rhythm wrapper. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-24 md:py-36", className)}>
      {children}
    </section>
  );
}
