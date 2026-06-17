import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useT } from "../i18n";
import { openCookiePreferences } from "./CookieBanner";
import logoAtletica from "../assets/logo-atletica-2000.png.asset.json";
import logoCodroipo from "../assets/logo-codroipo-ce.png.asset.json";
import logoSportCity from "../assets/logo-fondazione-sport-city.png.asset.json";
import logoFriulion from "../assets/friulion-logo-transparent.png.asset.json";

export function SiteFooter() {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      {/* Italy tricolore top edge */}
      <div className="flex h-1 w-full">
        <div className="flex-1" style={{ background: "#008C45" }} />
        <div className="flex-1" style={{ background: "#F4F5F0" }} />
        <div className="flex-1" style={{ background: "#CD212A" }} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl font-semibold">Piergiorgio Iacuzzo</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            {t("footer_tagline")}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flag-italy" aria-label="Italia">
              <span /><span /><span />
            </span>
            <span className="flag-friuli" aria-label="Friuli">FVG</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">
              Medio Friuli · Italia
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/55">
            {t("footer_links_heading")}
          </div>
          <ul className="grid grid-cols-2 gap-y-1.5 text-sm md:grid-cols-1">
            {[
              ["/bio", "nav_bio"],
              ["/atletica-2000", "nav_atletica"],
              ["/meeting", "nav_meeting"],
              ["/codroipo-ce", "nav_codroipo"],
              ["/memindsport", "nav_memindsport"],
              ["/valori", "nav_valori"],
              ["/galleria", "nav_galleria"],
              ["/agenda", "nav_agenda"],
              ["/news", "nav_news"],
              ["/contatti", "nav_contatti"],
            ].map(([to, key]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {t(key as never)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/55">
            {t("footer_assoc_heading")}
          </div>
          <ul className="space-y-3">
            <li>
              <a
                href="https://www.atletica2000.it"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 rounded-md border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-colors hover:border-accent/60 hover:bg-primary-foreground/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white p-1">
                  <img src={logoAtletica.url} alt="ASD Atletica 2000" className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">ASD Atletica 2000</span>
                  <span className="block truncate text-[11px] text-primary-foreground/60">atletica2000.it</span>
                </span>
                <ExternalLink size={14} className="text-primary-foreground/50 group-hover:text-accent" />
              </a>
            </li>
            <li>
              <a
                href="https://www.codroipoce.it"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 rounded-md border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-colors hover:border-accent/60 hover:bg-primary-foreground/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white p-1">
                  <img src={logoCodroipo.url} alt="Codroipo C'è" className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">Codroipo C'è</span>
                  <span className="block truncate text-[11px] text-primary-foreground/60">codroipoce.it</span>
                </span>
                <ExternalLink size={14} className="text-primary-foreground/50 group-hover:text-accent" />
              </a>
            </li>
            <li>
              <a
                href="https://www.sportcity.it"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 rounded-md border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-colors hover:border-accent/60 hover:bg-primary-foreground/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white p-1">
                  <img src={logoSportCity.url} alt="Fondazione Sport City" className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">Fondazione Sport City</span>
                  <span className="block truncate text-[11px] text-primary-foreground/60">Ambasciatore · Delegato Friuli</span>
                </span>
                <ExternalLink size={14} className="text-primary-foreground/50 group-hover:text-accent" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Creator credit */}
      <div className="border-t border-primary-foreground/10 bg-primary-foreground/[0.03]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary-foreground/55">
              {t("footer_credit_intro")}
            </span>
            <a
              href="https://www.friulion.it"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center transition-transform hover:-translate-y-0.5"
              aria-label="FriuliOn"
            >
              <img src={logoFriulion.url} alt="FriuliOn" className="h-8 w-auto" />
            </a>
            <span className="hidden text-[11px] text-primary-foreground/55 sm:inline">
              · {t("footer_credit_role")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-primary-foreground/55">
            <Link to="/privacy" className="hover:text-accent">
              {t("footer_privacy")}
            </Link>
            <Link to="/cookie-policy" className="hover:text-accent">
              {t("footer_cookie")}
            </Link>
            <button
              onClick={openCookiePreferences}
              type="button"
              className="hover:text-accent"
            >
              {t("footer_manage_cookies")}
            </button>
            <span className="ml-auto">© {year} Piergiorgio Iacuzzo. {t("footer_rights")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
