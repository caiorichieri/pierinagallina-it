/**
 * Hero della pagina "Fotografie": una macchina fotografica che sviluppa
 * polaroid, che volano e si compongono in un pannello a muro.
 * Stessa logica di animazione dell'hero "Scritti" (origine → posizione finale).
 */

type Shot = {
  x: number;
  y: number;
  rot: number;
  w: number;
  delay: number;
  tone: string;
};

const CAMERA = { x: 200, y: 300 };

const TONES = [
  "#e8b84a",
  "#c9a26a",
  "#a81c2e",
  "#d8c39a",
  "#7c1818",
  "#e0cba8",
  "#c44569",
];

// pannello: griglia 4 x 2 leggermente irregolare
const SHOTS: Shot[] = Array.from({ length: 8 }, (_, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return {
    x: 44 + col * 82,
    y: 58 + row * 96,
    rot: ((i * 37) % 11) - 5,
    w: 66,
    delay: 0.3 + i * 0.16,
    tone: TONES[i % TONES.length],
  };
});

export function FotografieHero() {
  return (
    <section className="surface-bordeaux surface-bordeaux-glow relative overflow-hidden border-b border-border">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} />
            Fotografie
          </div>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Istanti che{" "}
            <span className="italic" style={{ color: "var(--brand-gold)" }}>
              restano appesi.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Presentazioni, letture nelle scuole, radio, amici e paesaggi del
            Friuli. Una polaroid dopo l&apos;altra, fino a comporre un pannello
            di ricordi.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <PolaroidWall />
        </div>
      </div>
    </section>
  );
}

function PolaroidWall() {
  return (
    <svg
      viewBox="0 0 400 380"
      className="h-auto w-full"
      role="img"
      aria-label="Una macchina fotografica che sviluppa polaroid disposte a pannello"
    >
      <defs>
        <linearGradient id="camBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7ead0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#d9c093" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* filo del pannello */}
      <path
        className="tree-draw"
        d="M18 44 C 120 68, 280 68, 382 44"
        fill="none"
        stroke="var(--brand-gold)"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* polaroid */}
      <g>
        {SHOTS.map((s, i) => {
          const h = s.w * 1.2;
          return (
            <g
              key={i}
              className="polaroid-shot"
              style={
                {
                  "--dx": `${CAMERA.x - s.x - s.w / 2}px`,
                  "--dy": `${CAMERA.y - s.y - h / 2}px`,
                  "--rot": `${s.rot}deg`,
                  animationDelay: `${s.delay}s, ${s.delay + 1.3}s`,
                } as React.CSSProperties
              }
            >
              <rect
                x={s.x}
                y={s.y}
                width={s.w}
                height={h}
                rx="3"
                fill="#f7ead0"
                fillOpacity="0.96"
                stroke="var(--brand-gold)"
                strokeOpacity="0.35"
              />
              <rect
                x={s.x + 5}
                y={s.y + 5}
                width={s.w - 10}
                height={h - 20}
                fill={s.tone}
                fillOpacity="0.75"
              />
              <rect
                x={s.x + 5}
                y={s.y + 5}
                width={s.w - 10}
                height={(h - 20) / 2}
                fill="#faf5ec"
                fillOpacity="0.12"
              />
              {/* mollettina */}
              <rect
                x={s.x + s.w / 2 - 3}
                y={s.y - 6}
                width="6"
                height="10"
                rx="1.5"
                fill="var(--brand-gold)"
                fillOpacity="0.8"
              />
            </g>
          );
        })}
      </g>

      {/* macchina fotografica */}
      <g className="book-open">
        <rect x="140" y="272" width="120" height="72" rx="12" fill="url(#camBody)" />
        <rect x="150" y="336" width="100" height="12" rx="4" fill="#f7ead0" fillOpacity="0.55" />
        <circle cx="200" cy="306" r="24" fill="#7c1818" fillOpacity="0.85" />
        <circle cx="200" cy="306" r="13" fill="#2d0808" />
        <circle cx="194" cy="300" r="4" fill="#f7ead0" fillOpacity="0.7" />
        <circle cx="240" cy="284" r="5" fill="var(--brand-gold)" />
        <rect
          x="140"
          y="272"
          width="120"
          height="72"
          rx="12"
          fill="none"
          stroke="var(--brand-gold)"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
