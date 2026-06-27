"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A custom monochrome cursor that grows and inverts over interactive elements
 * tagged with `data-cursor` (or any <a>/<button>). Hidden on touch devices.
 */
export function MagneticCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea, [role='button']",
      ) as HTMLElement | null;
      setHovering(!!el);
      setLabel(el?.dataset.cursor || null);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[10px] font-medium uppercase tracking-widest text-black"
        animate={{
          width: hovering ? (label ? 96 : 56) : 12,
          height: hovering ? (label ? 96 : 56) : 12,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
