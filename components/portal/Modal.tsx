"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-foreground/20 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[121] w-[min(92vw,640px)] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto focus:outline-none"
          asChild
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-3xl p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <Dialog.Title className="text-xl font-light tracking-tight">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-sm font-light text-secondary">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-colors hover:bg-foreground/[0.04]">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            {children}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
