"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label?: string;
  className?: string;
  duration?: number;
}

/** Animated number that counts up when scrolled into view. Large editorial numerals. */
export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  className,
  duration = 2,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        node.textContent = `${prefix}${latest.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, decimals, duration, reduce]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span
        ref={ref}
        className="text-display font-extralight tabular-nums leading-none"
        style={{ fontSize: "clamp(2.75rem, 6vw, 5.5rem)" }}
      >
        {prefix}0{suffix}
      </span>
      {label && <span className="text-sm font-light text-secondary">{label}</span>}
    </div>
  );
}
