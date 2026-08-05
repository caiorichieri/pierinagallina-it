import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

import { getConsent, type Consent } from "./CookieBanner";
import {
  loadGa4,
  trackPageView,
  isGa4Loaded,
  updateConsent,
  GA_MEASUREMENT_ID,
} from "../lib/ga4";
import {
  sectionFromPath,
  setPreviousPage,
  trackScrollDepth,
  trackSectionEngagement,
} from "../lib/ga4-events";

/**
 * GA4 con Consent Mode v2 + tracciamento personalizzato:
 * - page_view ad ogni cambio rotta (SPA)
 * - `section_engagement`: tempo medio per sezione del sito
 * - `scroll_profondita`: 25/50/75/100% per pagina
 * - `previous_page` su ogni evento: ricostruisce il percorso utente
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  // sezione corrente e momento di ingresso
  const current = useRef<{ path: string; section: ReturnType<typeof sectionFromPath>; start: number } | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    loadGa4();

    const stored = getConsent();
    if (stored) {
      updateConsent({ analytics: stored.analytics, marketing: stored.marketing });
    }
    trackPageView(`${window.location.pathname}${window.location.search}`);

    const onChange = (e: Event) => {
      const c = (e as CustomEvent<Consent>).detail;
      if (!c) return;
      updateConsent({ analytics: c.analytics, marketing: c.marketing });
    };
    window.addEventListener("consent-change", onChange);
    return () => window.removeEventListener("consent-change", onChange);
  }, []);

  // page_view + tempo per sezione
  useEffect(() => {
    if (!isGa4Loaded()) return;
    const path = `${pathname}${search ? `?${search.replace(/^\?/, "")}` : ""}`;

    // chiude il conteggio della pagina precedente
    const prev = current.current;
    if (prev) {
      const seconds = Math.round((Date.now() - prev.start) / 1000);
      if (seconds > 0 && seconds < 3600) {
        trackSectionEngagement(prev.section, prev.path, seconds);
      }
      setPreviousPage(prev.path);
    }

    current.current = { path: pathname, section: sectionFromPath(pathname), start: Date.now() };
    trackPageView(path);
  }, [pathname, search]);

  // invia il tempo dell'ultima sezione quando l'utente lascia il sito
  useEffect(() => {
    const flush = () => {
      const cur = current.current;
      if (!cur || !isGa4Loaded()) return;
      const seconds = Math.round((Date.now() - cur.start) / 1000);
      if (seconds > 0 && seconds < 3600) {
        trackSectionEngagement(cur.section, cur.path, seconds);
      }
      cur.start = Date.now();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  // profondità di scroll per pagina
  useEffect(() => {
    if (!isGa4Loaded()) return;
    const milestones = [25, 50, 75, 100];
    const sent = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const m of milestones) {
        if (percent >= m && !sent.has(m)) {
          sent.add(m);
          trackScrollDepth(m);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
