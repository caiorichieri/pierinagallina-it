import { Link } from "@tanstack/react-router";
import { isBookHidden } from "@/content/libri";
import coverVitaEmotiva from "@/assets/libri/vita-da-emotiva.png";
import coverGastone from "@/assets/libri/gastone.png";
import coverAnnoFiaba from "@/assets/libri/un-anno-da-fiaba.png";
import coverNonni from "@/assets/libri/nonni.png";
import coverPrincipessa from "@/assets/libri/principessa-tic.png";
import coverAngeli from "@/assets/libri/come-angeli.png";
import coverMassimo from "@/assets/libri/massimo-folletto.png";
import coverPetali from "@/assets/libri/petali-luna.png";
import coverAerei from "@/assets/libri/aerei-carta.png";

const BOOKS: { title: string; cover: string }[] = [
  { title: "Come aerei di carta", cover: coverAerei },
  { title: "Come angeli in vacanza", cover: coverAngeli },
  { title: "Come petali di luna", cover: coverPetali },
  { title: "Nonni", cover: coverNonni },
  { title: "Il volo perfetto di Massimo il Folletto", cover: coverMassimo },
  { title: "La Principessa TIC e il Pirata TAC nel pianeta Fifablu", cover: coverPrincipessa },
  { title: "Un anno da Fiaba", cover: coverAnnoFiaba },
  { title: "Gastone, il tassista coccolone", cover: coverGastone },
  { title: "Vita da emotiva", cover: coverVitaEmotiva },
];

export function BookShelfBanner() {
  const books = BOOKS.filter((b) => !isBookHidden(b.title));
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section
      aria-label="I libri di Pierina Gallina"
      className="relative overflow-hidden border-y border-border bg-background paper-grain"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 25% 100%, rgba(232,184,74,0.28) 0%, transparent 60%), radial-gradient(ellipse at 85% 0%, rgba(124,24,24,0.16) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scorri a sinistra"
          className="absolute left-2 z-20 rounded-full border border-border bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar min-w-0 flex-1 overflow-x-auto scroll-smooth py-6 md:py-8"
        >
          <div className="flex w-max items-end gap-6 px-14 md:gap-10 md:px-20">
            {books.map((b) => (
              <Link key={b.title} to="/libri" className="shrink-0 transition-transform hover:-translate-y-1">
                <img
                  src={b.cover}
                  alt={b.title}
                  loading="lazy"
                  className="h-32 w-auto object-contain drop-shadow-xl sm:h-40 md:h-48"
                />
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scorri a destra"
          className="absolute right-2 z-20 rounded-full border border-border bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* sfumature laterali */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28"
          style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28"
          style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
        />
      </div>
    </section>
  );
}

