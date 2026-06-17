import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Award, Brain } from "lucide-react";
import { useT } from "../i18n";
import { Reveal, SectionEyebrow } from "../components/Reveal";
import portrait from "../assets/piergiorgio-cutout.png.asset.json";
import marathonCutout from "../assets/piergiorgio-marathon-cutout.png.asset.json";
import medal from "../assets/medaglia-paralimpico.jpg.asset.json";
import logoAtletica from "../assets/logo-atletica-2000.png.asset.json";
import logoCodroipo from "../assets/logo-codroipo-ce.png.asset.json";
import logoSportCity from "../assets/logo-fondazione-sport-city.png.asset.json";
import logoPGFriuli from "../assets/logo-pg-friuli-trasparente.png.asset.json";
import memindHero from "../assets/memindsport-hero.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Piergiorgio Iacuzzo — Atletica 2000 e Codroipo C'è" },
      {
        name: "description",
        content:
          "Imprenditore del Medio Friuli, presidente di ASD Atletica 2000 e di Codroipo C'è. Vent'anni al servizio dello sport e della comunità.",
      },
      { property: "og:title", content: "Piergiorgio Iacuzzo — Medio Friuli" },
      {
        property: "og:description",
        content:
          "Vent'anni al servizio dello sport e della comunità del Medio Friuli.",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/" },
      { property: "og:image", content: `https://piergiorgioiacuzzo.it${portrait.url}` },
      { property: "og:image:width", content: "800" },
      { property: "og:image:height", content: "1000" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `https://piergiorgioiacuzzo.it${portrait.url}` },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/" }],
  }),
  component: HomePage,
});


