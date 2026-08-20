/**
 * Hero "Chi sono": una penna d'oca che scrive su una pergamena.
 * Carta color avorio piena (non traslucida), inchiostro bordeaux, dettagli oro.
 */

const INK_LINES = [
  { d: "M118 146 C 150 138, 178 152, 206 142 C 232 133, 256 148, 282 140", delay: 0.2 },
  { d: "M118 176 C 146 168, 170 182, 200 172 C 228 163, 250 178, 276 168", delay: 1.5 },
  { d: "M118 206 C 144 198, 168 212, 196 202 C 220 194, 240 206, 262 198", delay: 2.8 },
];

export function ChiSonoHero() {
  return (
    <section className="surface-bordeaux surface-bordeaux-glow relative overflow-hidden border-b border-border">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} />
            Chi sono
          </div>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Tessitrice{" "}
            <span className="italic" style={{ color: "var(--brand-gold)" }}>
              di storie.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Giornalista, scrittrice, poetessa. Un filo di parole che parte da Codroipo
            e si intreccia in poesie, fiabe, racconti e articoli.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[430px]">
          <QuillScroll />
        </div>
      </div>
    </section>
  );
}

function QuillScroll() {
  return (
    <svg
      viewBox="0 0 400 340"
      className="h-auto w-full"
      role="img"
      aria-label="Una penna d'oca che scrive righe di inchiostro su una pergamena"
    >
      <defs>
        <linearGradient id="parchment" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf1de" />
          <stop offset="100%" stopColor="#eddfc2" />
        </linearGradient>
        <linearGradient id="feather" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbf3e2" />
          <stop offset="100%" stopColor="#e6cf9a" />
        </linearGradient>
        <clipPath id="scrollClip">
          <rect x="72" y="104" width="256" height="132" />
        </clipPath>
      </defs>

      <g className="scroll-in">
        {/* corpo pergamena */}
        <path
          d="M78 104 C 120 96, 280 96, 322 104 L 322 236 C 280 244, 120 244, 78 236 Z"
          fill="url(#parchment)"
        />
        {/* righe di inchiostro scritte dalla penna */}
        <g clipPath="url(#scrollClip)" fill="none" strokeLinecap="round">
          {INK_LINES.map((l) => (
            <path
              key={l.d}
              className="ink-line"
              d={l.d}
              stroke="#5b1526"
              strokeWidth="2.4"
              strokeOpacity="0.85"
              style={{ animationDelay: `${l.delay}s` }}
            />
          ))}
          <path
            className="ink-line"
            d="M118 232 C 138 224, 152 236, 170 228"
            stroke="#8c2f3f"
            strokeWidth="2"
            strokeOpacity="0.7"
            style={{ animationDelay: "4.1s" }}
          />
        </g>
        {/* rulli superiore e inferiore */}
        <g>
          <path d="M62 96 C 62 86, 338 86, 338 96 C 338 108, 62 108, 62 96 Z" fill="#e2cfa6" />
          <path d="M62 96 C 62 86, 338 86, 338 96" fill="none" stroke="var(--brand-gold)" strokeWidth="2" strokeOpacity="0.8" />
          <path d="M62 244 C 62 234, 338 234, 338 244 C 338 256, 62 256, 62 244 Z" fill="#e2cfa6" />
          <path d="M62 256 C 62 246, 338 246, 338 256" fill="none" stroke="var(--brand-gold)" strokeWidth="2" strokeOpacity="0.8" />
        </g>
      </g>

      {/* penna d'oca */}
      <g className="quill">
        <g transform="translate(240 40)">
          {/* piuma */}
          <path
            d="M8 168 C 26 120, 54 66, 96 22 C 116 2, 138 -6, 150 2 C 160 9, 158 30, 146 54 C 122 102, 78 146, 30 176 Z"
            fill="url(#feather)"
            stroke="var(--brand-gold)"
            strokeWidth="1.4"
            strokeOpacity="0.7"
            strokeLinejoin="round"
          />
          {/* rachide */}
          <path d="M4 182 C 40 140, 92 82, 148 4" fill="none" stroke="#b9955a" strokeWidth="1.6" strokeOpacity="0.85" />
          {/* barbe */}
          <g fill="none" stroke="#c8a566" strokeWidth="1" strokeOpacity="0.65">
            <path d="M120 40 C 128 46, 132 56, 130 66" />
            <path d="M104 60 C 112 66, 116 76, 114 86" />
            <path d="M88 80 C 96 86, 100 96, 98 106" />
            <path d="M72 100 C 80 106, 84 116, 82 126" />
            <path d="M56 120 C 64 126, 68 136, 66 146" />
            <path d="M40 140 C 48 146, 52 154, 50 164" />
          </g>
          {/* fusto e pennino */}
          <path d="M4 182 L -12 200" stroke="#f3e6cb" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M-8 196 L -18 206 L -12 194 Z" fill="#5b1526" />
        </g>
      </g>
    </svg>
  );
}
