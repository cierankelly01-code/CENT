import type { MetadataRoute } from "next";

const BASE = "https://centaurrobotics.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/the-centaur", "/story", "/who-its-for", "/why-us", "/configure", "/privacy"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/configure" ? 0.9 : 0.7,
  }));
}
