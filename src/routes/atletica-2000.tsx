import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export const Route = createFileRoute("/atletica-2000")({
  head: () => ({
    meta: [
      { title: "ASD Atletica 2000 — la presidenza di Iacuzzo" },
      {
        name: "description",
        content:
          "Vent'anni alla guida della ASD Atletica 2000: 456 atleti, 5.000 persone coinvolte, eccellenza paralimpica.",
      },
      { property: "og:title", content: "ASD Atletica 2000" },
      {
        property: "og:description",
        content: "Eccellenza nazionale dell'atletica dal Medio Friuli.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/atletica-2000" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/atletica-2000" }],
  }),
  component: AtleticaPage,
});


function AtleticaPage() {
  const { t } = useT();
  const stats = [
    { n: "456", l: t("atletica_stat1"), s: t("atletica_stat1_sub") },
    { n: "5.000", l: t("atletica_stat2"), s: t("atletica_stat2_sub") },
    { n: "40", l: t("atletica_stat3"), s: t("atletica_stat3_sub") },
    { n: "25+", l: t("atletica_stat4"), s: t("atletica_stat4_sub") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("atletica_tag")}
        title={
          <>
            {t("atletica_title_1")}{" "}
            <span className="italic">{t("atletica_title_2")}</span>{" "}
            <span className="text-accent">{t("atletica_title_3")}</span>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((k, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="h-full rounded-md border border-border bg-card p-6">
                <div className="font-serif text-4xl text-primary">{k.n}</div>
                <div className="mt-3 text-sm font-semibold text-foreground">{k.l}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {k.s}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85">
          <Reveal as="p">{t("atletica_p1")}</Reveal>
          <Reveal as="p" delay={100}>{t("atletica_p2")}</Reveal>
          <Reveal as="p" delay={200}>{t("atletica_p3")}</Reveal>
          <Reveal as="p" delay={300}>{t("atletica_p4")}</Reveal>
          <Reveal as="p" delay={400}>{t("atletica_p5")}</Reveal>
        </div>
      </article>
    </>
  );
}
