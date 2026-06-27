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
  // The app starts at the portal login — send the root straight there.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/portal/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
