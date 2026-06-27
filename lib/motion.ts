import type { Variants, Transition } from "framer-motion";

/** Shared luxury easing — slow, confident, premium. */
export const EASE_LUXE = [0.22, 1, 0.36, 1] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

export const springSoft: Transition = { type: "spring", stiffness: 120, damping: 20, mass: 0.6 };
export const springMagnetic: Transition = { type: "spring", stiffness: 220, damping: 18, mass: 0.4 };

/** Fade upward — the workhorse entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_LUXE },
  },
};

/** Blur reveal — content resolves out of frost. */
export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_LUXE },
  },
};

/** Scale-in for cards / panels. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE_LUXE } },
};

/** Stagger container. */
export const stagger = (staggerChildren = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Per-word/line text reveal child. */
export const lineReveal: Variants = {
  hidden: { y: "120%" },
  show: { y: "0%", transition: { duration: 1, ease: EASE_LUXE } },
};

export const viewportOnce = { once: true, amount: 0.25 } as const;
