import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { db, type FiabaCollection, type FiabaTrack } from "@/integrations/pierina/client";
import { FiabeHero } from "@/components/FiabeHero";
import { Reveal } from "@/components/Reveal";
import { Headphones } from "lucide-react";

const fiabeQ = queryOptions({
  queryKey: ["fiabe-all"],
  queryFn: async (): Promise<{ collections: FiabaCollection[]; tracks: FiabaTrack[] }> => {
    const [c, t] = await Promise.all([
      db.from("fiabe_collections").select("id,title,subtitle,slug,sort_order").order("sort_order", { ascending: true }),
      db.from("fiabe_tracks").select("id,collection_id,title,mp3_url,sort_order").order("sort_order", { ascending: true }),
    ]);
    if (c.error) throw c.error;
    if (t.error) throw t.error;
    return {
      collections: (c.data as FiabaCollection[] | null) ?? [],
      tracks: (t.data as FiabaTrack[] | null) ?? [],
    };
  },
});

export const Route = createFileRoute("/fiabe")({
  head: () => ({
    meta: [
      { title: "Fiabe sonore — Pierina Gallina" },
      { name: "description", content: "Fiabe sonore raccontate dalla voce di Fata Pierina. Storie da ascoltare per bambini e famiglie." },
      { property: "og:title", content: "Fiabe sonore — Pierina Gallina" },
      { property: "og:description", content: "Raccolta di fiabe sonore raccontate dalla voce di Fata Pierina: storie da ascoltare per bambini e famiglie, in italiano e friulano." },
      { name: "twitter:description", content: "Raccolta di fiabe sonore raccontate dalla voce di Fata Pierina: storie da ascoltare per bambini e famiglie, in italiano e friulano." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(fiabeQ),
  component: FiabePage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Nessuna fiaba</div>,
});

function FiabePage() {
  const { data } = useSuspenseQuery(fiabeQ);

  return (
    <>
      <FiabeHero />


      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {data.collections.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessuna raccolta disponibile.</p>
        ) : (
          <div className="space-y-16">
            {data.collections.map((c, ci) => {
              const tracks = data.tracks.filter((t) => t.collection_id === c.id);
              return (
                <Reveal key={c.id} delay={ci * 80}>
                  <div>
                    <div className="border-l-2 pl-5" style={{ borderColor: "var(--brand-gold)" }}>
                      <h2 className="font-serif text-3xl italic leading-tight text-foreground md:text-4xl">{c.title}</h2>
                      {c.subtitle && <p className="mt-2 text-sm text-muted-foreground md:text-base">{c.subtitle}</p>}
                    </div>
                    <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
                      {tracks.length === 0 ? (
                        <li className="px-5 py-6 text-sm text-muted-foreground">Nessuna traccia.</li>
                      ) : (
                        tracks.map((t) => (
                          <li key={t.id} className="grid items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto]">
                            <div className="flex items-center gap-3">
                              <Headphones size={16} className="shrink-0 text-accent" />
                              <span className="font-serif text-base leading-snug text-foreground md:text-lg">{t.title}</span>
                            </div>
                            <audio controls preload="none" src={t.mp3_url} className="w-full md:w-72" />
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
