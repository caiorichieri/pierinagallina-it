import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const CANONICAL_HOST = "https://www.pierinagallina.it";

/** Il sitemap punta sempre al dominio canonico del sito. */
function baseUrl(_request: Request): string {
  return CANONICAL_HOST;
}


export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${baseUrl(request)}/sitemap.xml`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
