import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { db, type Post } from "@/integrations/pierina/client";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";

type Category = { id: string; name: string; slug: string; post_count: number };
type PostWithCat = Post & { category_id: string | null };

const blogList = queryOptions({
  queryKey: ["blog-list"],
  queryFn: async (): Promise<{ posts: PostWithCat[]; categories: Category[] }> => {
    const [{ data: posts, error: pe }, { data: cats, error: ce }] = await Promise.all([
      db
        .from("posts")
        .select("id,title,slug,excerpt,featured_image,published_at,content,created_at,category_id")
        .order("published_at", { ascending: false })
        .limit(500),
      db
        .from("categories")
        .select("id,name,slug,post_count")
        .order("post_count", { ascending: false }),
    ]);
    if (pe) throw pe;
    if (ce) throw ce;
    return {
      posts: (posts as PostWithCat[] | null) ?? [],
      categories: ((cats as Category[] | null) ?? []).filter((c) => c.post_count > 0),
    };
  },
});

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Pierina Gallina" },
      {
        name: "description",
        content:
          "Racconti, riflessioni e cronache dalla scuola e dal Friuli, di Pierina Gallina.",
      },
      { property: "og:title", content: "Blog — Pierina Gallina" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(blogList),
  component: BlogPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">
      {(error as Error).message}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Nessun articolo</div>,
});

function stripHtml(s: string | null | undefined, max = 200) {
  if (!s) return "";
  const txt = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.length > max ? txt.slice(0, max) + "…" : txt;
}

function BlogPage() {
  const { data } = useSuspenseQuery(blogList);
  const { posts, categories } = data;
  const [query, setQuery] = useState("");
  const [catId, setCatId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (catId && p.category_id !== catId) return false;
      if (!q) return true;
      const hay = (p.title + " " + stripHtml(p.excerpt, 400)).toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, catId]);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Racconti, ricordi,{" "}
            <span className="italic" style={{ color: "var(--brand-gold)" }}>
              parole.
            </span>
          </>
        }
        intro="Cronache di scuola, viaggi della memoria, incontri del cuore. Tutti i miei articoli, dal più recente."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Search */}
        <div className="relative mx-auto mb-8 max-w-xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un articolo…"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
          />
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <CatChip active={catId === null} onClick={() => setCatId(null)}>
              Tutti <span className="opacity-60">· {posts.length}</span>
            </CatChip>
            {categories.map((c) => (
              <CatChip
                key={c.id}
                active={catId === c.id}
                onClick={() => setCatId(catId === c.id ? null : c.id)}
              >
                {c.name} <span className="opacity-60">· {c.post_count}</span>
              </CatChip>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nessun articolo trovato.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 60).map((p, i) => {
              const date = p.published_at
                ? new Date(p.published_at).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null;
              const cat = categories.find((c) => c.id === p.category_id);
              return (
                <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group block h-full overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                  >
                    {p.featured_image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        <img
                          src={p.featured_image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-secondary" />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {date && <span>{date}</span>}
                        {cat && (
                          <>
                            <span className="h-px w-3 bg-border" />
                            <span className="text-accent">{cat.name}</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-3 font-serif text-2xl leading-tight text-foreground">
                        {p.title}
                      </h2>
                      {p.excerpt && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {stripHtml(p.excerpt, 160)}
                        </p>
                      )}
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-accent">
                        Leggi <ArrowRight size={14} />
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

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors " +
        (active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
