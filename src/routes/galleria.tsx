import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { getAlbums } from "../lib/content.functions";
import { Images } from "lucide-react";

const albumsQO = queryOptions({
  queryKey: ["gallery-albums"],
  queryFn: () => getAlbums(),
});

export const Route = createFileRoute("/galleria")({
  head: () => ({
    meta: [
      { title: "Galleria — Atletica 2000 e Codroipo C'è" },
      {
        name: "description",
        content: "Album fotografici: pista, meeting, eventi del Medio Friuli.",
      },
      { property: "og:title", content: "Galleria — Piergiorgio Iacuzzo" },
      { property: "og:description", content: "Album fotografici dagli eventi del Medio Friuli." },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/galleria" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/galleria" }],
  }),

  loader: ({ context }) => context.queryClient.ensureQueryData(albumsQO),
  component: GalleryPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function GalleryPage() {
  const { t, lang } = useT();
  const { data } = useSuspenseQuery(albumsQO);
  const { albums, counts, uncategorized } = data;

  const cards: Array<{
    slug: string;
    title: string;
    cover: string | null;
    count: number;
  }> = albums.map((a) => ({
    slug: a.slug,
    title: lang === "it" ? a.title_it : a.title_en || a.title_it,
    cover: a.cover_url,
    count: counts[a.id] ?? 0,
  }));

  if (uncategorized > 0) {
    cards.push({
      slug: "_uncategorized",
      title: lang === "it" ? "Senza album" : "Uncategorized",
      cover: null,
      count: uncategorized,
    });
  }

  return (
    <>
      <PageHero eyebrow={t("galleria_tag")} title={t("galleria_title")} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {cards.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {t("agenda_empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Link
                key={c.slug}
                to="/galleria/$slug"
                params={{ slug: c.slug }}
                className="group block overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  {c.cover ? (
                    <img
                      src={c.cover}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Images size={40} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-4">
                  <h2 className="font-serif text-xl text-foreground">{c.title}</h2>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {c.count} {c.count === 1 ? "foto" : "foto"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
