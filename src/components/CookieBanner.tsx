import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "../i18n";

export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const KEY = "cookie-consent-v1";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function saveConsent(c: Consent) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
  window.dispatchEvent(new CustomEvent("consent-change", { detail: c }));
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event("open-cookie-preferences"));
}

export function CookieBanner() {
  const { lang } = useT();
  const it = lang === "it";
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = getConsent();
    if (!c) setOpen(true);
    else {
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
    }
    const openH = () => {
      const cur = getConsent();
      if (cur) {
        setAnalytics(cur.analytics);
        setMarketing(cur.marketing);
      }
      setShowPrefs(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-preferences", openH);
    return () => window.removeEventListener("open-cookie-preferences", openH);
  }, []);

  if (!open) return null;

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true, ts: Date.now() });
    setOpen(false);
    setShowPrefs(false);
  };
  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
    setOpen(false);
    setShowPrefs(false);
  };
  const saveCustom = () => {
    saveConsent({ necessary: true, analytics, marketing, ts: Date.now() });
    setOpen(false);
    setShowPrefs(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={it ? "Preferenze cookie" : "Cookie preferences"}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/90"
    >
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        {!showPrefs ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm leading-relaxed text-foreground/85">
              <strong className="font-serif text-base text-foreground">
                {it ? "Rispettiamo la tua privacy" : "We respect your privacy"}
              </strong>
              <p className="mt-1 max-w-2xl text-foreground/75">
                {it
                  ? "Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo tuo consenso, cookie analitici per capire come viene utilizzato. Puoi accettare, rifiutare o personalizzare le tue scelte. "
                  : "We use technical cookies necessary for the site to work and, with your consent, analytics cookies to understand how it is used. You can accept, reject or customise your choices. "}
                <Link to="/cookie-policy" className="underline hover:text-accent">
                  {it ? "Cookie Policy" : "Cookie Policy"}
                </Link>
                {" · "}
                <Link to="/privacy" className="underline hover:text-accent">
                  {it ? "Informativa Privacy" : "Privacy Policy"}
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:shrink-0">
              <button
                onClick={rejectAll}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {it ? "Rifiuta" : "Reject"}
              </button>
              <button
                onClick={() => setShowPrefs(true)}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {it ? "Personalizza" : "Customise"}
              </button>
              <button
                onClick={acceptAll}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {it ? "Accetta tutti" : "Accept all"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <strong className="font-serif text-base text-foreground">
                {it ? "Preferenze cookie" : "Cookie preferences"}
              </strong>
              <p className="mt-1 text-sm text-foreground/75">
                {it
                  ? "Scegli quali categorie di cookie autorizzare. I cookie tecnici sono sempre attivi."
                  : "Choose which cookie categories to allow. Technical cookies are always active."}
              </p>
            </div>
            <ul className="divide-y divide-border rounded-md border border-border">
              <li className="flex items-center justify-between gap-4 p-3">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {it ? "Tecnici (necessari)" : "Strictly necessary"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it
                      ? "Indispensabili per il funzionamento del sito. Non richiedono consenso."
                      : "Essential for the site to function. No consent required."}
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {it ? "Sempre attivi" : "Always on"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 p-3">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {it ? "Analitici" : "Analytics"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it
                      ? "Statistiche aggregate sulla navigazione (es. Google Analytics)."
                      : "Aggregate browsing statistics (e.g. Google Analytics)."}
                  </div>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              </li>
              <li className="flex items-center justify-between gap-4 p-3">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {it ? "Marketing / profilazione" : "Marketing / profiling"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it
                      ? "Cookie di terze parti per finalità promozionali. Attualmente non utilizzati."
                      : "Third-party cookies for promotional purposes. Not currently used."}
                  </div>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              </li>
            </ul>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={rejectAll}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {it ? "Rifiuta tutti" : "Reject all"}
              </button>
              <button
                onClick={saveCustom}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {it ? "Salva preferenze" : "Save preferences"}
              </button>
              <button
                onClick={acceptAll}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {it ? "Accetta tutti" : "Accept all"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
