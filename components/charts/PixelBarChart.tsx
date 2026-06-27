"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PixelDatum {
  label: string;
  value: number;
}

/**
 * Continuous matrix histogram — one evenly-spaced column of cells per slice,
 * forming an unbroken dotted silhouette across the full width (no group gaps).
 * Two monochrome tones (primary filled, secondary lighter) + hover guide/tooltip.
 */
export function PixelBarChart({
  data,
  unit,
  colsPer = 4,
  className,
  newRatio = 0.38,
  labels = { primary: "Existing", secondary: "New" },
  dotted = false,
}: {
  data: PixelDatum[];
  unit?: number;
  colsPer?: number;
  className?: string;
  newRatio?: number;
  labels?: { primary: string; secondary: string };
  dotted?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const { rows, niceMax, columns } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.value));
    const pow = Math.pow(10, Math.floor(Math.log10(max)));
    const niceMax = Math.ceil(max / pow) * pow;
    const u = unit ?? niceMax / 24;
    const rows = Math.max(6, Math.round(niceMax / u));
    const pattern = [0.5, 0.74, 1, 0.62, 0.86, 0.7];

    // Flatten every slice into `colsPer` continuous columns.
    const columns = data.flatMap((d, gi) =>
      Array.from({ length: colsPer }, (_, s) => {
        const wobble = ((gi * 7 + s * 13) % 9) / 100;
        const factor = pattern[s % pattern.length] * (0.92 + wobble);
        const totalSq = Math.round((d.value * factor) / u);
        const newSq = Math.round(totalSq * newRatio);
        return { group: gi, existing: totalSq - newSq, totalSq };
      }),
    );
    return { rows, niceMax, columns };
  }, [data, unit, colsPer, newRatio]);

  const step = niceMax / 6;
  const yLabels = Array.from({ length: 7 }, (_, i) => Math.round(niceMax - step * i));

  return (
    <div className={cn("flex w-full gap-3", className)}>
      {/* Y axis */}
      <div className="flex flex-col justify-between py-1 text-[10px] tabular-nums text-ink-40">
        {yLabels.map((v, i) => (
          <span key={i}>{v >= 1000 ? `${Math.round(v / 1000)}k` : v}</span>
        ))}
      </div>

      {/* Plot */}
      <div className="relative min-w-0 flex-1">
        <div className="relative">
          {/* hover guide + tooltip */}
          {hover !== null && (
            <>
              <div
                className="pointer-events-none absolute -top-1 bottom-0 z-10 w-px border-l border-dashed border-ink-40/50"
                style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
              />
              <div
                className="pointer-events-none absolute -top-2 z-20 w-36 -translate-x-1/2 -translate-y-full rounded-2xl border border-line bg-white/90 p-3 text-left shadow-[0_20px_40px_-24px_rgba(17,17,17,0.3)] backdrop-blur"
                style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
              >
                <p className="text-xs font-medium">{data[hover].label}</p>
                <p className="mt-1.5 flex items-center justify-between text-[11px] text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/35" /> {labels.secondary}
                  </span>
                  <span className="tabular-nums text-foreground">{fmt(data[hover].value * newRatio)}</span>
                </p>
                <p className="mt-1 flex items-center justify-between text-[11px] text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> {labels.primary}
                  </span>
                  <span className="tabular-nums text-foreground">{fmt(data[hover].value * (1 - newRatio))}</span>
                </p>
              </div>
            </>
          )}

          {/* continuous columns — cascade in on view */}
          <motion.div
            className="flex w-full items-end justify-between"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
          >
            {columns.map((col, ci) => {
              const active = hover === col.group;
              return (
                <motion.div
                  key={ci}
                  onMouseEnter={() => setHover(col.group)}
                  onMouseLeave={() => setHover(null)}
                  className="flex flex-col-reverse gap-[4px]"
                  style={{ transformOrigin: "bottom" }}
                  variants={{
                    hidden: { opacity: 0, scaleY: 0.4, y: 10 },
                    show: { opacity: 1, scaleY: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {Array.from({ length: rows }, (_, r) => {
                    const existing = r < col.existing;
                    const isNew = r >= col.existing && r < col.totalSq;
                    return (
                      <span
                        key={r}
                        className={cn(
                          "h-[6px] w-[6px] transition-colors",
                          dotted ? "rounded-full" : "rounded-[1.5px]",
                          existing
                            ? "bg-foreground"
                            : isNew
                              ? "bg-foreground/35"
                              : "bg-foreground/[0.08]",
                          active && (existing || isNew) && "bg-foreground",
                        )}
                      />
                    );
                  })}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* x labels — evenly spaced under each slice */}
        <div className="mt-3 flex w-full justify-between">
          {data.map((d, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 text-center text-[11px] transition-colors",
                hover === i ? "font-medium text-foreground" : "text-ink-40",
              )}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${Math.round(n)}`;
}
