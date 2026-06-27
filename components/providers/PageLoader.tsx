"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GridLoader } from "@/components/ui/GridLoader";

/**
 * Intro loading animation — a dotted-matrix grid pulses, then the screen lifts
 * away. Echoes the Revenue Trend chart so the motif greets every visitor.
 */
export function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.85, 0, 0.15, 1] } }}
        >
          <div className="relative flex flex-col items-center gap-9">
            <GridLoader dot={12} gap={9} />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="tracking-eyebrow text-xs text-secondary"
            >
              Project&nbsp;O2
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
