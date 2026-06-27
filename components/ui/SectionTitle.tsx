"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, TextReveal } from "./Reveal";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  index?: string;
}

/** Editorial section header — eyebrow, large display title, supporting copy. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  index,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {(eyebrow || index) && (
        <Reveal className="flex items-center gap-3">
          {index && <span className="text-xs text-ink-40 tabular-nums">{index}</span>}
          {eyebrow && (
            <span className="tracking-eyebrow text-xs text-secondary">{eyebrow}</span>
          )}
        </Reveal>
      )}
      <h2 className="max-w-4xl text-balance text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        <TextReveal text={title} />
      </h2>
      {description && (
        <Reveal delay={0.1} className="max-w-xl text-balance text-lg font-light leading-relaxed text-secondary">
          {description}
        </Reveal>
      )}
    </div>
  );
}
