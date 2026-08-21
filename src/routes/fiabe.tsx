import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { db, type FiabaCollection, type FiabaTrack } from "@/integrations/pierina/client";
import { FiabeHero } from "@/components/FiabeHero";
import { FiabaCard } from "@/components/fiabe/FiabaCard";
import { WitchHousePlayer } from "@/components/fiabe/WitchHousePlayer";
import { ForestDecor, TowerDecor } from "@/components/fiabe/FiabeDecor";
import { Reveal } from "@/components/Reveal";
import { trackAudioPlay } from "@/lib/ga4-events";


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
      { property: "og:url", content: "https://www.pierinagallina.it/fiabe" },
    ],
    links: [{ rel: "canonical", href: "https://www.pierinagallina.it/fiabe" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Fiabe sonore di Pierina Gallina",
          description:
            "Raccolta di fiabe sonore raccontate dalla voce di Fata Pierina: storie da ascoltare per bambini e famiglie, in italiano e friulano.",
          url: "https://www.pierinagallina.it/fiabe",
          inLanguage: "it-IT",
        }),
      },
    ],
  }),

  loader: ({ context }) => context.queryClient.ensureQueryData(fiabeQ),
  component: FiabePage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Nessuna fiaba</div>,
});

function FiabePage() {
  const { data } = useSuspenseQuery(fiabeQ);

  const flat = useMemo(
    () =>
      data.collections.flatMap((c) =>
        data.tracks.filter((t) => t.collection_id === c.id).map((t) => ({ track: t, collection: c })),
      ),
    [data],
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [durations, setDurations] = useState<Record<string, number>>({});

  const currentItem = index === null ? null : flat[index];

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentItem) return;
    a.src = currentItem.track.mp3_url;
    a.playbackRate = rate;
    a.volume = volume;
    void a.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
    trackAudioPlay(currentItem.track.title, currentItem.collection.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const select = (i: number) => {
    if (i === index) {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) void a.play().then(() => setPlaying(true));
      else {
        a.pause();
        setPlaying(false);
      }
      return;
    }
    setCurrent(0);
    setDuration(0);
    setIndex(i);
  };

  const step = (d: number) => {
    if (index === null || flat.length === 0) return;
    setIndex((prev) => {
      const base = prev ?? 0;
      return (base + d + flat.length) % flat.length;
    });
    setCurrent(0);
    setDuration(0);
  };

  return (
    <>
      <FiabeHero />

      <div className="mx-auto max-w-5xl px-4 pt-10 text-center sm:px-6">
        <Link
          to="/audiolibri-per-bambini"
          className="text-sm underline underline-offset-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          Scopri tutti gli audiolibri per bambini da ascoltare gratis →
        </Link>
      </div>

      <div className="relative">
        <ForestDecor className="pointer-events-none absolute left-0 top-24 hidden h-[620px] w-[120px] text-accent/25 xl:block" />
        <TowerDecor className="pointer-events-none absolute right-0 top-24 hidden h-[620px] w-[120px] text-accent/25 xl:block" />

        <section className={`mx-auto max-w-5xl px-4 py-16 sm:px-6 ${currentItem ? "pb-56" : ""}`}>
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

                      {tracks.length === 0 ? (
                        <p className="mt-8 text-sm text-muted-foreground">Nessuna traccia.</p>
                      ) : (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {tracks.map((t, ti) => {
                            const gi = flat.findIndex((f) => f.track.id === t.id);
                            return (
                              <div key={t.id}>
                                <FiabaCard
                                  title={t.title}
                                  index={ti}
                                  duration={durations[t.id]}
                                  active={gi === index}
                                  playing={gi === index && playing}
                                  onSelect={() => select(gi)}
                                />
                                <audio
                                  preload="metadata"
                                  src={t.mp3_url}
                                  className="hidden"
                                  onLoadedMetadata={(e) =>
                                    setDurations((d) => ({ ...d, [t.id]: e.currentTarget.duration }))
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => step(1)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="hidden"
      />

      {currentItem && (
        <WitchHousePlayer
          title={currentItem.track.title}
          collection={currentItem.collection.title}
          playing={playing}
          current={current}
          duration={duration}
          volume={volume}
          rate={rate}
          onToggle={() => index !== null && select(index)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onSeek={(t) => {
            if (audioRef.current) audioRef.current.currentTime = t;
            setCurrent(t);
          }}
          onVolume={setVolume}
          onRate={setRate}
        />
      )}
    </>
  );
}

