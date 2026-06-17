import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/chi-sono")({
  head: () => ({
    meta: [
      { title: "Chi sono — Pierina Gallina" },
      { name: "description", content: "Pierina Gallina, scrittrice di Codroipo (Friuli), paroliera per passione. Maestra, autrice di fiabe, poesie e racconti." },
      { property: "og:title", content: "Chi sono — Pierina Gallina" },
    ],
  }),
  component: ChiSonoPage,
});

function ChiSonoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi sono"
        title={<>Pierina Gallina, <span className="italic" style={{ color: "var(--brand-gold)" }}>paroliera per passione.</span></>}
        intro="Scrittrice di Codroipo, nel cuore del Friuli. Maestra per scelta, narratrice per vocazione."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="prose-pierina font-serif text-lg leading-relaxed text-foreground/90">
            <p>
              Sono nata e cresciuta a Codroipo, fra le rogge e i campi della Bassa friulana. La lingua di
              casa è il <em>furlan</em>; quella dei libri è l'italiano. Da sempre vivo nel mezzo, fra le
              due, e da sempre <strong>scrivo</strong>: storie per bambini, poesie, ricordi.
            </p>
            <p className="mt-5">
              Per molti anni ho insegnato nelle scuole del Friuli. Da quell'esperienza nascono le fiabe,
              le filastrocche e i piccoli mondi di carta che oggi raccolgo in libri, fiabe sonore e blog.
              Durante il lockdown del 2020 ho cominciato a registrare le fiabe con la mia voce —
              "Fata Pierina" — per i bambini che non potevano andare a scuola: un anno intero di storie,
              una per ogni settimana.
            </p>
            <p className="mt-5">
              Continuo a scrivere fra le pagine, le radio locali, le presentazioni nelle biblioteche e
              le letture nelle classi. Le parole, per me, restano semi: si seminano, si custodiscono, e
              ogni tanto fioriscono in qualcun altro.
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
