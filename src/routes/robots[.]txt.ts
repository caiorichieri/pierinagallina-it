import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const CANONICAL_HOST = "https://www.pierinagallina.it";

/** Uses the host the request came in on, so the sitemap link always matches it. */
function baseUrl(request: Request): string {
  try {
    const url = new URL(request.url);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return CANONICAL_HOST;
    return `${url.protocol}//${url.host}`;
  } catch {
    return CANONICAL_HOST;
  }
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
