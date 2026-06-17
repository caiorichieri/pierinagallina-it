import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { db, type Poem } from "@/integrations/pierina/client";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

const poemsQ = queryOptions({
  queryKey: ["poems-all"],
  queryFn: async (): Promise<Poem[]> => {
    const { data, error } = await db
      .from("poems")
      .select("id,title,slug,content_friulian,content_italian,written_at,sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as Poem[] | null) ?? [];
  },
});

export const Route = createFileRoute("/poesie")({
  head: () => ({
    meta: [
      { title: "Poesie — Pierina Gallina" },
      { name: "description", content: "Poesie di Pierina Gallina in friulano e in italiano. Versi di terra, scuola, memoria e affetti." },
      { property: "og:title", content: "Poesie — Pierina Gallina" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(poemsQ),
  component: PoesiePage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Nessuna poesia</div>,
});

function PoesiePage() {
  const { data: poems } = useSuspenseQuery(poemsQ);

  return (
    <>
      <PageHero
        eyebrow="Poesia"
        title={<>Versi in friulano <span className="italic" style={{ color: "var(--brand-gold)" }}>e in italiano.</span></>}
        intro="Parole della terra, della scuola, dell'affetto. Una raccolta che cresce nel tempo, fra la lingua di casa e quella di tutti."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {poems.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessuna poesia disponibile.</p>
        ) : (
          <div className="space-y-16">
            {poems.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 6) * 80}>
                <article className="grid gap-8 md:grid-cols-2">
                  <header className="md:col-span-2">
                    <h2 className="font-serif text-3xl italic leading-tight text-foreground md:text-4xl">{p.title}</h2>
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
        )}
      </section>
    </>
  );
}
