"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type OrbVariant = "hero" | "divider" | "card" | "cta" | "footer" | "ambient";

interface FloatingOrbProps {
  /** Diameter in px (number) or any CSS size (string). */
  size?: number | string;
  variant?: OrbVariant;
  className?: string;
  /** Seconds for one float cycle. Lower = livelier. */
  speed?: number;
  /** Extra blur applied to the whole orb (px). */
  blur?: number;
  /** Scroll parallax strength (px of travel across viewport). 0 disables. */
  parallax?: number;
  /** Follow the pointer with a soft magnetic pull. */
  interactive?: boolean;
  /** Opacity of the orb. */
  opacity?: number;
  /** Start delay for the float, to desync multiple orbs. */
  delay?: number;
}

/**
 * FloatingOrb — the core motif of the entire product.
 *
 * A frosted metallic sphere that floats, breathes, parallaxes on scroll and
 * (optionally) follows the cursor. Reused across hero backgrounds, dividers,
 * cards, testimonials, CTAs, the footer and the dashboard so every surface
 * shares one visual identity.
 */
export function FloatingOrb({
  size = 480,
  variant = "ambient",
  className,
  speed = 14,
  blur = 0,
  parallax = 0,
  interactive = false,
  opacity = 1,
  delay = 0,
}: FloatingOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  // Pointer magnetic pull
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 });

  const handlePointer = (e: React.PointerEvent) => {
    if (!interactive || reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set(((e.clientX - cx) / rect.width) * 40);
    my.set(((e.clientY - cy) / rect.height) * 40);
  };
  const resetPointer = () => {
    mx.set(0);
    my.set(0);
  };

  const dim = typeof size === "number" ? `${size}px` : size;

  // Variant-specific accents
  const ring =
    variant === "hero" || variant === "cta"
      ? "shadow-[0_60px_120px_-40px_rgba(17,17,17,0.35)]"
      : variant === "card"
        ? "shadow-[0_30px_60px_-30px_rgba(17,17,17,0.25)]"
        : "";

  const floatAnim = reduce
    ? {}
    : {
        y: [0, -22, 0, 14, 0],
        x: [0, 10, 0, -8, 0],
        scale: [1, 1.035, 1, 1.02, 1], // slow breathing
        rotate: [0, 6, 0, -4, 0],
      };

  return (
    <motion.div
      ref={ref}
      aria-hidden
      onPointerMove={interactive ? handlePointer : undefined}
      onPointerLeave={interactive ? resetPointer : undefined}
      style={{ y: parallax ? yParallax : undefined, opacity }}
      className={cn("pointer-events-none absolute select-none", interactive && "pointer-events-auto", className)}
    >
      <motion.div style={{ x: interactive ? sx : undefined, y: interactive ? sy : undefined }}>
        <motion.div
          animate={floatAnim}
          transition={{
            duration: speed,
            ease: "easeInOut",
            repeat: Infinity,
            delay,
          }}
          style={{ width: dim, height: dim, filter: blur ? `blur(${blur}px)` : undefined }}
          className="relative"
        >
          {/* Core metallic sphere */}
          <div
            className={cn(
              "metallic absolute inset-0 rounded-full",
              ring,
            )}
          />
          {/* Soft pastel tint — cool sheen up top, warm glow below */}
          <div
            className="absolute inset-0 rounded-full mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(62% 50% at 30% 22%, rgba(150,186,232,0.65), transparent 58%), radial-gradient(72% 64% at 76% 82%, rgba(244,228,170,0.7), transparent 62%)",
            }}
          />
          {/* Soft top highlight */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(60%_45%_at_32%_22%,rgba(255,255,255,0.95),transparent_60%)]" />
          {/* Inner shadow / depth on the lower edge */}
          <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-40px_70px_-30px_rgba(17,17,17,0.28),inset_20px_24px_50px_-20px_rgba(255,255,255,0.9)]" />
          {/* Thin orbiting ring accent */}
          <div className="absolute inset-[10%] rounded-full border border-white/40" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default FloatingOrb;
