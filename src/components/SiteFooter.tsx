import { Link } from "@tanstack/react-router";
import { Mail, MapPin, BookOpen } from "lucide-react";
import { useT } from "../i18n";
import { openCookiePreferences } from "./CookieBanner";
import { SocialLinks } from "./SocialLinks";
import { trackNewsletterIntent } from "@/lib/ga4-events";

export function SiteFooter() {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="surface-bordeaux surface-bordeaux-glow relative mt-24 overflow-hidden text-primary-foreground">
      <div className="flex h-1 w-full">
        <div className="flex-1" style={{ background: "#008C45" }} />
        <div className="flex-1" style={{ background: "#F4F5F0" }} />
        <div className="flex-1" style={{ background: "#CD212A" }} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl font-semibold">Pierina Gallina</div>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-primary-foreground/80 italic">
            «Paroliera per passione» — scrittrice di Codroipo, nel cuore del Friuli.
            Libri, fiabe sonore, poesie in friulano e italiano, fotografie e racconti.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flag-italy" aria-label="Italia">
              <span /><span /><span />
            </span>
            <span className="flag-friuli" aria-label="Friuli">FVG</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">
              Codroipo · Friuli · Italia
            </span>
          </div>
          <div className="mt-5">
            <div className="mb-2 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/70">
              Seguimi
            </div>
            <SocialLinks variant="dark-prominent" size={22} />
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/70">
            Navigazione
          </div>
          <ul className="grid grid-cols-2 gap-y-1.5 text-sm">
            {[
              ["/", "Home"],
              ["/scritti", "Blog"],
              ["/fotografie", "Fotografie"],
              ["/fiabe", "Fiabe sonore"],
              ["/libri", "Libri"],
              ["/chi-sono", "Chi Sono"],
              ["/contatti", "Contatti"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-primary-foreground/85 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <div className="mb-2 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/70">
              Resta aggiornato
            </div>
            <p className="max-w-xs text-sm text-primary-foreground/75">
              Iscriviti alla newsletter per ricevere novità su libri, eventi e nuovi scritti.
            </p>
            <Link
              to="/contatti"
              onClick={() => trackNewsletterIntent("footer")}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Iscriviti <Mail size={14} />
            </Link>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/70">
            Contatti
          </div>
          <ul className="space-y-2.5 text-sm text-primary-foreground/85">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
              <span>Codroipo (Ud)<br />Friuli-Venezia Giulia, Italia</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 shrink-0 text-accent" />
              <Link to="/contatti" className="hover:text-accent">
                Scrivimi un messaggio
              </Link>
            </li>
            <li className="flex items-start gap-2">
              <BookOpen size={15} className="mt-0.5 shrink-0 text-accent" />
              <Link to="/libri" className="hover:text-accent">
                Esplora i libri
              </Link>
            </li>
          </ul>
          <p className="mt-4 max-w-[16rem] text-xs leading-relaxed text-primary-foreground/55">
            Per collaborazioni, letture, eventi o semplicemente per scambiare due parole.
          </p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 bg-primary-foreground/[0.03]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/55">
            © {year} Pierina Gallina · {t("footer_rights")}
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
          </div>
        </div>
      </div>
    </footer>
  );
}
