import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Feather, Headphones, Image as ImageIcon, Mail } from "lucide-react";
import { db, type Post, type Book, type Poem } from "@/integrations/pierina/client";
import { Reveal } from "@/components/Reveal";

const homeData = queryOptions({
  queryKey: ["home-pierina"],
  queryFn: async (): Promise<{ posts: Post[]; books: Book[]; poems: Poem[] }> => {
    const [posts, books, poems] = await Promise.all([
      db.from("posts").select("id,title,slug,excerpt,featured_image,published_at,content,created_at").order("published_at", { ascending: false }).limit(3),
      db.from("books").select("id,title,year,price,description,buy_url,youtube_id,type,cover_url,sort_order").order("sort_order", { ascending: true }).limit(3),
      db.from("poems").select("id,title,slug,content_friulian,content_italian,written_at,sort_order").order("sort_order", { ascending: true }).limit(2),
    ]);
    return {
      posts: (posts.data as Post[] | null) ?? [],
      books: (books.data as Book[] | null) ?? [],
      poems: (poems.data as Poem[] | null) ?? [],
    };
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pierina Gallina — scrittrice di Codroipo, Friuli" },
      {
        name: "description",
        content:
          "Pierina Gallina, scrittrice di Codroipo (Friuli) — paroliera per passione. Libri, fiabe sonore, poesie in friulano e italiano.",
      },
      { property: "og:title", content: "Pierina Gallina — paroliera per passione" },
      {
        property: "og:description",
        content: "Scrittrice di Codroipo (Friuli). Libri, fiabe sonore, poesie e fotografie.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeData),
  component: HomePage,
});

function stripHtml(s: string | null | undefined, max = 180) {
  if (!s) return "";
  const txt = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.length > max ? txt.slice(0, max) + "…" : txt;
}

function HomePage() {
  const { data } = useSuspenseQuery(homeData);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hero-line" style={{ top: "24%", animationDelay: "0s" }} />
          <div className="hero-line" style={{ top: "62%", animationDelay: "2.5s" }} />
          <div
            className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--brand-gold)" }}
          />
          <div
            className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full opacity-15 blur-3xl"
            style={{ background: "var(--brand-magenta)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
          <div className="flex items-center gap-3">
            <span className="flag-italy" aria-label="Italia"><span /><span /><span /></span>
            <span className="flag-friuli" aria-label="Friuli">FVG</span>
            <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-primary-foreground/70">
              Codroipo · Friuli
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Pierina
            <br />
            <span className="italic" style={{ color: "var(--brand-gold)" }}>Gallina.</span>
          </h1>

          <p className="mt-8 max-w-2xl font-serif text-xl italic leading-snug text-primary-foreground/85 md:text-2xl">
            Scrittrice di Codroipo, Friuli &nbsp;—&nbsp; paroliera per passione.
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
            Libri per bambini, fiabe sonore, poesie in friulano e in italiano. Parole che nascono dalla
            terra, dalla scuola, dal vento di casa.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Leggi il blog
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contatti"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Scrivimi
            </Link>
          </div>
        </div>
      </section>

      {/* SEZIONI — mondo letterario */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, t: "Libri", d: "Fiabe e racconti illustrati", href: "/blog" },
              { icon: Headphones, t: "Fiabe sonore", d: "Voci, suoni, storie da ascoltare", href: "/blog" },
              { icon: Feather, t: "Poesie", d: "In friulano e in italiano", href: "/blog" },
              { icon: ImageIcon, t: "Fotografie", d: "Momenti, incontri, paesaggi", href: "/blog" },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 80}>
                <Link
                  to={s.href}
                  className="group flex h-full flex-col rounded-md border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <s.icon size={22} className="text-accent" />
                  <div className="mt-4 font-serif text-2xl text-foreground">{s.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:text-accent">
                    Esplora <ArrowRight size={12} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG RECENTI */}
      {data.posts.length > 0 && (
        <section className="relative overflow-hidden bg-background paper-grain">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Dal blog
                </div>
                <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Ultimi racconti</h2>
              </div>
              <Link to="/blog" className="hidden text-sm font-medium text-primary hover:text-accent sm:inline-flex sm:items-center sm:gap-1.5">
                Tutti gli articoli <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {data.posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group block"
                  >
                    {p.featured_image && (
                      <div className="photo-frame mb-5 aspect-[4/3]">
                        <img
                          src={p.featured_image}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    {p.published_at && (
                      <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {new Date(p.published_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    )}
                    <h3 className="mt-2 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {stripHtml(p.excerpt, 160)}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIBRI */}
      {data.books.length > 0 && (
        <section className="relative overflow-hidden border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Libri
            </div>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
              Le pagine che ho seminato.
            </h2>

            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {data.books.map((b, i) => (
                <Reveal key={b.id} delay={i * 100}>
                  <article className="group">
                    {b.cover_url ? (
                      <div className="photo-frame aspect-[3/4]">
                        <img src={b.cover_url} alt={b.title} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex aspect-[3/4] items-center justify-center rounded-md bg-primary p-8 text-primary-foreground">
                        <span className="text-center font-serif text-2xl italic leading-tight">{b.title}</span>
                      </div>
                    )}
                    <div className="mt-5 flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-2xl leading-tight text-foreground">{b.title}</h3>
                      {b.year && <span className="font-sans text-xs text-muted-foreground">{b.year}</span>}
                    </div>
                    {b.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                        {b.description}
                      </p>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* POESIA */}
      {data.poems.length > 0 && (
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div
              className="absolute -right-20 top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--brand-gold)" }}
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
            <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.22em] text-primary-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} /> Poesia
            </div>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
              Versi in friulano <span className="italic" style={{ color: "var(--brand-gold)" }}>e in italiano.</span>
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {data.poems.map((p, i) => (
                <Reveal key={p.id} delay={i * 120}>
                  <article className="border-l-2 pl-6" style={{ borderColor: "var(--brand-gold)" }}>
                    <h3 className="font-serif text-2xl italic leading-tight">{p.title}</h3>
                    {p.content_italian && (
                      <pre className="mt-5 whitespace-pre-wrap font-serif text-lg leading-relaxed text-primary-foreground/85">
                        {p.content_italian.split("\n").slice(0, 6).join("\n")}
                        {p.content_italian.split("\n").length > 6 && "\n…"}
                      </pre>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA contatti */}
      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <Mail size={28} className="mx-auto text-accent" />
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            Una parola, <span className="italic ink-underline">e ci sentiamo.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Per presentazioni di libri, letture nelle scuole, collaborazioni con biblioteche e case editrici.
          </p>
          <Link
            to="/contatti"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Scrivimi <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
