import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export const Route = createFileRoute("/bio")({
  head: () => ({
    meta: [
      { title: "Biografia — Piergiorgio Iacuzzo" },
      {
        name: "description",
        content:
          "La storia di Piergiorgio Iacuzzo, imprenditore e presidente delle realtà associative del Medio Friuli.",
      },
      { property: "og:title", content: "Biografia — Piergiorgio Iacuzzo" },
      {
        property: "og:description",
        content:
          "Imprenditore di Codroipo, presidente di ASD Atletica 2000 e Codroipo C'è.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/bio" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/bio" }],
  }),
  component: BioPage,
});


function BioPage() {
  const { t } = useT();
  return (
    <>
      <PageHero
        eyebrow={t("section_bio_tag")}
        title={
          <>
            {t("section_bio_title_1")}{" "}
            <span className="italic text-accent">{t("section_bio_title_2")}</span>
          </>
        }
      />
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85">
          <Reveal as="p">{t("bio_p1")}</Reveal>
          <Reveal as="p" delay={100}>{t("bio_p2")}</Reveal>
          <Reveal as="p" delay={200}>{t("bio_p3")}</Reveal>
          <Reveal as="p" delay={300}>{t("bio_p4")}</Reveal>
        </div>
      </article>
    </>
  );
}
