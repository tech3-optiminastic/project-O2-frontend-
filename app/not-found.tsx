import Link from "next/link";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <FloatingOrb size="min(60vw, 560px)" variant="hero" speed={16} parallax={30} className="left-1/2 top-1/3 -translate-x-1/2" opacity={0.85} />
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-display font-extralight leading-none" style={{ fontSize: "clamp(4rem, 14vw, 11rem)" }}>
          404
        </p>
        <p className="mt-6 max-w-sm text-balance text-lg font-light text-secondary">
          This page drifted out of orbit. Let&apos;s get you back to solid ground.
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}
