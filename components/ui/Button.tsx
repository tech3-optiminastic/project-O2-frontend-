"use client";

import { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-px before:pointer-events-none before:absolute before:-inset-px before:rounded-full before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 before:[background:radial-gradient(120%_120%_at_50%_-20%,rgba(255,255,255,0.35),transparent_60%)]",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-foreground/90 shadow-[0_10px_30px_-12px_rgba(17,17,17,0.5)]",
        secondary:
          "bg-transparent text-foreground border border-foreground/15 hover:border-foreground/40 hover:bg-foreground/[0.03]",
        ghost: "bg-transparent text-foreground hover:bg-foreground/[0.04]",
        glass: "glass text-foreground hover:bg-white/70",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-7 text-sm",
        lg: "h-14 px-9 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Enable magnetic pull toward the cursor. */
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, magnetic = true, children, ...props }, ref) => {
    const reduce = useReducedMotion();
    const localRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
    const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

    const onMove = (e: React.PointerEvent) => {
      if (!magnetic || reduce) return;
      const el = localRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 18);
      y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 14);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    const Comp = asChild ? Slot : "button";

    return (
      <motion.div
        style={{ x: magnetic ? sx : undefined, y: magnetic ? sy : undefined, display: "inline-flex" }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <Comp
          ref={(node: HTMLButtonElement) => {
            localRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Comp>
      </motion.div>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
