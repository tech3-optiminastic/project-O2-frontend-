"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const fields = [
  { name: "name", label: "Full name", type: "text", placeholder: "Ada Lovelace" },
  { name: "email", label: "Work email", type: "email", placeholder: "you@company.com" },
  { name: "company", label: "Company", type: "text", placeholder: "Northwind Capital" },
];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative rounded-3xl border border-line bg-white/60 p-8 md:p-10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-16 text-center"
          >
            <span className="metallic flex h-16 w-16 items-center justify-center rounded-full">
              <Check className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
            </span>
            <h3 className="text-2xl font-light tracking-tight">Thank you</h3>
            <p className="max-w-xs text-sm font-light text-secondary">
              We&apos;ve received your request. A member of our team will be in touch within one business day.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-6"
          >
            {fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-2">
                <span className="text-xs tracking-eyebrow text-secondary">{f.label}</span>
                <input
                  required
                  type={f.type}
                  name={f.name}
                  placeholder={f.placeholder}
                  className="h-12 rounded-2xl border border-line bg-background px-4 text-sm outline-none transition-colors placeholder:text-ink-40 focus:border-foreground/40"
                />
              </label>
            ))}
            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-eyebrow text-secondary">How can we help?</span>
              <textarea
                required
                name="message"
                rows={4}
                placeholder="Tell us about your finance operations…"
                className="resize-none rounded-2xl border border-line bg-background p-4 text-sm outline-none transition-colors placeholder:text-ink-40 focus:border-foreground/40"
              />
            </label>
            <Button type="submit" size="lg" className="mt-2 w-full" magnetic={false}>
              Request a consultation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