function HomePage() {
  const { t } = useT();
  const valori = [
    { t: t("valore1_title"), d: t("valore1_text") },
    { t: t("valore2_title"), d: t("valore2_text") },
    { t: t("valore3_title"), d: t("valore3_text") },
    { t: t("valore4_title"), d: t("valore4_text") },
  ];

  return (
    <>
      {/* HERO — editorial composition: yellow disc + cutout figure + watermark logo */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hero-line" style={{ top: "22%", animationDelay: "0s" }} />
          <div className="hero-line" style={{ top: "58%", animationDelay: "2.5s" }} />
          {/* large watermark stamp logo */}
          <img
            src={logoPGFriuli.url}
            alt=""
            className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 select-none opacity-[0.07] md:-left-16 md:h-[34rem] md:w-[34rem]"
          />
          <div
            className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full opacity-15 blur-3xl"
            style={{ background: "var(--brand-yellow)" }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flag-italy" aria-label="Italia">
                <span /><span /><span />
              </span>
              <span className="flag-friuli" aria-label="Friuli">FVG</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">
                {t("hero_tag")}
              </span>
            </div>

            <h1 className="mt-6 font-serif text-5xl leading-[1.04] tracking-tight sm:text-6xl md:text-7xl">
              Piergiorgio
              <br />
              <span className="italic text-accent">Iacuzzo.</span>
            </h1>

            <ol className="mt-8 max-w-2xl divide-y divide-primary-foreground/10 border-y border-primary-foreground/10">
              {([
                ["I", t("hero_role_1_kind"), t("hero_role_1_org")],
                ["II", t("hero_role_2_kind"), t("hero_role_2_org")],
                ["III", t("hero_role_3_kind"), t("hero_role_3_org")],
                ["IV", t("hero_role_4_kind"), t("hero_role_4_org")],
              ] as const).map(([roman, kind, org]) => (
                <li
                  key={roman}
                  className="grid grid-cols-[2.5rem_minmax(0,7rem)_1fr] items-baseline gap-x-4 py-3 sm:grid-cols-[2.75rem_8rem_1fr]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {roman}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary-foreground/55">
                    {kind}
                  </span>
                  <span className="font-serif text-lg leading-tight text-primary-foreground sm:text-xl">
                    {org}
                  </span>
                </li>
              ))}
            </ol>


            <p className="mt-7 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              {t("hero_desc")}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/bio"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                {t("nav_bio")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contatti"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                {t("nav_contatti")}
              </Link>
            </div>
          </div>

          {/* Portrait composition: yellow disc + cutout figure */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:ml-auto">
            <div className="relative aspect-[4/5] w-full">
              <div
                aria-hidden
                className="absolute inset-x-6 bottom-4 top-20 rounded-full"
                style={{ background: "var(--brand-yellow)" }}
              />
              <img
                src={portrait.url}
                alt="Piergiorgio Iacuzzo"
                width={800}
                height={1000}
                className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto select-none object-contain"
                style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.35))" }}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />

            </div>

            <div className="absolute -bottom-2 -left-2 hidden rounded-md border border-primary-foreground/15 bg-background/95 p-4 text-foreground shadow-xl backdrop-blur sm:block lg:-left-6">
              <div className="font-serif text-3xl leading-none text-primary">456</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("hero_kpi1_label")}
              </div>
            </div>
            <div className="absolute -bottom-2 right-0 hidden rounded-md border border-primary-foreground/15 bg-background/95 p-4 text-foreground shadow-xl backdrop-blur sm:block">
              <div className="font-serif text-3xl leading-none text-primary">5.000</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("hero_kpi2_label")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASSOCIATIONS STRIP — real logos + external links */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <SectionEyebrow>{t("assoc_strip_eyebrow")}</SectionEyebrow>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                href: "https://www.atletica2000.it",
                logo: logoAtletica.url,
                name: t("assoc_atletica_name"),
                role: t("assoc_atletica_role"),
                domain: "atletica2000.it",
              },
              {
                href: "https://www.codroipoce.it",
                logo: logoCodroipo.url,
                name: t("assoc_codroipo_name"),
                role: t("assoc_codroipo_role"),
                domain: "codroipoce.it",
              },
              {
                href: "https://www.sportcity.it",
                logo: logoSportCity.url,
                name: t("assoc_sportcity_name"),
                role: t("assoc_sportcity_role"),
                domain: "sportcity.it",
              },
            ].map((a, i) => (
              <Reveal key={a.href} delay={i * 100}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex h-full items-center gap-5 rounded-md border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-card p-2">
                    <img src={a.logo} alt={a.name} className="h-full w-full object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-2xl text-foreground">{a.name}</span>
                    <span className="block text-sm text-muted-foreground">{a.role}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary group-hover:text-accent">
                      {a.domain} <ExternalLink size={12} />
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AMBASSADOR — Fondazione Sport City (editorial dispatch) */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        {/* oversized year mark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 top-4 select-none font-serif text-[160px] leading-none tracking-tighter text-foreground/[0.04] md:text-[260px] lg:-right-10 lg:top-6"
        >
          2026
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          {/* top dispatch rule */}
          <div className="flex items-center gap-4">
            <SectionEyebrow>
              <Award size={12} className="mr-1.5 inline -translate-y-px text-accent" />
              {t("ambassador_tag")}
            </SectionEyebrow>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              N° 03 · Onorificenze
            </span>
          </div>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* LEFT — seal */}
            <Reveal className="lg:col-span-5">
              <div className="relative">
                <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-background shadow-sm">
                  {/* corner ticks */}
                  <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent" />
                  <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-accent" />
                  <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent" />
                  <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent" />
                  <div className="flex h-full w-full items-center justify-center p-12">
                    <img
                      src={logoSportCity.url}
                      alt="Fondazione Sport City ETS"
                      className="max-h-full w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
                    <span>Sigillo · Roma</span>
                    <span className="text-accent">✕ ✕ ✕</span>
                  </div>
                </div>
                {/* signed-by caption */}
                <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Conferita da</span>
                  <span className="text-foreground/80">Fabio Pagliara</span>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — letterpress dispatch */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
                {t("ambassador_title_1")}{" "}
                <span className="italic text-accent">{t("ambassador_title_2")}</span>
              </h2>

              <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t("ambassador_authority")}
              </div>

              <Reveal
                as="p"
                className="mt-8 max-w-2xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-foreground/85"
              >
                {t("ambassador_text")}
              </Reveal>

              {/* meta strip — dossier style */}
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border/60 sm:grid-cols-3">
                <div className="bg-background p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Anno
                  </dt>
                  <dd className="mt-1 font-serif text-xl">2026</dd>
                </div>
                <div className="bg-background p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Territorio
                  </dt>
                  <dd className="mt-1 font-serif text-xl">Friuli V. G.</dd>
                </div>
                <div className="bg-background p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Incarico
                  </dt>
                  <dd className="mt-1 font-serif text-xl italic">Ambasciatore</dd>
                </div>
              </dl>

              <a
                href="https://www.sportcity.it"
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-8 inline-flex items-center gap-2 border-b border-border pb-1 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
              >
                {t("ambassador_cta")}
                <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MEDAL — Riconoscimento Paralimpico */}
      <section className="relative overflow-hidden bg-background paper-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="photo-frame">
              <img
                src={medal.url}
                alt="Stella di Bronzo al Merito Sportivo — Comitato Italiano Paralimpico"
                className="block h-auto w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionEyebrow>
              <Award size={12} className="mr-1.5 inline -translate-y-px text-accent" />
              {t("medal_tag")}
            </SectionEyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              {t("medal_title")}
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t("medal_authority")}
            </div>
            <Reveal as="p" className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">
              {t("medal_text")}
            </Reveal>
            <Link
              to="/atletica-2000"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
            >
              {t("medal_cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* MEMINDSPORT HIGHLIGHT */}
      <section className="relative overflow-hidden border-y border-border bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-6 select-none font-serif text-[160px] leading-none tracking-tighter text-foreground/[0.04] md:text-[240px]"
        >
          Mind
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <SectionEyebrow>
                <Brain size={12} className="mr-1.5 inline -translate-y-px text-accent" />
                {t("mms_home_eyebrow")}
              </SectionEyebrow>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                N° 04 · Ambasciatore
              </span>
            </div>
            <h2 className="mt-8 font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
              {t("mms_home_title_1")}{" "}
              <span className="italic text-accent">{t("mms_home_title_2")}</span>
            </h2>
            <Reveal
              as="p"
              className="mt-7 max-w-2xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-foreground/85"
            >
              {t("mms_home_text")}
            </Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/memindsport"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                {t("mms_home_cta")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://www.memindsport.it"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                memindsport.it <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <Reveal className="lg:col-span-5">
            <figure className="relative overflow-hidden rounded-md border border-border bg-card shadow-lg">
              <span className="absolute left-3 top-3 z-20 h-3 w-3 border-l border-t border-accent" />
              <span className="absolute right-3 top-3 z-20 h-3 w-3 border-r border-t border-accent" />
              <span className="absolute bottom-3 left-3 z-20 h-3 w-3 border-b border-l border-accent" />
              <span className="absolute bottom-3 right-3 z-20 h-3 w-3 border-b border-r border-accent" />
              <div className="relative">
                <img
                  src={memindHero.url}
                  alt="MeMindSport — Allena la parte di te che gareggia prima del corpo"
                  className="block h-auto w-full"
                  style={{ filter: "brightness(1.25) contrast(0.92) saturate(0.85)", opacity: 0.55 }}
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.25) 100%)" }}
                />
                <img
                  src={marathonCutout.url}
                  alt="Piergiorgio Iacuzzo — ambasciatore MeMindSport"
                  className="pointer-events-none absolute -bottom-14 right-0 z-10 h-[115%] w-auto max-w-none object-contain"
                  style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.35))" }}
                  loading="lazy"
                />

              </div>
              <figcaption className="relative z-10 flex items-center justify-between border-t border-border bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
                <span>memindsport.it · ambasciatore</span>
                <span className="text-accent">✕ ✕ ✕</span>
              </figcaption>
            </figure>
          </Reveal>

        </div>
      </section>

      {/* BIO TEASER */}
      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionEyebrow>{t("section_bio_tag")}</SectionEyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              {t("section_bio_title_1")}{" "}
              <span className="italic text-accent">{t("section_bio_title_2")}</span>
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-foreground/85 lg:col-span-7">
            <Reveal as="p">{t("bio_p1")}</Reveal>
            <Reveal as="p" delay={120}>{t("bio_p3")}</Reveal>
            <Link
              to="/bio"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
            >
              {t("nav_bio")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* VALORI — no numbering, just a colored bar */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionEyebrow>{t("valori_tag")}</SectionEyebrow>
        <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
          {t("valori_title")}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {valori.map((v, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group h-full overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                <div className="h-1 w-full bg-accent transition-all group-hover:bg-primary" />
                <div className="p-6">
                  <div className="font-serif text-xl text-foreground">{v.t}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
