"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingOrb } from "@/components/orb/FloatingOrb";
import { fadeUp, viewportOnce } from "@/lib/motion";

export interface BlogPost {
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  date?: string;
}

export function BlogCard({ post, index = 0, href = "/insights" }: { post: BlogPost; index?: number; href?: string }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white/50"
    >
      <Link href={href} className="flex h-full flex-col">
        <div className="relative h-48 overflow-hidden bg-mist">
          <FloatingOrb
            size={220}
            variant="card"
            speed={13 + index}
            delay={index * 0.4}
            className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <div className="flex items-center justify-between text-xs text-ink-40">
            <span className="tracking-eyebrow">{post.category}</span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="mt-5 flex items-start gap-2 text-xl font-light leading-snug tracking-tight">
            {post.title}
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
          </h3>
          <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-secondary">{post.excerpt}</p>
          {post.date && <p className="mt-6 text-xs text-ink-40">{post.date}</p>}
        </div>
      </Link>
    </motion.article>
  );
}
