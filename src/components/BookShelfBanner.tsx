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
  const loop = [...books, ...books];

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

      <div className="relative flex items-end">
        {/* scaffale scorrevole */}
        <div className="book-marquee group relative min-w-0 flex-1 py-6 md:py-8">
          <div className="book-marquee-track flex w-max items-end gap-6 md:gap-10">
            {loop.map((b, i) => (
              <Link
                key={`${b.title}-${i}`}
                to="/libri"
                aria-hidden={i >= books.length ? true : undefined}
                tabIndex={i >= books.length ? -1 : undefined}
                className="book-marquee-item shrink-0"
              >
                <img
                  src={b.cover}
                  alt={i >= books.length ? "" : b.title}
                  loading="lazy"
                  className="h-32 w-auto object-contain drop-shadow-xl sm:h-40 md:h-48"
                />
              </Link>
            ))}
          </div>

          {/* sfumature laterali */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
            style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
            style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
          />
        </div>

      </div>
    </section>
  );
}
