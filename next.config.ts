import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Hide the on-screen dev indicator ("N · Issue" chip). Dev-only; never shipped.
  devIndicators: false,
  // Pin the workspace root to this app (avoids picking up a parent lockfile).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
