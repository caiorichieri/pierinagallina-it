import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { db, type Post, type Poem, type Category } from "@/integrations/pierina/client";
import { ScrittiHero } from "@/components/ScrittiHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Feather, FileText, Search, X } from "lucide-react";

type Tab = "tutti" | "articoli" | "poesie";

const scrittiQ = queryOptions({
  queryKey: ["scritti-all"],
  queryFn: async (): Promise<{ posts: Post[]; poems: Poem[]; categories: Category[] }> => {
    const [posts, poems, categories] = await Promise.all([
      db.from("posts").select("id,title,slug,excerpt,featured_image,published_at,created_at,category_id").order("published_at", { ascending: false }).limit(2000),
      db.from("poems").select("id,title,slug,content_friulian,content_italian,written_at,sort_order").order("sort_order", { ascending: true }),
      db.from("categories").select("id,name,slug,post_count").order("post_count", { ascending: false }),
    ]);
    if (posts.error) throw posts.error;
    if (poems.error) throw poems.error;
    if (categories.error) throw categories.error;
    return {
      posts: (posts.data as Post[] | null) ?? [],
      poems: (poems.data as Poem[] | null) ?? [],
      categories: (categories.data as Category[] | null) ?? [],
    };
  },
});


export const Route = createFileRoute("/scritti")({
  head: () => ({
    meta: [
      { title: "Scritti — Pierina Gallina" },
      { name: "description", content: "Articoli, racconti e poesie di Pierina Gallina. Parole in friulano e in italiano che nascono dalla terra, dalla scuola e dall'ascolto." },
      { property: "og:title", content: "Scritti — Pierina Gallina" },
      { property: "og:description", content: "Articoli e poesie. Una raccolta di parole che continua a crescere." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scrittiQ),
  component: ScrittiPage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Nessuno scritto</div>,
});

function stripHtml(s: string | null | undefined, max = 180) {
  if (!s) return "";
  const txt = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.length > max ? txt.slice(0, max) + "…" : txt;
}

function formatDateIt(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = d.getUTCDate();
  const month = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"][d.getUTCMonth()];
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

function ScrittiPage() {
  const { data } = useSuspenseQuery(scrittiQ);
  const [tab, setTab] = useState<Tab>("tutti");
  const [visible, setVisible] = useState(12);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const catById = useMemo(
    () => new Map(data.categories.map((c) => [c.id, c])),
    [data.categories],
  );

  // categorie realmente usate dagli articoli
  const usedCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of data.posts) {
      if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([id, n]) => ({ cat: catById.get(id), n }))
      .filter((x): x is { cat: Category; n: number } => Boolean(x.cat))
      .sort((a, b) => b.n - a.n);
  }, [data.posts, catById]);

  const needle = q.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return data.posts.filter((p) => {
      if (cat && p.category_id !== cat) return false;
      if (!needle) return true;
      return (
        p.title.toLowerCase().includes(needle) ||
        stripHtml(p.excerpt, 5000).toLowerCase().includes(needle)
      );
    });
  }, [data.posts, cat, needle]);

  const filteredPoems = useMemo(() => {
    if (!needle) return data.poems;
    return data.poems.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        (p.content_italian ?? "").toLowerCase().includes(needle) ||
        (p.content_friulian ?? "").toLowerCase().includes(needle),
    );
  }, [data.poems, needle]);

  const showArticoli = tab === "tutti" || tab === "articoli";
  const showPoesie = (tab === "tutti" || tab === "poesie") && !cat;
  const visiblePosts = filteredPosts.slice(0, visible);
  const nothing =
    (!showArticoli || filteredPosts.length === 0) &&
    (!showPoesie || filteredPoems.length === 0);

  function reset(fn: () => void) {
    fn();
    setVisible(12);
  }

  return (
    <>
      <ScrittiHero />


      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* ricerca */}
        <div className="mx-auto mb-6 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 focus-within:border-accent">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => reset(() => setQ(e.target.value))}
            placeholder="Cerca tra articoli e poesie…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Cerca tra gli scritti"
          />
          {q && (
            <button type="button" onClick={() => reset(() => setQ(""))} aria-label="Cancella ricerca" className="text-muted-foreground hover:text-accent">
              <X size={15} />
            </button>
          )}
        </div>

        {/* filtro tipo */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {([
            { k: "tutti", label: "Tutti" },
            { k: "articoli", label: "Articoli" },
            { k: "poesie", label: "Poesie" },
          ] as { k: Tab; label: string }[]).map((t) => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => reset(() => setTab(t.k))}
                className={
                  "rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors " +
                  (active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* categorie */}
        {tab !== "poesie" && usedCategories.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => reset(() => setCat(null))}
              className={
                "rounded-full border px-3.5 py-1.5 text-[11px] tracking-wide transition-colors " +
                (cat === null
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent")
              }
            >
              Tutte le categorie
            </button>
            {usedCategories.map(({ cat: c, n }) => (
              <button
                key={c.id}
                type="button"
                onClick={() => reset(() => setCat(cat === c.id ? null : c.id))}
                className={
                  "rounded-full border px-3.5 py-1.5 text-[11px] tracking-wide transition-colors " +
                  (cat === c.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent")
                }
              >
                {c.name} <span className="opacity-60">({n})</span>
              </button>
            ))}
          </div>
        )}

        {/* ARTICOLI */}
        {showArticoli && filteredPosts.length > 0 && (
          <div className="mb-20">
            {tab === "tutti" && (
              <div className="mb-8 flex items-center gap-3">
                <FileText size={16} className="text-accent" />
                <h2 className="font-serif text-2xl italic text-foreground">Articoli e racconti</h2>
                <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {filteredPosts.length}
                </span>
              </div>
            )}
            <div className="grid gap-10 md:grid-cols-2">
              {visiblePosts.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 6) * 80}>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                    {p.featured_image && (
                      <div className="photo-frame mb-5 aspect-[4/3]">
                        <img src={p.featured_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.category_id && catById.get(p.category_id) && (
                        <span className="text-accent">{catById.get(p.category_id)!.name}</span>
                      )}
                      {p.category_id && catById.get(p.category_id) && p.published_at && <span className="opacity-50">·</span>}
                      {p.published_at && <span>{formatDateIt(p.published_at)}</span>}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {stripHtml(p.excerpt, 180)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                      Leggi <ArrowRight size={12} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
            {visible < filteredPosts.length && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + 12)}
                  className="rounded-full border border-border px-6 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Mostra altri articoli
                </button>
              </div>
            )}
          </div>
        )}



        {/* POESIE */}
        {showPoesie && data.poems.length > 0 && (
          <div>
            {tab === "tutti" && (
              <div className="mb-8 flex items-center gap-3">
                <Feather size={16} className="text-accent" />
                <h2 className="font-serif text-2xl italic text-foreground">Poesie</h2>
              </div>
            )}
            <div className="space-y-16">
              {data.poems.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 6) * 80}>
                  <article className="grid gap-8 md:grid-cols-2">
                    <header className="md:col-span-2">
                      <h3 className="font-serif text-3xl italic leading-tight text-foreground md:text-4xl">{p.title}</h3>
                      {p.written_at && (
                        <time className="mt-2 block font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          {new Date(p.written_at).toLocaleDateString("it-IT", { year: "numeric", month: "long" })}
                        </time>
                      )}
                    </header>
                    {p.content_friulian && (
                      <div>
                        <div className="mb-2 font-sans text-[11px] uppercase tracking-[0.2em] text-accent">Furlan</div>
                        <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground/90">{p.content_friulian}</pre>
                      </div>
                    )}
                    {p.content_italian && (
                      <div>
                        <div className="mb-2 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Italiano</div>
                        <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground/90">{p.content_italian}</pre>
                      </div>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {data.posts.length === 0 && data.poems.length === 0 && (
          <p className="text-center text-muted-foreground">Nessuno scritto disponibile al momento.</p>
        )}
      </section>
    </>
  );
}
