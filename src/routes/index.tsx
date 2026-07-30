import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Feather, Headphones, Image as ImageIcon, Mail } from "lucide-react";
import { db, type Post, type Book, type Poem } from "@/integrations/pierina/client";
import { Reveal } from "@/components/Reveal";
import pierinaHome from "@/assets/pierina-home-v2.png.asset.json";
import coverVitaEmotiva from "@/assets/libri/vita-da-emotiva.png.asset.json";
import coverGastone from "@/assets/libri/gastone.png.asset.json";
import coverFataNatura from "@/assets/libri/fata-natura.png.asset.json";
import coverAnnoFiaba from "@/assets/libri/un-anno-da-fiaba.png.asset.json";
import coverNonni from "@/assets/libri/nonni.png.asset.json";
import coverPrincipessa from "@/assets/libri/principessa-tic.png.asset.json";
import coverAngeli from "@/assets/libri/come-angeli.png.asset.json";
import coverMassimo from "@/assets/libri/massimo-folletto.png.asset.json";
import coverPetali from "@/assets/libri/petali-luna.png.asset.json";
import coverAerei from "@/assets/libri/aerei-carta.png.asset.json";

const COVER_OVERRIDES: Record<string, string> = {
  "vita da emotiva": coverVitaEmotiva.url,
  "gastone, il tassista coccolone": coverGastone.url,
  "fata natura e l'orto magico": coverFataNatura.url,
  "un anno da fiaba": coverAnnoFiaba.url,
  "nonni": coverNonni.url,
  "la principessa tic e il pirata tac nel pianeta fifablu": coverPrincipessa.url,
  "come angeli in vacanza": coverAngeli.url,
  "il volo perfetto di massimo il folletto": coverMassimo.url,
  "come petali di luna": coverPetali.url,
  "come aerei di carta": coverAerei.url,
};

function coverFor(b: Book): string | null {
  return b.cover_url ?? COVER_OVERRIDES[b.title.trim().toLowerCase()] ?? null;
}

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

function formatDateIt(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = d.getUTCDate();
  const month = [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
  ][d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function HomePage() {
  const { data } = useSuspenseQuery(homeData);

  return (
    <>
      {/* HERO — carta avorio, bordô come accento */}
      <section className="relative overflow-hidden border-b border-border bg-background paper-grain">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(232,184,74,0.55) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(124,24,24,0.35) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-20 pb-8 sm:px-6 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-8 md:pt-28 md:pb-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="flag-italy" aria-label="Italia"><span /><span /><span /></span>
              <span className="flag-friuli" aria-label="Friuli">FVG</span>
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Codroipo · Friuli
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-1 md:block">
              <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-primary sm:text-5xl md:text-7xl lg:text-8xl">
                Pierina
                <br />
                <span className="italic" style={{ color: "var(--brand-gold)" }}>Gallina.</span>
              </h1>

              <div className="relative z-10 shrink-0 md:hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 scale-[1.35] rounded-full opacity-70 blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(232,184,74,0.6) 0%, transparent 70%)" }}
                />
                <img
                  src={pierinaHome.url}
                  alt="Pierina Gallina"
                  className="relative h-auto w-60 origin-bottom object-contain drop-shadow-xl sm:w-64"
                />
              </div>
            </div>

            <p className="mt-8 max-w-2xl font-serif text-xl italic leading-snug text-foreground/90 md:text-2xl">
              Scrivo per dare voce a ciò che rischierebbe di <span className="ink-underline" style={{ color: "var(--brand-primary)" }}>passare inosservato.</span>
            </p>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Scrittrice di Codroipo, Friuli — paroliera per passione. Libri, fiabe sonore, poesie in
              friulano e in italiano. Un'imbranata cacciatrice di emozioni.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/scritti"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5"
              >
                Leggi gli scritti
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contatti"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Scrivimi
              </Link>
            </div>
          </div>

          <div className="relative z-20 -mb-16 hidden justify-center md:-mt-24 md:-mb-24 md:flex md:justify-end lg:-mt-28">
            <div
              aria-hidden
              className="absolute -top-8 left-1/2 -z-10 h-[120%] w-[90%] -translate-x-1/2 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-60 blur-2xl md:left-auto md:right-0 md:top-0 md:h-[110%] md:w-[85%] md:translate-x-[1cm]"
              style={{
                background: "radial-gradient(ellipse at 50% 45%, rgba(232,184,74,0.55) 0%, rgba(124,24,24,0.20) 55%, transparent 85%)",
              }}
            />
            <img
              src={pierinaHome.url}
              alt="Pierina Gallina"
              className="relative z-10 h-auto w-[168%] max-w-none origin-top object-contain drop-shadow-2xl translate-x-[4cm] md:w-[204%] md:translate-x-[6cm] lg:w-[216%] lg:translate-x-[7cm]"
            />
          </div>
        </div>
      </section>


      {/* SEZIONI — mondo letterario */}
      <section className="relative z-0 overflow-hidden border-b border-border bg-[#fbf3ee] pt-10 md:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(168,28,46,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(201,138,31,0.10) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.22em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Il mio mondo
            </div>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-primary md:text-5xl">
              Quattro sentieri di <span className="italic" style={{ color: "var(--brand-gold)" }}>parole.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Libri illustrati, fiabe da ascoltare, poesie in due lingue e fotografie del Friuli. Scegli da dove cominciare.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen,   t: "Libri",        d: "Fiabe e racconti illustrati",       href: "/libri" as const },
              { icon: Feather,    t: "Scritti",      d: "Articoli, racconti e poesie",       href: "/scritti" as const },
              { icon: Headphones, t: "Fiabe sonore", d: "Voci, suoni, storie da ascoltare",  href: "/fiabe" as const },
              { icon: ImageIcon,  t: "Fotografie",   d: "Momenti, incontri, paesaggi",       href: "/fotografie" as const },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 80}>
                <Link
                  to={s.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-xl"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{ background: "radial-gradient(circle, var(--brand-gold) 0%, transparent 70%)" }}
                  />
                  <span
                    className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                  >
                    <s.icon size={22} />
                  </span>
                  <div className="mt-6 font-serif text-2xl leading-tight text-primary">{s.t}</div>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</div>
                  <span
                    className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent transition-transform duration-300 group-hover:translate-x-1"
                  >
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
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Dagli scritti
                </div>
                <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Ultimi racconti</h2>
              </div>
              <Link to="/scritti" className="hidden text-sm font-medium text-primary hover:text-accent sm:inline-flex sm:items-center sm:gap-1.5">
                Tutti gli scritti <ArrowRight size={14} />
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
                        {formatDateIt(p.published_at)}
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
                    {(() => { const cover = coverFor(b); return cover ? (
                      <div className="overflow-hidden rounded-xl aspect-[3/4] bg-secondary/40 flex items-center justify-center p-4">
                        <img src={cover} alt={b.title} loading="lazy" className="max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex aspect-[3/4] items-center justify-center rounded-md bg-primary p-8 text-primary-foreground">
                        <span className="text-center font-serif text-2xl italic leading-tight">{b.title}</span>
                      </div>
                    ); })()}
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
        <section className="surface-bordeaux surface-bordeaux-glow relative overflow-hidden text-primary-foreground">
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
            <div className="mt-12">
              <Link to="/scritti" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                Leggi tutte le poesie <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA contatti */}
      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
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
