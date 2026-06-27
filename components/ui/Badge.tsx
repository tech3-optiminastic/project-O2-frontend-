import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small status / category pill in the monochrome system. */
export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "outline" | "solid" | "muted";
}) {
  const tones = {
    default: "bg-foreground/[0.04] text-foreground border-line",
    outline: "bg-transparent text-secondary border-line",
    solid: "bg-foreground text-background border-transparent",
    muted: "bg-mist text-secondary border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
