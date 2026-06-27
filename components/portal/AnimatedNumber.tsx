"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

/** Premium count-up: animates 0 → value when scrolled into view. */
export function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
  duration = 1.6,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView) {
      node.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration]);

  return <span ref={ref}>{format(0)}</span>;
}
