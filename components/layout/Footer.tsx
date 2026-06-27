"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/site";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const socials = ["LinkedIn", "X / Twitter", "Dribbble", "Instagram"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-mist/50">
      {/* Circular background decoration */}
      <FloatingOrb size={620} variant="footer" speed={20} opacity={0.5} className="-bottom-72 -left-40" parallax={40} />
      <FloatingOrb size={300} variant="ambient" speed={16} opacity={0.35} className="-right-20 top-10" />

      <Container className="relative z-10 py-24">
        {/* Newsletter / statement */}
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="tracking-eyebrow text-xs text-secondary">Newsletter</p>
            <h3 className="mt-6 max-w-xl text-balance text-4xl font-extralight leading-[1.05] tracking-tight md:text-5xl">
              Clarity, delivered quietly.
            </h3>
            <form
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-line bg-white/60 p-1.5 pl-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-40"
              />
              <Button size="sm" type="submit" magnetic={false}>
                Subscribe
              </Button>
            </form>
          </Reveal>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="tracking-eyebrow text-xs text-secondary">Navigate</p>
              <ul className="mt-5 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-light text-secondary transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="tracking-eyebrow text-xs text-secondary">Connect</p>
              <ul className="mt-5 flex flex-col gap-3">
                {socials.map((s) => (
                  <li key={s}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm font-light text-secondary transition-colors hover:text-foreground"
                    >
                      {s}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-24 overflow-hidden">
          <h2 className="text-display select-none whitespace-nowrap text-[18vw] font-extralight leading-none tracking-tighter text-foreground/[0.06]">
            {siteConfig.name}
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink-40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.product}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <Link href="/portal/login" className="hover:text-foreground">Client Portal →</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
