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
      .order("sort_order", { ascending: true })
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
      <PageHero tone="fotografie"
        eyebrow="Fotografie"
        title={<>Momenti, incontri, <span className="italic" style={{ color: "var(--brand-gold)" }}>paesaggi.</span></>}
        intro="Una galleria di istantanee: presentazioni di libri, letture nelle scuole, radio, amici e luoghi del Friuli."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessuna foto disponibile.</p>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
            {photos.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 10) * 40}>
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  className="mb-4 block w-full overflow-hidden rounded-xl bg-secondary transition-transform hover:-translate-y-0.5"
                >
                  <img
                    src={p.image_url}
                    alt={p.title ?? ""}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-700 hover:scale-105"
                  />
                  {p.title && (
                    <span className="block px-3 py-2 text-left text-xs text-muted-foreground">{p.title}</span>
                  )}
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
