import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { db } from "@/integrations/pierina/client";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";

const blogList = queryOptions({
  queryKey: ["blog-list"],
  queryFn: async () => {
    const { data, error } = await db
      .from("posts")
      .select("id,title,slug,excerpt,featured_image,published_at")
      .order("published_at", { ascending: false })
      .limit(60);
    if (error) throw error;
    return data ?? [];
  },
});

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Pierina Gallina" },
      { name: "description", content: "Racconti, riflessioni e cronache dalla scuola e dal Friuli, di Pierina Gallina." },
      { property: "og:title", content: "Blog — Pierina Gallina" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(blogList),
  component: BlogPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Nessun articolo</div>,
});

function stripHtml(s: string | null | undefined, max = 200) {
  if (!s) return "";
  const txt = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.length > max ? txt.slice(0, max) + "…" : txt;
}

function BlogPage() {
  const { data: posts } = useSuspenseQuery(blogList);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={<>Racconti, ricordi, <span className="italic" style={{ color: "var(--brand-gold)" }}>parole.</span></>}
        intro="Cronache di scuola, viaggi della memoria, incontri del cuore. Tutti i miei articoli, dal più recente."
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessun articolo disponibile.</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p, i) => (
              <Reveal key={p.id} as="li" delay={Math.min(i, 6) * 60}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group grid gap-6 py-8 md:grid-cols-[200px_1fr] md:gap-8"
                >
                  {p.featured_image ? (
                    <div className="photo-frame aspect-[4/3] overflow-hidden md:aspect-square">
                      <img src={p.featured_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-md bg-secondary md:aspect-square" />
                  )}
                  <div className="flex flex-col justify-center">
                    {p.published_at && (
                      <time className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {new Date(p.published_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                      </time>
                    )}
                    <h2 className="mt-2 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-accent md:text-3xl">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {stripHtml(p.excerpt, 220)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
