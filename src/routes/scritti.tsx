import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { db, type Post, type Poem } from "@/integrations/pierina/client";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Feather, FileText } from "lucide-react";

type Tab = "tutti" | "articoli" | "poesie";

const scrittiQ = queryOptions({
  queryKey: ["scritti-all"],
  queryFn: async (): Promise<{ posts: Post[]; poems: Poem[] }> => {
    const [posts, poems] = await Promise.all([
      db.from("posts").select("id,title,slug,excerpt,featured_image,published_at,content,created_at").order("published_at", { ascending: false }),
      db.from("poems").select("id,title,slug,content_friulian,content_italian,written_at,sort_order").order("sort_order", { ascending: true }),
    ]);
    if (posts.error) throw posts.error;
    if (poems.error) throw poems.error;
    return {
      posts: (posts.data as Post[] | null) ?? [],
      poems: (poems.data as Poem[] | null) ?? [],
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

  const showArticoli = tab === "tutti" || tab === "articoli";
  const showPoesie = tab === "tutti" || tab === "poesie";

  return (
    <>
      <PageHero
        eyebrow="Scritti"
        title={<>Parole che <span className="italic" style={{ color: "var(--brand-gold)" }}>restano.</span></>}
        intro="Articoli, racconti e poesie. Piccoli semi lasciati lungo la strada — in italiano e in friulano."
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* filtro */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
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
                onClick={() => setTab(t.k)}
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

        {/* ARTICOLI */}
        {showArticoli && data.posts.length > 0 && (
          <div className="mb-20">
            {tab === "tutti" && (
              <div className="mb-8 flex items-center gap-3">
                <FileText size={16} className="text-accent" />
                <h2 className="font-serif text-2xl italic text-foreground">Articoli e racconti</h2>
              </div>
            )}
            <div className="grid gap-10 md:grid-cols-2">
              {data.posts.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 6) * 80}>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                    {p.featured_image && (
                      <div className="photo-frame mb-5 aspect-[4/3]">
                        <img src={p.featured_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    {p.published_at && (
                      <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {formatDateIt(p.published_at)}
                      </div>
                    )}
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
