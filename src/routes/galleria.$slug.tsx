import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { getAlbumBySlug } from "../lib/content.functions";

const albumQO = (slug: string) =>
  queryOptions({
    queryKey: ["gallery-album", slug],
    queryFn: () => getAlbumBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/galleria/$slug")({
  loader: async ({ context, params }) => {
    const r = await context.queryClient.ensureQueryData(albumQO(params.slug));
    if (!r.album) throw notFound();
    return r;
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.album;
    const title = a?.title_it ?? "Album";
    const url = `https://piergiorgioiacuzzo.it/galleria/${params.slug}`;
    return {
      meta: [
        { title: `${title} — Galleria` },
        { name: "description", content: a?.description_it || `Foto dall'album ${title}.` },
        { property: "og:title", content: title },
        { property: "og:url", content: url },
        ...(a?.cover_url ? [{ property: "og:image", content: a.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AlbumPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl">404</h1>
      <Link to="/galleria" className="mt-4 inline-block text-primary hover:text-accent">
        ← Galleria
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function AlbumPage() {
  const { lang } = useT();
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(albumQO(slug));
  const album = data.album!;
  const photos = data.photos;
  const [active, setActive] = useState<number | null>(null);

  const title = lang === "it" ? album.title_it : album.title_en || album.title_it;
  const description =
    lang === "it" ? album.description_it : album.description_en || album.description_it;

  return (
    <>
      <PageHero eyebrow={"Album"} title={title} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Link
          to="/galleria"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
        >
          ← Tutti gli album
        </Link>
        {description && (
          <p className="mt-6 max-w-2xl text-base text-muted-foreground">{description}</p>
        )}
        <div className="mt-8">
          {photos.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Nessuna foto.</p>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
              {photos.map((p, i) => {
                const caption = lang === "it" ? p.caption_it : p.caption_en;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActive(i)}
                    className="group block w-full overflow-hidden rounded-md border border-border bg-card text-left"
                  >
                    <img
                      src={p.url}
                      alt={caption || ""}
                      loading="lazy"
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    {caption && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">{caption}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {active !== null && photos[active] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
        >
          <img
            src={photos[active].url}
            alt={(lang === "it" ? photos[active].caption_it : photos[active].caption_en) || ""}
            className="max-h-[90vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </>
  );
}
