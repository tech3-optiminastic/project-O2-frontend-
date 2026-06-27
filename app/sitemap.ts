import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/solutions", "/insights", "/about", "/contact"];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-06-26"),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
