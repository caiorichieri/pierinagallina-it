import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { db, type GalleryPhoto } from "@/integrations/pierina/client";
import { FotografieHero } from "@/components/FotografieHero";
import { Reveal } from "@/components/Reveal";
import { X } from "lucide-react";


const photosQ = queryOptions({
  queryKey: ["gallery-all"],
  queryFn: async (): Promise<GalleryPhoto[]> => {
    const { data, error } = await db
      .from("gallery_photos")
      .select("id,title,image_url,sort_order,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data as GalleryPhoto[] | null) ?? [];
  },
});

export const Route = createFileRoute("/fotografie")({
  head: () => ({
    meta: [
      { title: "Fotografie — Pierina Gallina" },
      { name: "description", content: "Galleria fotografica di Pierina Gallina: incontri, presentazioni, scuola e paesaggi del Friuli." },
      { property: "og:title", content: "Fotografie — Pierina Gallina" },
      { property: "og:description", content: "Galleria fotografica di Pierina Gallina: incontri con i lettori, presentazioni, letture nelle scuole e paesaggi del Friuli." },
      { name: "twitter:description", content: "Galleria fotografica di Pierina Gallina: incontri con i lettori, presentazioni, letture nelle scuole e paesaggi del Friuli." },
      { property: "og:url", content: "https://www.pierinagallina.it/fotografie" },
    ],
    links: [{ rel: "canonical", href: "https://www.pierinagallina.it/fotografie" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Fotografie di Pierina Gallina",
          description:
            "Galleria fotografica di Pierina Gallina: incontri con i lettori, presentazioni, letture nelle scuole e paesaggi del Friuli.",
          url: "https://www.pierinagallina.it/fotografie",
          inLanguage: "it-IT",
        }),
      },
    ],
  }),

  loader: ({ context }) => context.queryClient.ensureQueryData(photosQ),
  component: FotografiePage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Nessuna foto</div>,
});

function FotografiePage() {
  const { data: photos } = useSuspenseQuery(photosQ);
  const [open, setOpen] = useState<GalleryPhoto | null>(null);

  return (
    <>
      <FotografieHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessuna foto disponibile.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 12) * 70}>
                <button
                  type="button"
                  aria-label={p.title || "Visualizza fotografia"}
                  onClick={() => setOpen(p)}
                  className="polaroid-card block w-full text-left"
                >
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.image_url}
                      alt={p.title ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="polaroid-caption mt-3 block px-1 text-center text-sm text-foreground/70">
                    {p.title ?? "—"}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>


      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Chiudi"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <figure className="max-h-[90vh] max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <img src={open.image_url} alt={open.title ?? ""} className="max-h-[80vh] w-auto rounded-xl object-contain" />
            {open.title && (
              <figcaption className="mt-3 text-center font-serif text-base italic text-white/85">{open.title}</figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
