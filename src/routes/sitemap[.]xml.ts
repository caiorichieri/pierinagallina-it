import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "../integrations/pierina/client";

const BASE_URL = "https://pierina.friulion.app";

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
          { path: "/chi-sono", changefreq: "monthly", priority: "0.8" },
          { path: "/libri", changefreq: "monthly", priority: "0.8" },
          { path: "/fiabe", changefreq: "monthly", priority: "0.7" },
          { path: "/fotografie", changefreq: "weekly", priority: "0.6" },
          { path: "/scritti", changefreq: "weekly", priority: "0.8" },
          { path: "/contatti", changefreq: "yearly", priority: "0.5" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
        ];

        let blogEntries: SitemapEntry[] = [];
        try {
          const { data, error } = await db
            .from("posts")
            .select("slug, published_at")
            .order("published_at", { ascending: false });
          if (!error) {
            blogEntries = (data ?? []).map((p) => ({
              path: `/blog/${p.slug}`,
              lastmod: p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : undefined,
              changefreq: "monthly",
              priority: "0.6",
            }));
          }
        } catch {
          blogEntries = [];
        }

        const entries = [...staticEntries, ...blogEntries];

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
