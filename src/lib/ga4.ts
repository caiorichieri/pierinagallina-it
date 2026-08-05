/**
 * Google Analytics 4 con Consent Mode v2.
 *
 * Lo script viene caricato con i consensi impostati di default su "denied":
 * in questo stato GA4 non scrive cookie e invia solo ping cookieless
 * (dati aggregati/modellati), in linea con il GDPR.
 * Quando l'utente accetta, i consensi vengono aggiornati con `consent update`.
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

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

/** Imposta i default di Consent Mode v2 (tutto negato tranne i cookie tecnici). */
export function initConsentDefaults() {
  if (typeof window === "undefined") return;
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  // Consent Mode v2: mantiene i dati utili (ping cookieless + modellazione)
  gtag("set", "url_passthrough", true);
  gtag("set", "ads_data_redaction", true);
}

/** Aggiorna i consensi dopo la scelta dell'utente nel banner cookie. */
export function updateConsent(c: ConsentState) {
  if (typeof window === "undefined") return;
  gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

export function loadGa4() {
  if (typeof window === "undefined") return;
  if (loaded || !GA_MEASUREMENT_ID) return;
  loaded = true;

  initConsentDefaults();

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

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
