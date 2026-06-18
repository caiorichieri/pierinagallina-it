import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { db, type Book } from "@/integrations/pierina/client";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BookInterestDialog } from "@/components/BookInterestDialog";
import { ExternalLink, Mail, Play } from "lucide-react";

function isExternalBuy(url: string | null | undefined): url is string {
  if (!url) return false;
  // Old site cart links are broken — treat as "no buy link"
  if (/pierinagallina\.it/i.test(url)) return false;
  return /^https?:\/\//i.test(url);
}

const booksQ = queryOptions({
  queryKey: ["books-all"],
  queryFn: async (): Promise<Book[]> => {
    const { data, error } = await db
      .from("books")
      .select("id,title,year,price,description,buy_url,youtube_id,type,cover_url,sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as Book[] | null) ?? [];
  },
});

export const Route = createFileRoute("/libri")({
  head: () => ({
    meta: [
      { title: "Libri — Pierina Gallina" },
      { name: "description", content: "I libri di Pierina Gallina: fiabe, racconti e storie illustrate dal Friuli." },
      { property: "og:title", content: "Libri — Pierina Gallina" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(booksQ),
  component: LibriPage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Nessun libro</div>,
});

function LibriPage() {
  const { data: books } = useSuspenseQuery(booksQ);
  const [interest, setInterest] = useState<Book | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Libri"
        title={<>Le pagine che ho <span className="italic" style={{ color: "var(--brand-gold)" }}>seminato.</span></>}
        intro="Fiabe, racconti per bambini e raccolte illustrate. Storie che nascono dalle scuole di Codroipo e dai paesi del Friuli."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {books.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessun libro disponibile al momento.</p>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => (
              <Reveal key={b.id} delay={Math.min(i, 6) * 80}>
                <article className="group flex h-full flex-col">
                  {b.cover_url ? (
                    <div className="photo-frame aspect-[3/4] overflow-hidden">
                      <img src={b.cover_url} alt={b.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center rounded-md bg-primary p-8 text-primary-foreground">
                      <span className="text-center font-serif text-2xl italic leading-tight">{b.title}</span>
                    </div>
                  )}
                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <h2 className="font-serif text-2xl leading-tight text-foreground">{b.title}</h2>
                    {b.year && <span className="font-sans text-xs text-muted-foreground">{b.year}</span>}
                  </div>
                  {b.type && (
                    <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] text-accent">{b.type}</div>
                  )}
                  {b.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {isExternalBuy(b.buy_url) ? (
                      <a href={b.buy_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
                        Acquista <ExternalLink size={12} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInterest(b)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                      >
                        <Mail size={12} /> Richiedi informazioni
                      </button>
                    )}
                    {b.youtube_id && (
                      <a href={`https://youtu.be/${b.youtube_id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-accent hover:text-accent">
                        <Play size={12} /> Video
                      </a>
                    )}
                    {b.price != null && (
                      <span className="inline-flex items-center rounded-full bg-secondary px-3 py-2 text-xs text-muted-foreground">€ {b.price}</span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <BookInterestDialog
        bookTitle={interest?.title ?? ""}
        open={!!interest}
        onClose={() => setInterest(null)}
      />
    </>
  );
}
