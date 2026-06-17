import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export const Route = createFileRoute("/meeting")({
  head: () => ({
    meta: [
      { title: "Atletica 2000 Meeting — Codroipo" },
      {
        name: "description",
        content:
          "Il meeting internazionale di atletica leggera che porta a Codroipo atleti da tutta Europa.",
      },
      { property: "og:title", content: "Atletica 2000 Meeting" },
      {
        property: "og:description",
        content: "Top 5 in Italia · World Athletics Continental Tour.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/meeting" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/meeting" }],
  }),
  component: MeetingPage,
});


function MeetingPage() {
  const { t } = useT();
  const cards = [
    { t: t("meeting_card1_title"), d: t("meeting_card1_text") },
    { t: t("meeting_card2_title"), d: t("meeting_card2_text") },
    { t: t("meeting_card3_title"), d: t("meeting_card3_text") },
  ];
  return (
    <>
      <PageHero eyebrow={t("meeting_tag")} title={t("meeting_title")} />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="h-full rounded-md border border-border bg-card p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  0{i + 1}
                </div>
                <div className="mt-3 font-serif text-2xl text-foreground">{c.t}</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
