/**
 * Hero "Chi sono": un gomitolo dorato da cui parte un filo che si disegna,
 * si intreccia e diventa una penna. Line-art oro su fondo bordeaux.
 */

const WORDS = [
  { ch: "storie", x: 300, y: 78, size: 19, delay: 1.6 },
  { ch: "poesie", x: 118, y: 62, size: 17, delay: 1.85 },
  { ch: "fiabe", x: 336, y: 176, size: 16, delay: 2.1 },
  { ch: "parole", x: 84, y: 196, size: 15, delay: 2.35 },
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

        <div className="relative mx-auto w-full max-w-[420px]">
          <ThreadPen />
        </div>
      </div>
    </section>
  );
}

function ThreadPen() {
  return (
    <svg
      viewBox="0 0 400 340"
      className="h-auto w-full"
      role="img"
      aria-label="Un gomitolo dorato da cui parte un filo che si intreccia e diventa una penna"
    >
      {/* filo che si intreccia */}
      <g fill="none" stroke="var(--brand-gold)" strokeLinecap="round" strokeOpacity="0.75">
        <path
          className="thread-draw"
          strokeWidth="2.4"
          d="M96 262 C 150 250, 156 196, 118 178 C 84 162, 74 118, 122 106 C 176 92, 206 138, 250 120"
        />
        <path
          className="thread-draw"
          style={{ animationDelay: ".5s" }}
          strokeWidth="2"
          strokeOpacity="0.5"
          d="M104 258 C 168 236, 200 208, 236 216 C 274 224, 288 190, 268 158"
        />
        <path
          className="thread-draw"
          style={{ animationDelay: ".85s" }}
          strokeWidth="1.6"
          strokeOpacity="0.4"
          d="M112 268 C 180 274, 240 258, 296 232"
        />
      </g>

      {/* gomitolo */}
      <g className="spool-in">
        <circle cx="88" cy="266" r="34" fill="#f7ead0" fillOpacity="0.14" stroke="var(--brand-gold)" strokeWidth="2" strokeOpacity="0.8" />
        <g fill="none" stroke="var(--brand-gold)" strokeOpacity="0.55" strokeWidth="1.4">
          <path d="M60 254 C 78 274, 96 282, 116 278" />
          <path d="M60 278 C 80 262, 98 252, 116 254" />
          <path d="M74 240 C 84 264, 92 280, 104 292" />
        </g>
      </g>

      {/* penna */}
      <g className="pen-in">
        <path
          d="M250 120 L 320 50 C 330 40, 344 40, 352 48 C 360 56, 360 70, 350 80 L 280 150 L 244 162 Z"
          fill="#f7ead0"
          fillOpacity="0.16"
          stroke="var(--brand-gold)"
          strokeWidth="2"
          strokeOpacity="0.85"
          strokeLinejoin="round"
        />
        <path d="M244 162 L 262 132 L 274 144 Z" fill="var(--brand-gold)" fillOpacity="0.85" />
        <path d="M300 70 L 330 100" stroke="var(--brand-gold)" strokeWidth="1.6" strokeOpacity="0.5" />
      </g>

      {/* parole che affiorano */}
      <g className="font-serif" fontStyle="italic">
        {WORDS.map((w) => (
          <text
            key={w.ch}
            x={w.x}
            y={w.y}
            className="thread-word"
            textAnchor="middle"
            fontSize={w.size}
            fill="#f7ead0"
            fillOpacity="0.8"
            style={{ animationDelay: `${w.delay}s, ${w.delay + 1.1}s` }}
          >
            {w.ch}
          </text>
        ))}
      </g>
    </svg>
  );
}
