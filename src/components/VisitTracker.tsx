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

export function VisitTracker() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path.startsWith("/admin")) return;

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
