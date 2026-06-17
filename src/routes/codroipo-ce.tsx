import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export const Route = createFileRoute("/codroipo-ce")({
  head: () => ({
    meta: [
      { title: "Codroipo C'è — attività produttive del Medio Friuli" },
      {
        name: "description",
        content:
          "L'associazione delle attività produttive del Medio Friuli, presieduta da Piergiorgio Iacuzzo.",
      },
      { property: "og:title", content: "Codroipo C'è" },
      {
        property: "og:description",
        content: "Far crescere il valore del territorio del Medio Friuli.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/codroipo-ce" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/codroipo-ce" }],
  }),
  component: CodroipoPage,
});


function CodroipoPage() {
  const { t } = useT();
  return (
    <>
      <PageHero eyebrow={t("codroipo_tag")} title={t("codroipo_title")} />
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85">
          <Reveal as="p">{t("codroipo_p1")}</Reveal>
          <Reveal as="p" delay={100}>{t("codroipo_p2")}</Reveal>
        </div>
        <Reveal delay={200}>
          <figure className="mt-12 border-l-4 border-accent bg-secondary/50 p-8">
            <blockquote className="font-serif text-2xl italic leading-snug text-foreground">
              {t("codroipo_quote")}
            </blockquote>
            <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("codroipo_quote_attr")}
            </figcaption>
          </figure>
        </Reveal>
      </article>
    </>
  );
}
