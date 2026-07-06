import { Link } from "@tanstack/react-router";
import { Mail, MapPin, BookOpen } from "lucide-react";
import { useT } from "../i18n";
import { openCookiePreferences } from "./CookieBanner";

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

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl font-semibold">Pierina Gallina</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/75 italic">
            «Paroliera per passione» — scrittrice di Codroipo, nel cuore del Friuli.
            Libri, fiabe sonore, poesie in friulano e italiano, fotografie e racconti.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flag-italy" aria-label="Italia">
              <span /><span /><span />
            </span>
            <span className="flag-friuli" aria-label="Friuli">FVG</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">
              Codroipo · Friuli · Italia
            </span>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/55">
            Navigazione
          </div>
          <ul className="grid grid-cols-2 gap-y-1.5 text-sm">
            {[
              ["/", "Home"],
              ["/chi-sono", "Chi sono"],
              ["/libri", "Libri"],
              ["/fiabe", "Fiabe sonore"],
              ["/poesie", "Poesie"],
              ["/fotografie", "Fotografie"],
              ["/blog", "Blog"],
              ["/contatti", "Contatti"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="mb-4 text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/55">
            Contatti
          </div>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-1 shrink-0 text-accent" />
              <span>Sia Sedegliano, 30<br />Codroipo (Ud)<br />Friuli-Venezia Giulia</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-1 shrink-0 text-accent" />
              <Link to="/contatti" className="hover:text-accent">
                Scrivimi
              </Link>
            </li>
            <li className="flex items-start gap-2">
              <BookOpen size={14} className="mt-1 shrink-0 text-accent" />
              <Link to="/libri" className="hover:text-accent">
                Catalogo libri
              </Link>
            </li>
          </ul>
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
