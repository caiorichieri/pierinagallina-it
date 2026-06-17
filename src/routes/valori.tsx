import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export const Route = createFileRoute("/valori")({
  head: () => ({
    meta: [
      { title: "Valori — Piergiorgio Iacuzzo" },
      {
        name: "description",
        content: "I quattro principi che guidano l'azione di Piergiorgio Iacuzzo.",
      },
      { property: "og:title", content: "Valori — Piergiorgio Iacuzzo" },
      {
        property: "og:description",
        content: "Territorio, concretezza, inclusione, squadra.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/valori" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/valori" }],
  }),
  component: ValoriPage,
});


function ValoriPage() {
  const { t } = useT();
  const items = [
    { t: t("valore1_title"), d: t("valore1_text") },
    { t: t("valore2_title"), d: t("valore2_text") },
    { t: t("valore3_title"), d: t("valore3_text") },
    { t: t("valore4_title"), d: t("valore4_text") },
  ];
  return (
    <>
      <PageHero eyebrow={t("valori_tag")} title={t("valori_title")} />
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((v, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group h-full overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                <div className="h-1 w-full bg-accent transition-all group-hover:bg-primary" />
                <div className="p-8">
                  <div className="font-serif text-3xl text-foreground">{v.t}</div>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{v.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
