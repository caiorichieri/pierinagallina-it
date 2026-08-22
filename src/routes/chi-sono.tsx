import { createFileRoute, Link } from "@tanstack/react-router";
import { ChiSonoHero } from "@/components/ChiSonoHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/chi-sono")({
  head: () => ({
    meta: [
      { title: "Chi sono — Pierina Gallina" },
      { name: "description", content: "Pierina Gallina, tessitrice di storie: giornalista, scrittrice e poetessa di Codroipo (Friuli). Nove libri, poesie, fiabe e articoli." },
      { property: "og:title", content: "Chi sono — Pierina Gallina" },
      { property: "og:description", content: "Giornalista, scrittrice, poetessa di Codroipo (Friuli). Scrivo anche quando non scrivo." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://www.pierinagallina.it/chi-sono" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.pierinagallina.it/chi-sono" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Pierina Gallina",
          jobTitle: "Giornalista, scrittrice, poetessa",
          description: "Tessitrice di storie: giornalista pubblicista, scrittrice e poetessa di Codroipo (Friuli), autrice di nove libri.",
          url: "https://www.pierinagallina.it/chi-sono",
          address: { "@type": "PostalAddress", addressLocality: "Codroipo", addressRegion: "Friuli-Venezia Giulia", addressCountry: "IT" },
        }),
      },
    ],
  }),

  component: ChiSonoPage,
});

function ChiSonoPage() {
  return (
    <>
      <ChiSonoHero />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <figure className="surface-bordeaux relative overflow-hidden rounded-md px-7 py-8 text-primary-foreground sm:px-10">
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-0 font-serif text-[7rem] leading-none opacity-30"
              style={{ color: "var(--brand-gold)" }}
            >
              &ldquo;
            </span>
            <blockquote className="relative font-serif text-2xl italic leading-snug sm:text-3xl">
              Scrivo anche quando non scrivo.
              <span
                aria-hidden
                className="ml-1 align-baseline font-serif not-italic opacity-40"
                style={{ color: "var(--brand-gold)" }}
              >
                &rdquo;
              </span>
            </blockquote>
          </figure>
        </Reveal>

        <Reveal delay={80}>
          <div className="prose-pierina mt-10 font-serif text-lg leading-relaxed text-foreground/90">

            <p className="mt-5">
              Raccolgo storie ed emozioni. A volte diventano poesie, altre fiabe, racconti o articoli
              di giornale.
            </p>
            <p className="mt-5">
              Per quarantadue anni ho insegnato nella Scuola dell'Infanzia (36 a Rivolto-Codroipo,
              Udine) e, da oltre quarant'anni, collaboro come giornalista pubblicista con il
              Messaggero Veneto, Il Ponte e Il Paese. Strade diverse, ma unite dallo stesso desiderio:
              raccontare le persone e seminare parole che lascino traccia. Come Pollicino sulla strada
              del bosco.
            </p>
            <p className="mt-5">
              Ho pubblicato nove libri: tre raccolte di poesie (<em>Come aerei di carta</em>,{" "}
              <em>Come petali di luna</em> e <em>Come angeli in vacanza</em>), quattro fiabe (
              <em>Il volo perfetto di Massimo il Folletto</em>,{" "}
              <em>La Principessa TIC e il Pirata TAC nel pianeta Fifablu</em>, <em>Un anno da Fiaba</em>{" "}
              e <em>Gastone, il tassista coccolone</em>) e due saggi (<em>NONNI</em> e{" "}
              <em>Vita da emotiva</em>).
            </p>
            <p className="mt-5">
              Ho vinto numerosi concorsi letterari, tra cui il Premio Andersen. Ma il riconoscimento
              più bello resta quando qualcuno mi dice: «Mi sono ritrovato nelle tue parole».
            </p>
            <p className="mt-5">
              Sono sette volte nonna, tre volte madre e una volta moglie, da oltre cinquant'anni. Amo
              le persone, il canto, il ballo, il teatro, imparare e viaggiare. Annuso il mondo e poi lo
              racconto. In lingua italiana e friulana.
            </p>
            <p className="mt-5">Sono nata nel 1952 a Codroipo (Ud), dove vivo.</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { n: "42", l: "anni di scuola dell'infanzia" },
              { n: "40+", l: "anni di giornalismo" },
              { n: "30", l: "anni di viaggi" },
              { n: "9", l: "libri pubblicati" },
              { n: "7", l: "volte nonna" },
            ].map((s) => (
              <div key={s.n} className="stat-card bg-card px-4 py-5 text-center">
                <div className="font-serif text-3xl" style={{ color: "var(--brand-gold)" }}>{s.n}</div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to="/libri"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              I miei libri <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/scritti"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
            >
              Gli scritti
            </Link>
            <Link
              to="/contatti"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
            >
              Scrivimi
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
