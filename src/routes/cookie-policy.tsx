import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { openCookiePreferences } from "../components/CookieBanner";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — FriuliOn di Silvestre Richieri Caio" },
      {
        name: "description",
        content:
          "Informativa sui cookie utilizzati dal sito ai sensi delle Linee Guida del Garante Privacy del 10 giugno 2021.",
      },
      { property: "og:title", content: "Cookie Policy — FriuliOn di Silvestre Richieri Caio" },
      {
        property: "og:description",
        content:
          "Informativa sui cookie utilizzati dal sito ai sensi delle Linee Guida del Garante Privacy del 10 giugno 2021.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/cookie-policy" }],
  }),
  component: CookiePage,
});

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-serif text-2xl text-foreground">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-foreground/85">{children}</p>;
}

function CookiePage() {
  const { lang } = useT();
  const it = lang === "it";
  return (
    <>
      <PageHero
        eyebrow={it ? "Note legali" : "Legal"}
        title="Cookie Policy"
        intro={
          it
            ? "Tipologie di cookie utilizzati, finalità e modalità di gestione del consenso."
            : "Types of cookies used, purposes and how to manage your consent."
        }
      />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          {it ? "Ultimo aggiornamento: 11 giugno 2026" : "Last update: 11 June 2026"}
        </p>

        {it ? (
          <>
            <H>Cosa sono i cookie</H>
            <P>
              I cookie sono piccoli file di testo memorizzati nel dispositivo dell'utente durante la
              navigazione. Permettono al sito di funzionare correttamente, di ricordare preferenze
              e, in alcuni casi, di raccogliere statistiche di utilizzo.
            </P>

            <H>Categorie di cookie utilizzati</H>
            <div className="mt-4 overflow-hidden rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Categoria</th>
                    <th className="px-3 py-2">Finalità</th>
                    <th className="px-3 py-2">Durata</th>
                    <th className="px-3 py-2">Consenso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground/85">
                  <tr>
                    <td className="px-3 py-2 font-medium">Tecnici</td>
                    <td className="px-3 py-2">Funzionamento del sito, preferenze di lingua, sessione.</td>
                    <td className="px-3 py-2">Sessione / 12 mesi</td>
                    <td className="px-3 py-2">Non richiesto</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Preferenze</td>
                    <td className="px-3 py-2">Memorizzazione delle scelte sui cookie (questo banner).</td>
                    <td className="px-3 py-2">12 mesi</td>
                    <td className="px-3 py-2">Non richiesto</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Analitici di terze parti</td>
                    <td className="px-3 py-2">Google Analytics — statistiche aggregate sulla navigazione.</td>
                    <td className="px-3 py-2">Fino a 14 mesi</td>
                    <td className="px-3 py-2">Sì</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Marketing</td>
                    <td className="px-3 py-2">Attualmente non utilizzati.</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">Sì</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <H>Cookie di terze parti</H>
            <P>
              Il sito può utilizzare servizi forniti da terze parti che installano propri cookie:
              Google (Analytics, Site Verification) — per maggiori informazioni e per esercitare
              l'opt-out, consultare:{" "}
              <a className="underline hover:text-accent" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer noopener">policies.google.com/privacy</a>.
            </P>

            <H>Gestione del consenso</H>
            <P>
              Al primo accesso viene mostrato un banner che consente di accettare, rifiutare o
              personalizzare le categorie di cookie. I cookie non tecnici sono installati solo dopo
              il rilascio del consenso. È possibile modificare le proprie scelte in qualsiasi
              momento:
            </P>
            <button
              onClick={openCookiePreferences}
              className="mt-4 inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Gestisci preferenze cookie
            </button>

            <H>Disabilitazione tramite browser</H>
            <P>
              In aggiunta al banner, è possibile disabilitare i cookie direttamente dalle
              impostazioni del browser. Le istruzioni sono disponibili nelle pagine di supporto di
              Chrome, Firefox, Safari ed Edge.
            </P>

            <H>Titolare</H>
            <P>
              FriuliOn di Silvestre Richieri Caio, Via Piave 91, 33033 Codroipo (UD) — P. IVA 0357410303. Per
              maggiori informazioni si rinvia alla{" "}
              <a href="/privacy" className="underline hover:text-accent">Informativa Privacy</a>.
            </P>
          </>
        ) : (
          <>
            <H>What are cookies</H>
            <P>
              Cookies are small text files stored on the user's device while browsing. They allow
              the site to work correctly, remember preferences and, in some cases, collect usage
              statistics.
            </P>
            <H>Categories of cookies used</H>
            <P>
              <strong>Strictly necessary</strong> — site operation, language preference, session.
              No consent required.<br />
              <strong>Preferences</strong> — store your cookie choices. No consent required.<br />
              <strong>Third-party analytics</strong> — Google Analytics, aggregate browsing
              statistics. Consent required.<br />
              <strong>Marketing</strong> — not currently used. Consent required.
            </P>
            <H>Third-party cookies</H>
            <P>
              The site may use third-party services that install their own cookies: Google
              (Analytics, Site Verification). See{" "}
              <a className="underline hover:text-accent" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer noopener">policies.google.com/privacy</a>.
            </P>
            <H>Managing consent</H>
            <P>
              On first visit, a banner lets you accept, reject or customise cookie categories. You
              can change your choices at any time:
            </P>
            <button
              onClick={openCookiePreferences}
              className="mt-4 inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Manage cookie preferences
            </button>
            <H>Controller</H>
            <P>
              Piergiorgio Iacuzzo, Via Piave 91, 33033 Codroipo (UD) — Tax code CZZPGR66A24C817Q.
              See the <a href="/privacy" className="underline hover:text-accent">Privacy Policy</a>{" "}
              for more information.
            </P>
          </>
        )}
      </article>
    </>
  );
}
