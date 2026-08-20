/**
 * Hero "Contatti": una busta che si apre, un foglio con righe scritte a mano
 * che si disegnano e un aeroplanino di carta che vola via in loop.
 */

const LINES = [
  { d: "M150 118 C 176 110, 208 124, 240 114", delay: 0.9 },
  { d: "M150 138 C 184 130, 214 144, 252 134", delay: 1.15 },
  { d: "M150 158 C 172 152, 196 164, 228 154", delay: 1.4 },
  { d: "M150 178 C 186 172, 212 184, 246 174", delay: 1.65 },
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
      aria-label="Una busta che si apre con un foglio scritto e un aeroplanino di carta che vola via"
    >
      {/* foglio */}
      <g className="letter-sheet">
        <rect x="128" y="82" width="146" height="130" rx="4" fill="#f7ead0" fillOpacity="0.14" stroke="var(--brand-gold)" strokeWidth="1.8" strokeOpacity="0.75" />
        <g fill="none" stroke="#f7ead0" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round">
          {LINES.map((l) => (
            <path key={l.d} className="hand-line" d={l.d} style={{ animationDelay: `${l.delay}s` }} />
          ))}
        </g>
        <path className="hand-line" style={{ animationDelay: "1.95s" }} d="M196 196 C 212 188, 220 200, 240 192" fill="none" stroke="var(--brand-gold)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* busta */}
      <g className="envelope-in">
        <path
          d="M96 186 L 200 150 L 304 186 L 304 288 L 96 288 Z"
          fill="#f7ead0"
          fillOpacity="0.12"
          stroke="var(--brand-gold)"
          strokeWidth="2"
          strokeOpacity="0.85"
          strokeLinejoin="round"
        />
        <path d="M96 186 L 200 250 L 304 186" fill="none" stroke="var(--brand-gold)" strokeWidth="1.8" strokeOpacity="0.6" />
        <path className="envelope-flap" d="M96 186 L 200 122 L 304 186 Z" fill="#f7ead0" fillOpacity="0.2" stroke="var(--brand-gold)" strokeWidth="1.8" strokeOpacity="0.7" strokeLinejoin="round" />
      </g>

      {/* aeroplanino */}
      <g className="paper-plane">
        <path d="M0 0 L 44 16 L 18 22 L 12 40 Z" fill="#f7ead0" fillOpacity="0.9" />
        <path d="M0 0 L 18 22 L 44 16 Z" fill="var(--brand-gold)" fillOpacity="0.75" />
      </g>
    </svg>
  );
}
