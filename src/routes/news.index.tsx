import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { getNewsList } from "../lib/content.functions";
import { ArrowRight } from "lucide-react";

const newsQO = queryOptions({
  queryKey: ["news-list"],
  queryFn: () => getNewsList(),
});

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News — Atletica 2000 e Codroipo C'è" },
      {
        name: "description",
        content: "Aggiornamenti, comunicati e racconti dal territorio del Medio Friuli.",
      },
      { property: "og:title", content: "News — Piergiorgio Iacuzzo" },
      { property: "og:description", content: "Aggiornamenti, comunicati e racconti dal territorio del Medio Friuli." },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/news" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/news" }],
  }),

  loader: ({ context }) => context.queryClient.ensureQueryData(newsQO),
  component: NewsPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function NewsPage() {
  const { t, lang } = useT();
  const { data } = useSuspenseQuery(newsQO);
  const news = data.news;

  return (
    <>
      <PageHero eyebrow={t("news_tag")} title={t("news_title")} />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {news.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">{t("news_empty")}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {news.map((n, i) => {
              const title = lang === "it" ? n.title_it : n.title_en;
              const excerpt = lang === "it" ? n.excerpt_it : n.excerpt_en;
              const date = new Date(n.published_at).toLocaleDateString(
                lang === "it" ? "it-IT" : "en-GB",
                { day: "2-digit", month: "short", year: "numeric" },
              );
              return (
                <Reveal key={n.id} delay={i * 70}>
                  <Link
                    to="/news/$slug"
                    params={{ slug: n.slug }}
                    className="group block h-full overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                  >
                    {n.cover_url && (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        <img
                          src={n.cover_url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {date}
                      </div>
                      <h2 className="mt-3 font-serif text-2xl leading-tight text-foreground">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {excerpt}
                        </p>
                      )}
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-accent">
                        {t("news_read")} <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
