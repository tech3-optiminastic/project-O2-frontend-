"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Dot-matrix loader that spells the "/₹" brand glyph. A bright "money" sweep
 * travels left→right across the dots — each cell rises into place and flashes
 * gold at the peak, like a cash counter ticking up. '#' cells are animated
 * dots; '.' cells are invisible spacers.
 */
const GLYPH = [
  "...#.####.",
  "...#.#..#.",
  "..#..####.",
  "..#..#....",
  ".#...####.",
  ".#.....#..",
  "#.....#...",
];

export function GridLoader({
  dot = 9,
  gap = 6,
  className,
}: {
  dot?: number;
  gap?: number;
  className?: string;
}) {
  const cols = GLYPH[0].length;
  // Money sweep: the bright crest moves left→right across columns. A small
  // per-row offset keeps the glint diagonal so it glides rather than blinks.
  const SWEEP = 1.6; // seconds for one pass across the glyph
  const HOLD = 1.0; // pause before the counter rolls again
  const cycle = SWEEP + HOLD;

  return (
    <div
      className={cn("grid", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, ${dot}px)`, gap }}
      role="status"
      aria-label="Loading"
    >
      {GLYPH.flatMap((line, r) =>
        line.split("").map((ch, c) =>
          ch === "#" ? (
            <motion.span
              key={`${r}-${c}`}
              className="rounded-full bg-foreground"
              style={{ width: dot, height: dot }}
              animate={{
                opacity: [0.18, 1, 0.18],
                // rise into place as the crest passes — cash stacking up
                y: [2, -1.5, 2],
                scale: [0.7, 1.12, 0.7],
                // flash gold at the peak, like a coin catching the light
                backgroundColor: ["#111111", "#e0a92e", "#111111"],
              }}
              transition={{
                duration: cycle,
                repeat: Infinity,
                ease: "easeInOut",
                // crest reaches this cell as the sweep passes its column
                times: [0, 0.5, 1],
                delay: (c + r * 0.35) / cols * SWEEP,
                repeatDelay: 0,
              }}
            />
          ) : (
            <span key={`${r}-${c}`} style={{ width: dot, height: dot }} />
          ),
        ),
      )}
    </div>
  );
}
