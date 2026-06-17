import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useT } from "../i18n";
import { getNewsBySlug } from "../lib/content.functions";

const slugQO = (slug: string) =>
  queryOptions({
    queryKey: ["news", slug],
    queryFn: () => getNewsBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const r = await context.queryClient.ensureQueryData(slugQO(params.slug));
    if (!r.news) throw notFound();
    return r;
  },
  head: ({ loaderData, params }) => {
    const n = loaderData?.news;
    const title = n?.title_it ?? "News";
    const desc =
      (n?.excerpt_it && n.excerpt_it.trim().length > 0
        ? n.excerpt_it
        : n?.title_it
          ? `${n.title_it} — News dal Medio Friuli.`
          : "Aggiornamenti, comunicati e racconti dal territorio del Medio Friuli.");
    const url = `https://piergiorgioiacuzzo.it/news/${params.slug}`;
    return {
      meta: [
        { title: `${title} — Piergiorgio Iacuzzo` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(n?.cover_url ? [{ property: "og:image", content: n.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: n
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: n.title_it,
                description: desc,
                datePublished: n.published_at,
                ...(n.cover_url ? { image: n.cover_url } : {}),
                author: { "@type": "Person", name: "Piergiorgio Iacuzzo" },
                mainEntityOfPage: url,
              }),
            },
          ]
        : [],
    };
  },

  component: NewsDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl">404</h1>
      <Link to="/news" className="mt-4 inline-block text-primary hover:text-accent">
        ← News
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function NewsDetail() {
  const { t, lang } = useT();
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(slugQO(slug));
  const n = data.news!;
  const title = lang === "it" ? n.title_it : n.title_en;
  const body = lang === "it" ? n.body_it : n.body_en;
  const date = new Date(n.published_at).toLocaleDateString(
    lang === "it" ? "it-IT" : "en-GB",
    { day: "2-digit", month: "long", year: "numeric" },
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        to="/news"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
      >
        {t("news_back")}
      </Link>
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        {date}
      </div>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
        {title}
      </h1>
      {n.cover_url && (
        <img
          src={n.cover_url}
          alt=""
          className="mt-8 w-full rounded-md border border-border object-cover"
        />
      )}
      <div className="prose prose-lg mt-8 max-w-none text-foreground/85">
        <NewsBody text={body || ""} />
      </div>
    </article>
  );
}

function NewsBody({ text }: { text: string }) {
  // Split body on [[img:URL]] tokens and render images inline.
  const parts = text.split(/(\[\[img:[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[img:([^\]]+)\]\]$/);
        if (m) {
          return (
            <img
              key={i}
              src={m[1]}
              alt=""
              loading="lazy"
              className="my-6 w-full rounded-md border border-border object-cover"
            />
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {part}
          </p>
        );
      })}
    </>
  );
}
