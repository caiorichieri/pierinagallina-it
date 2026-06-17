import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getNewsList } from "../lib/content.functions";

const BASE_URL = "https://piergiorgioiacuzzo.it";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/bio", changefreq: "monthly", priority: "0.8" },
          { path: "/atletica-2000", changefreq: "monthly", priority: "0.8" },
          { path: "/meeting", changefreq: "monthly", priority: "0.7" },
          { path: "/codroipo-ce", changefreq: "monthly", priority: "0.8" },
          { path: "/memindsport", changefreq: "monthly", priority: "0.7" },
          { path: "/valori", changefreq: "monthly", priority: "0.6" },
          { path: "/galleria", changefreq: "weekly", priority: "0.6" },
          { path: "/agenda", changefreq: "weekly", priority: "0.7" },
          { path: "/news", changefreq: "weekly", priority: "0.8" },
          { path: "/contatti", changefreq: "yearly", priority: "0.5" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
        ];

        let newsEntries: SitemapEntry[] = [];
        try {
          const { news } = await getNewsList();
          newsEntries = news.map((n) => ({
            path: `/news/${n.slug}`,
            lastmod: new Date(n.published_at).toISOString().slice(0, 10),
            changefreq: "monthly",
            priority: "0.6",
          }));
        } catch {
          newsEntries = [];
        }

        const entries = [...staticEntries, ...newsEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
