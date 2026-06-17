import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { getEvents } from "../lib/content.functions";
import { ExternalLink, MapPin, Calendar } from "lucide-react";

const eventsQO = queryOptions({
  queryKey: ["events"],
  queryFn: () => getEvents(),
});

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda eventi — Codroipo e Medio Friuli" },
      {
        name: "description",
        content: "Tutti i prossimi appuntamenti di Atletica 2000 e Codroipo C'è.",
      },
      { property: "og:title", content: "Agenda eventi — Medio Friuli" },
      { property: "og:description", content: "Tutti i prossimi appuntamenti di Atletica 2000 e Codroipo C'è." },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/agenda" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/agenda" }],
  }),

  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQO),
  component: AgendaPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function AgendaPage() {
  const { t, lang } = useT();
  const { data } = useSuspenseQuery(eventsQO);
  const events = data.events;

  return (
    <>
      <PageHero eyebrow={t("agenda_tag")} title={t("agenda_title")} />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {events.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {t("agenda_empty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {events.map((e, i) => {
              const title = lang === "it" ? e.title_it : e.title_en;
              const desc = lang === "it" ? e.description_it : e.description_en;
              const date = new Date(e.starts_at).toLocaleDateString(
                lang === "it" ? "it-IT" : "en-GB",
                { day: "2-digit", month: "long", year: "numeric" },
              );
              return (
                <Reveal key={e.id} delay={i * 60}>
                  <article className="grid gap-4 rounded-md border border-border bg-card p-6 md:grid-cols-[160px_1fr]">
                    <div className="border-b border-border pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                        <Calendar size={12} /> {date}
                      </div>
                      {e.location && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={12} /> {e.location}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
                      {desc && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {desc}
                        </p>
                      )}
                      {e.url ? (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent"
                        >
                          {t("agenda_view")} <ExternalLink size={13} />
                        </a>
                      ) : (
                        <div className="mt-3 text-xs italic text-muted-foreground">
                          {t("agenda_no_url")}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
