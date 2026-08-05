import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { db, type FiabaCollection, type FiabaTrack } from "@/integrations/pierina/client";
import { Reveal } from "@/components/Reveal";
import { Headphones, BookOpen, Mail } from "lucide-react";

const SITE = "https://www.pierinagallina.it";

const audiolibriQ = queryOptions({
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

const DESC =
  "Audiolibri per bambini gratuiti: fiabe sonore narrate dalla voce di Fata Pierina, da ascoltare online in italiano e in friulano, a casa o in classe.";

export const Route = createFileRoute("/audiolibri-per-bambini")({
  head: () => ({
    meta: [
      { title: "Audiolibri per bambini da ascoltare gratis — Pierina Gallina" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Audiolibri per bambini da ascoltare gratis" },
      { property: "og:description", content: DESC },
      { name: "twitter:description", content: DESC },
      { property: "og:url", content: `${SITE}/audiolibri-per-bambini` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/audiolibri-per-bambini` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Audiolibri per bambini",
          description: DESC,
          inLanguage: "it-IT",
          url: `${SITE}/audiolibri-per-bambini`,
          author: { "@type": "Person", name: "Pierina Gallina" },
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(audiolibriQ),
  component: AudiolibriPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>
  ),
});

function AudiolibriPage() {
  const { data } = useSuspenseQuery(audiolibriQ);
  const total = data.tracks.length;

  return (
    <>
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20">
          <h1 className="font-serif text-4xl italic leading-tight text-foreground md:text-5xl">
            Audiolibri per bambini da ascoltare gratis
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {total > 0 ? `${total} ` : ""}fiabe sonore narrate dalla voce di <strong>Fata Pierina</strong>, Pierina
            Gallina, scrittrice di Codroipo. Storie da ascoltare online in italiano e in friulano: a casa prima di
            dormire, in viaggio o in classe con i bambini.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#ascolta"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Headphones size={16} /> Ascolta ora
            </a>
            <Link
              to="/libri"
              className="inline-flex items-center gap-2 rounded-md border border-input px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/10"
            >
              <BookOpen size={16} /> Scopri i libri
            </Link>
            <Link
              to="/contatti"
              className="inline-flex items-center gap-2 rounded-md border border-input px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/10"
            >
              <Mail size={16} /> Letture nelle scuole
            </Link>
          </div>
        </div>
      </section>

      <section id="ascolta" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-2xl italic text-foreground md:text-3xl">Le raccolte da ascoltare</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Tutti gli audiolibri sono gratuiti e si ascoltano direttamente dal browser, senza registrazione.
        </p>

        {data.collections.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">Nessuna raccolta disponibile.</p>
        ) : (
          <div className="mt-10 space-y-16">
            {data.collections.map((c, ci) => {
              const tracks = data.tracks.filter((t) => t.collection_id === c.id);
              return (
                <Reveal key={c.id} delay={ci * 80}>
                  <div>
                    <div className="border-l-2 pl-5" style={{ borderColor: "var(--brand-gold)" }}>
                      <h3 className="font-serif text-2xl italic leading-tight text-foreground md:text-3xl">{c.title}</h3>
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
                              <span className="font-serif text-base leading-snug text-foreground md:text-lg">
                                {t.title}
                              </span>
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

        <div className="mt-16 rounded-xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-serif text-xl italic text-foreground md:text-2xl">
            Perché ascoltare audiolibri con i bambini
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Ascoltare una storia allena l'attenzione, arricchisce il vocabolario e accende l'immaginazione: i bambini
            costruiscono da soli le immagini che accompagnano la voce. Le fiabe di Pierina Gallina nascono in Friuli e
            alternano italiano e lingua friulana, così l'ascolto diventa anche un modo semplice per tramandare le parole
            di casa.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Trovi altre storie nella pagina{" "}
            <Link to="/fiabe" className="underline underline-offset-4 hover:text-foreground">
              Fiabe sonore
            </Link>{" "}
            e nei{" "}
            <Link to="/libri" className="underline underline-offset-4 hover:text-foreground">
              libri illustrati
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
