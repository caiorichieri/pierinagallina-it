import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { trackVisit } from "@/lib/analytics.functions";

function deviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function sessionId(): string {
  const KEY = "pg_sid";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

/** Only the real public site counts: no localhost, no preview builds. */
function isPublicSite(): boolean {
  const h = window.location.hostname;
  return h === "pierinagallina.it" || h === "www.pierinagallina.it";
}

/** Avoids counting the same page twice for the same visitor within 30 minutes. */
function alreadyCounted(path: string): boolean {
  const KEY = "pg_seen";
  const now = Date.now();
  let seen: Record<string, number> = {};
  try {
    seen = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    seen = {};
  }
  const last = seen[path];
  if (last && now - last < 30 * 60 * 1000) return true;
  seen[path] = now;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(seen));
  } catch {
    /* ignore */
  }
  return false;
}

export function VisitTracker() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path.startsWith("/admin") || path.startsWith("/auth")) return;
    if (!isPublicSite()) return;
    if (/bot|crawl|spider|slurp|headless|preview/i.test(navigator.userAgent)) return;
    if (alreadyCounted(path)) return;

    const t = window.setTimeout(() => {
      const isPost = path.startsWith("/blog/");
      void trackVisit({
        data: {
          path,
          postSlug: isPost ? decodeURIComponent(path.replace("/blog/", "")) : null,
          postTitle: isPost ? document.title.split("—")[0]?.trim().slice(0, 300) || null : null,
          referrer: document.referrer ? document.referrer.slice(0, 500) : null,
          device: deviceType(),
          sessionId: sessionId(),
        },
      }).catch(() => {});
    }, 800);

    return () => window.clearTimeout(t);
  }, [path]);

  return null;
}
