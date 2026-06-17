import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Brain, Activity, Smartphone, Sparkles } from "lucide-react";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal, SectionEyebrow } from "../components/Reveal";

import memindHero from "../assets/memindsport-hero.png.asset.json";
import portrait from "../assets/piergiorgio-portrait.jpg.asset.json";
import premiazione from "../assets/piergiorgio-marathon.jpg.asset.json";

export const Route = createFileRoute("/memindsport")({
  head: () => ({
    meta: [
      { title: "Ambasciatore MeMindSport — Piergiorgio Iacuzzo" },
      {
        name: "description",
        content:
          "Piergiorgio Iacuzzo, ambasciatore del progetto MeMindSport: allenamento mentale, disciplina quotidiana e l'app per monitorare performance e conoscenza di sé.",
      },
      { property: "og:title", content: "Ambasciatore MeMindSport — Piergiorgio Iacuzzo" },
      {
        property: "og:description",
        content:
          "Mente, corpo e disciplina quotidiana: il ruolo di Piergiorgio come ambasciatore MeMindSport.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/memindsport" },
      { property: "og:image", content: `https://piergiorgioiacuzzo.it${portrait.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `https://piergiorgioiacuzzo.it${portrait.url}` },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/memindsport" }],
  }),
  component: MeMindSportPage,
});

function MeMindSportPage() {
  const { t } = useT();

  const pillars = [
    { icon: Brain, title: t("mms_pillar1_title"), text: t("mms_pillar1_text") },
    { icon: Activity, title: t("mms_pillar2_title"), text: t("mms_pillar2_text") },
    { icon: Smartphone, title: t("mms_pillar3_title"), text: t("mms_pillar3_text") },
    { icon: Sparkles, title: t("mms_pillar4_title"), text: t("mms_pillar4_text") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("mms_hero_tag")}
        title={
          <>
            {t("mms_hero_title_1")}{" "}
            <span className="italic text-accent">{t("mms_hero_title_2")}</span>
          </>
        }
      />

      {/* Full-bleed hero screenshot from memindsport.it */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <figure className="relative overflow-hidden rounded-md border border-border bg-card shadow-lg">
            <span className="absolute left-3 top-3 z-10 h-3 w-3 border-l border-t border-accent" />
            <span className="absolute right-3 top-3 z-10 h-3 w-3 border-r border-t border-accent" />
            <span className="absolute bottom-3 left-3 z-10 h-3 w-3 border-b border-l border-accent" />
            <span className="absolute bottom-3 right-3 z-10 h-3 w-3 border-b border-r border-accent" />
            <img
              src={memindHero.url}
              alt="MeMindSport — Allena la parte di te che gareggia prima del corpo"
              className="block h-auto w-full"
              loading="eager"
            />
            <figcaption className="flex items-center justify-between border-t border-border bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <span>memindsport.it · Allenamento mentale per sportivi</span>
              <span className="text-accent">✕ ✕ ✕</span>
            </figcaption>
          </figure>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionEyebrow>{t("mms_intro_eyebrow")}</SectionEyebrow>
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            {t("mms_intro_title")}
          </h2>
          <Reveal
            as="p"
            className="mt-6 max-w-3xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-foreground/85"
          >
            {t("mms_intro_text")}
          </Reveal>
          <a
            href="https://www.memindsport.it"
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-8 inline-flex items-center gap-2 border-b border-border pb-1 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
          >
            {t("mms_visit_site")}
            <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionEyebrow>{t("mms_pillars_eyebrow")}</SectionEyebrow>
          <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            {t("mms_pillars_title")}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group h-full overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                  <div className="h-1 w-full bg-accent transition-all group-hover:bg-primary" />
                  <div className="p-6">
                    <p.icon size={22} className="text-accent" />
                    <div className="mt-4 font-serif text-xl text-foreground">{p.title}</div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Daily routine — narrative */}
      <section className="bg-background paper-grain">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="photo-frame">
              <img
                src={premiazione.url}
                alt="Piergiorgio Iacuzzo — disciplina quotidiana"
                className="block h-auto w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionEyebrow>{t("mms_routine_eyebrow")}</SectionEyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              {t("mms_routine_title_1")}{" "}
              <span className="italic text-accent">{t("mms_routine_title_2")}</span>
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/85">
              <Reveal as="p">{t("mms_routine_p1")}</Reveal>
              <Reveal as="p" delay={100}>{t("mms_routine_p2")}</Reveal>
              <Reveal as="p" delay={200}>{t("mms_routine_p3")}</Reveal>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border/60 sm:grid-cols-3">
              <div className="bg-background p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("mms_meta_role")}
                </dt>
                <dd className="mt-1 font-serif text-xl italic">{t("mms_meta_role_value")}</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("mms_meta_project")}
                </dt>
                <dd className="mt-1 font-serif text-xl">MeMindSport</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("mms_meta_focus")}
                </dt>
                <dd className="mt-1 font-serif text-xl">{t("mms_meta_focus_value")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            {t("mms_cta_title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
            {t("mms_cta_text")}
          </p>
          <a
            href="https://www.memindsport.it"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("mms_visit_site")} <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
