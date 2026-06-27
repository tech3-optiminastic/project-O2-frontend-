import { cn } from "@/lib/utils";

/** Brand mark — a frosted metallic tile stamped with the "/₹" finance glyph. */
export function Logo({
  size = 36,
  className,
  rounded = "rounded-xl",
}: {
  size?: number;
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "metallic relative inline-flex shrink-0 items-center justify-center shadow-[0_6px_16px_-6px_rgba(17,17,17,0.45)]",
        rounded,
        className,
      )}
    >
      <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(60%_45%_at_32%_22%,rgba(255,255,255,0.9),transparent_60%)]" />
      <span
        className="relative font-semibold leading-none tracking-tight text-foreground/85"
        style={{ fontSize: size * 0.44 }}
      >
        /₹
      </span>
    </span>
  );
}
