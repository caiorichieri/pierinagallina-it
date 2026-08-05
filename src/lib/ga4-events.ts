/**
 * Eventi GA4 personalizzati del sito di Pierina Gallina.
 *
 * Servono per costruire in GA4:
 *  - Conversioni (contatto, interesse per un libro, iscrizione newsletter, ascolto fiabe)
 *  - Report "pagine più lette" (article_view / article_read con titolo e sezione)
 *  - Report "percorso utente" (ogni evento porta `section` e `previous_page`)
 *  - Report "tempo medio per sezione" (evento `section_engagement` con `engagement_seconds`)
 */

import { trackEvent } from "./ga4";

export type SiteSection =
  | "home"
  | "scritti"
  | "libri"
  | "fiabe"
  | "fotografie"
  | "chi-sono"
  | "contatti"
  | "legale"
  | "admin"
  | "altro";

/** Ricava la sezione del sito da un pathname. */
export function sectionFromPath(pathname: string): SiteSection {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  if (p.startsWith("/admin")) return "admin";
  if (p.startsWith("/scritti") || p.startsWith("/blog")) return "scritti";
  if (p.startsWith("/libri")) return "libri";
  if (p.startsWith("/fiabe") || p.startsWith("/audiolibri")) return "fiabe";
  if (p.startsWith("/fotografie")) return "fotografie";
  if (p.startsWith("/chi-sono")) return "chi-sono";
  if (p.startsWith("/contatti")) return "contatti";
  if (p.startsWith("/privacy") || p.startsWith("/cookie-policy")) return "legale";
  return "altro";
}

let previousPage: string | null = null;

/** Aggiorna la pagina precedente (percorso utente) e restituisce quella vecchia. */
export function setPreviousPage(path: string) {
  const before = previousPage;
  previousPage = path;
  return before;
}

export function getPreviousPage() {
  return previousPage;
}

function baseParams() {
  if (typeof window === "undefined") return {};
  return {
    section: sectionFromPath(window.location.pathname),
    page_path: window.location.pathname,
    previous_page: previousPage ?? "(entrance)",
  };
}

/** Evento generico con contesto di sezione e percorso. */
export function track(name: string, params: Record<string, unknown> = {}) {
  trackEvent(name, { ...baseParams(), ...params });
}

/* ---------------------------------------------------------------- */
/* Conversioni (da marcare come "Eventi chiave" in GA4)              */
/* ---------------------------------------------------------------- */

/** Messaggio inviato dal form Contatti. */
export function trackContactSubmit(subject?: string) {
  track("contatto_inviato", { subject: subject || "(nessun oggetto)", value: 1 });
  track("generate_lead", { method: "form_contatti", value: 1 });
}

/** Richiesta di informazioni / interesse per un libro. */
export function trackBookInterest(bookTitle: string) {
  track("interesse_libro", { item_name: bookTitle, value: 1 });
  track("generate_lead", { method: "interesse_libro", item_name: bookTitle, value: 1 });
}

/** Click sull'iscrizione alla newsletter. */
export function trackNewsletterIntent(placement: string) {
  track("newsletter_iscrizione", { placement, value: 1 });
}

/** Avvio ascolto di una fiaba sonora (conversione "engagement"). */
export function trackAudioPlay(trackTitle: string, collection?: string) {
  track("ascolto_fiaba", { item_name: trackTitle, collection: collection ?? "" , value: 1 });
}

/* ---------------------------------------------------------------- */
/* Report contenuti                                                  */
/* ---------------------------------------------------------------- */

/** Apertura di un articolo/poesia: alimenta il report "pagine più lette". */
export function trackArticleView(title: string, slug: string) {
  track("articolo_visualizzato", { item_name: title, slug });
}

/** Lettura completata (>=75% di scroll sull'articolo). */
export function trackArticleRead(title: string, slug: string, seconds: number) {
  track("articolo_letto", { item_name: title, slug, engagement_seconds: seconds, value: 1 });
}

/** Profondità di scroll raggiunta su una pagina. */
export function trackScrollDepth(percent: number) {
  track("scroll_profondita", { percent });
}

/** Tempo trascorso in una sezione prima di cambiare pagina. */
export function trackSectionEngagement(section: SiteSection, path: string, seconds: number) {
  trackEvent("section_engagement", {
    section,
    page_path: path,
    engagement_seconds: seconds,
    previous_page: previousPage ?? "(entrance)",
  });
}
