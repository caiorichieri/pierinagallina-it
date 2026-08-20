/**
 * Hero "Contatti": una busta che si apre e da cui esce davvero un foglio
 * di carta avorio (pieno, non traslucido) con righe scritte a mano.
 */

const LINES = [
  { d: "M148 92 C 174 84, 206 98, 240 88", delay: 1.5 },
  { d: "M148 112 C 182 104, 212 118, 250 108", delay: 1.75 },
  { d: "M148 132 C 170 126, 194 138, 226 128", delay: 2.0 },
  { d: "M148 152 C 184 146, 210 158, 244 148", delay: 2.25 },
];

export function ContattiHero() {
  return (
    <section className="surface-bordeaux surface-bordeaux-glow relative overflow-hidden border-b border-border">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} />
            Contatti
          </div>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Una parola,{" "}
            <span className="italic" style={{ color: "var(--brand-gold)" }}>
              e ci sentiamo.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Per presentazioni di libri, letture nelle scuole, collaborazioni con
            biblioteche e case editrici.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <LetterPlane />
        </div>
      </div>
    </section>
  );
}

function LetterPlane() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="h-auto w-full"
      role="img"
      aria-label="Una busta che si apre e un foglio scritto che esce, con un aeroplanino di carta che vola via"
    >
      <defs>
        <linearGradient id="sheetPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf6e6" />
          <stop offset="100%" stopColor="#f0e3c6" />
        </linearGradient>
        <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e5c8" />
          <stop offset="100%" stopColor="#e3cfa4" />
        </linearGradient>
        <clipPath id="sheetClip">
          <rect x="90" y="-20" width="230" height="270" />
        </clipPath>
      </defs>

      {/* retro busta */}
      <g className="envelope-in">
        <path d="M96 186 L 200 150 L 304 186 L 304 288 L 96 288 Z" fill="#dcc79b" />
      </g>

      {/* foglio che esce dalla busta */}
      <g clipPath="url(#sheetClip)">
      <g className="letter-sheet">
        <rect x="130" y="58" width="140" height="150" rx="3" fill="url(#sheetPaper)" />
        <rect x="130" y="58" width="140" height="150" rx="3" fill="none" stroke="var(--brand-gold)" strokeWidth="1.4" strokeOpacity="0.6" />
        <g fill="none" stroke="#5b1526" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round">
          {LINES.map((l) => (
            <path key={l.d} className="hand-line" d={l.d} style={{ animationDelay: `${l.delay}s` }} />
          ))}
        </g>
        <path
          className="hand-line"
          style={{ animationDelay: "2.5s" }}
          d="M186 178 C 202 170, 210 182, 230 174"
          fill="none"
          stroke="#8c2f3f"
          strokeOpacity="0.8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      </g>

      {/* fronte busta (davanti al foglio) */}
      <g className="envelope-in">
        <path d="M96 186 L 200 250 L 304 186 L 304 288 L 96 288 Z" fill="url(#envBody)" stroke="var(--brand-gold)" strokeWidth="2" strokeOpacity="0.85" strokeLinejoin="round" />
        <path d="M96 288 L 176 220 M 304 288 L 224 220" fill="none" stroke="#c8a566" strokeWidth="1.4" strokeOpacity="0.6" />
        <path className="envelope-flap" d="M96 186 L 200 122 L 304 186 Z" fill="#e9d6ac" stroke="var(--brand-gold)" strokeWidth="1.8" strokeOpacity="0.8" strokeLinejoin="round" />
      </g>

      {/* aeroplanino */}
      <g className="paper-plane">
        <path d="M0 0 L 44 16 L 18 22 L 12 40 Z" fill="#fdf6e6" />
        <path d="M0 0 L 18 22 L 44 16 Z" fill="var(--brand-gold)" fillOpacity="0.85" />
      </g>
    </svg>
  );
}
