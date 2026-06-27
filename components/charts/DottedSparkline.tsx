"use client";

import { cn } from "@/lib/utils";

/** Small dotted-matrix sparkline — dots rise from the baseline to form a silhouette. */
export function DottedSparkline({
  data,
  rows = 6,
  className,
  dot = 5,
  gap = 4,
}: {
  data: number[];
  rows?: number;
  className?: string;
  dot?: number;
  gap?: number;
}) {
  const max = Math.max(1, ...data);
  return (
    <div className={cn("flex items-end", className)} style={{ gap }}>
      {data.map((v, i) => {
        const filled = Math.max(1, Math.round((v / max) * rows));
        return (
          <div key={i} className="flex flex-col-reverse" style={{ gap }}>
            {Array.from({ length: rows }, (_, r) => (
              <span
                key={r}
                style={{ width: dot, height: dot }}
                className={cn("rounded-full", r < filled ? "bg-foreground" : "bg-foreground/[0.08]")}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
