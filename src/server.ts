import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/** Paesi bloccati (traffico bot massiccio, nessun lettore reale del sito). */
const BLOCKED_COUNTRIES = new Set(["CN"]);

/** Percorsi tipici degli scanner e residui del vecchio WordPress. */
const BOT_PATH_RE =
  /^\/(wp-|xmlrpc\.php|wlwmanifest|vendor\/|\.env|\.git|autodiscover|owa\/|cgi-bin|phpmyadmin|category\/|tag\/|feed\/?$|comments\/feed|author\/|\?p=|\d{4}\/\d{2}\/)/i;

/** User-agent di crawler/scraper non desiderati (i motori di ricerca restano ammessi). */
const BOT_UA_RE =
  /(python-requests|curl\/|wget|libwww|httpclient|scrapy|go-http-client|java\/|okhttp|masscan|zgrab|nmap|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|dataforseo|serpstat|blexbot|seekport|censys|nikto|sqlmap|headlesschrome|phantomjs|axios\/|node-fetch)/i;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      if (BOT_PATH_RE.test(url.pathname)) {
        return new Response("Not found", { status: 404 });
      }

      const ua = request.headers.get("user-agent") ?? "";
      if (!ua || BOT_UA_RE.test(ua)) {
        return new Response("Access denied", { status: 403 });
      }

      const country = (request as unknown as { cf?: { country?: string } }).cf?.country;
      if (country && BLOCKED_COUNTRIES.has(country)) {
        return new Response("Access denied", { status: 403 });
      }


      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
