import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/chi-sono")({
  head: () => ({
    meta: [
      { title: "Chi sono — Pierina Gallina" },
      { name: "description", content: "Pierina Gallina, scrittrice di Codroipo (Friuli). Un'imbranata cacciatrice di emozioni: le cerca, ma spesso sono loro a trovarla." },
      { property: "og:title", content: "Chi sono — Pierina Gallina" },
      { property: "og:description", content: "Pierina Gallina, scrittrice di Codroipo (Friuli). Un'imbranata cacciatrice di emozioni." },
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
          jobTitle: "Scrittrice e paroliera",
          description: "Scrittrice di Codroipo (Friuli), autrice di fiabe, racconti e poesie.",
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
      <PageHero
        eyebrow="Chi sono"
        title={<>Un'imbranata <span className="italic" style={{ color: "var(--brand-gold)" }}>cacciatrice di emozioni.</span></>}
        intro="Le cerco, ma spesso sono loro a trovare me."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="prose-pierina font-serif text-lg leading-relaxed text-foreground/90">
            <p>
              Scrivo perché le parole mi abitano e per lasciare una traccia, come i semi che il vento
              porta lontano e che, chissà dove, mettono radice. Sono nata e cresciuta a Codroipo, nel
              cuore del Friuli: la lingua di casa è il <em>furlan</em>, quella dei libri è l'italiano,
              e da sempre vivo nel mezzo — fra le due.
            </p>
            <p className="mt-5">
              Sono una che scrive <em>anche quando non scrive</em>. Raccolgo immagini, ascolto dialoghi,
              mi commuovo davanti a un dettaglio. Poi, quando è il momento, trasformo quel dettaglio in
              un racconto umano, un viaggio in una riflessione sul tempo.
            </p>
            <p className="mt-5">
              Per molti anni ho insegnato nelle scuole del Friuli. Da quell'esperienza sono nate le
              fiabe, le filastrocche e i piccoli mondi di carta. Durante il lockdown del 2020 ho
              cominciato a registrare le fiabe con la mia voce — <em>Fata Pierina</em> — per i bambini
              che non potevano andare a scuola: un anno intero di storie, una per ogni settimana.
            </p>
            <p className="mt-5">
              Oggi continuo a scrivere fra le pagine, le radio locali, le presentazioni nelle
              biblioteche e le letture nelle classi. Cerco di dare voce a ciò che rischierebbe di
              passare inosservato: un gesto, uno sguardo, una parola detta piano.
            </p>
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
