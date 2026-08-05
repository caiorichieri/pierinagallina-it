import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

import { getConsent, type Consent } from "./CookieBanner";
import { loadGa4, trackPageView, isGa4Loaded, GA_MEASUREMENT_ID } from "../lib/ga4";

/**
 * Inizializza GA4 quando l'utente ha dato il consenso analitico
 * e invia un page_view a ogni cambio di rotta (SPA).
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const apply = (c: Consent | null) => {
      if (!c?.analytics || isGa4Loaded()) return;
      loadGa4();
      trackPageView(`${window.location.pathname}${window.location.search}`);
    };

    apply(getConsent());

    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail);
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
