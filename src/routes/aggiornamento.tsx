import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/aggiornamento")({
  head: () => ({
    meta: [
      { title: "Sito in aggiornamento — Pierina Gallina" },
      {
        name: "description",
        content:
          "Il sito di Pierina Gallina è temporaneamente in aggiornamento. Torneremo presto con libri, fiabe, poesie e racconti dal Friuli.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sito in aggiornamento — Pierina Gallina" },
      {
        property: "og:description",
        content:
          "Stiamo lavorando per migliorare il sito di Pierina Gallina. Torneremo presto online.",
      },
    ],
  }),
  component: AggiornamentoPage,
});

function AggiornamentoPage() {
  return (
    <section className="surface-bordeaux surface-bordeaux-glow relative flex min-h-[calc(100vh-8rem)] items-center overflow-hidden text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-line" style={{ top: "28%", animationDelay: "0s" }} />
        <div className="hero-line" style={{ top: "72%", animationDelay: "3s" }} />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
          <Clock size={13} className="text-accent" />
          Lavori in corso
        </div>

        <h1 className="mt-6 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Il sito è in aggiornamento
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
          Stiamo rinnovando le pagine di Pierina Gallina — libri, fiabe sonore,
          poesie, fotografie e racconti dal Friuli. Torniamo online tra pochissimo:
          grazie per la pazienza.
        </p>

        <p className="mt-4 font-serif text-lg italic text-accent">
          «Paroliera per passione»
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/contatti"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
          >
            <Mail size={15} /> Scrivimi
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-primary-foreground/25 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </section>
  );
}
