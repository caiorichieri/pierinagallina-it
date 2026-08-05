/**
 * Google Analytics 4 — caricato solo dopo il consenso "analytics" del visitatore.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = import.meta.env
  .VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

let loaded = false;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function loadGa4() {
  if (typeof window === "undefined") return;
  if (loaded || !GA_MEASUREMENT_ID) return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });
}

export function trackPageView(path: string, title?: string) {
  if (!loaded || !GA_MEASUREMENT_ID) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!loaded || !GA_MEASUREMENT_ID) return;
  gtag("event", name, params ?? {});
}

export function isGa4Loaded() {
  return loaded;
}
