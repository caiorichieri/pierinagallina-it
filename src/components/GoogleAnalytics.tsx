import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

import { getConsent, type Consent } from "./CookieBanner";
import {
  loadGa4,
  trackPageView,
  isGa4Loaded,
  updateConsent,
  GA_MEASUREMENT_ID,
} from "../lib/ga4";

/**
 * GA4 con Consent Mode v2: lo script parte subito con tutti i consensi negati
 * (nessun cookie, solo ping cookieless) e viene aggiornato appena l'utente
 * esprime le sue scelte nel banner cookie.
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

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

  useEffect(() => {
    if (!isGa4Loaded()) return;
    const path = `${pathname}${search ? `?${search.replace(/^\?/, "")}` : ""}`;
    trackPageView(path);
  }, [pathname, search]);

  return null;
}
