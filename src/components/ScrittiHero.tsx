/**
 * Hero della pagina "Scritti": un libro che si apre e libera lettere
 * che salgono e formano la chioma di un albero. Tutto in tonalità bordô/oro.
 */

const BOOK = { x: 200, y: 322 };

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

type Leaf = { ch: string; x: number; y: number; size: number; delay: number };

// chioma: tre anelli di lettere attorno al centro
const CROWN = { x: 200, y: 130 };

const LETTERS = "AMORECPIERINASTORIEDLUNAFVOGTBSCRITIPAROLE".split("");

const LEAVES: Leaf[] = LETTERS.map((ch, i) => {
  const ring = i < 8 ? 0 : i < 22 ? 1 : 2;
  const perRing = ring === 0 ? 8 : ring === 1 ? 14 : LETTERS.length - 22;
  const idx = ring === 0 ? i : ring === 1 ? i - 8 : i - 22;
  const r = [34, 68, 100][ring];
  const a = (idx / perRing) * Math.PI * 2 + ring * 0.7;
  const squash = 0.78; // chioma leggermente ovale
  return {
    ch,
    x: CROWN.x + Math.cos(a) * r * 1.05,
    y: CROWN.y + Math.sin(a) * r * squash,
    size: [26, 22, 18][ring],
    delay: 0.25 + i * 0.09,
  };
});

export function ScrittiHero() {
  return (
    <section className="surface-bordeaux surface-bordeaux-glow relative overflow-hidden border-b border-border">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} />
            Scritti
          </div>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Parole che{" "}
            <span className="italic" style={{ color: "var(--brand-gold)" }}>
              mettono radici.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Articoli, racconti e poesie. Un libro si apre, le lettere si alzano in
            volo e diventano albero — in italiano e in friulano.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <BookTree />
        </div>
      </div>
    </section>
  );
}

function BookTree() {
  return (
    <svg
      viewBox="0 0 400 380"
      className="h-auto w-full"
      role="img"
      aria-label="Un libro aperto da cui volano lettere che formano un albero"
    >
      <defs>
        <linearGradient id="pageL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f7ead0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e3cda3" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="pageR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e3cda3" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f7ead0" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* tronco e rami */}
      <g
        fill="none"
        stroke="var(--brand-gold)"
        strokeLinecap="round"
        strokeOpacity="0.7"
      >
        <path className="tree-draw" strokeWidth="6" d="M200 312 C 198 260, 202 232, 200 196" />
        <path className="tree-draw" style={{ animationDelay: ".35s" }} strokeWidth="3.5" d="M200 240 C 176 222, 158 210, 142 190" />
        <path className="tree-draw" style={{ animationDelay: ".5s" }} strokeWidth="3.5" d="M200 246 C 224 226, 244 214, 258 194" />
        <path className="tree-draw" style={{ animationDelay: ".65s" }} strokeWidth="2.5" d="M200 214 C 186 200, 178 190, 170 172" />
        <path className="tree-draw" style={{ animationDelay: ".8s" }} strokeWidth="2.5" d="M200 214 C 214 200, 224 190, 232 172" />
      </g>

      {/* lettere-foglia */}
      <g className="font-serif">
        {LEAVES.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            className="leaf-letter"
            textAnchor="middle"
            fontSize={l.size}
            fontStyle={i % 3 === 0 ? "italic" : "normal"}
            fill={VOWELS.has(l.ch) ? "var(--brand-gold)" : "#f7ead0"}
            fillOpacity={VOWELS.has(l.ch) ? 1 : 0.72}
            style={
              {
                "--dx": `${BOOK.x - l.x}px`,
                "--dy": `${BOOK.y - l.y}px`,
                animationDelay: `${l.delay}s, ${l.delay + 1.4}s`,
              } as React.CSSProperties
            }
          >
            {l.ch}
          </text>
        ))}
      </g>

      {/* libro aperto */}
      <g className="book-open">
        <path d="M200 322 C 168 300, 128 296, 96 302 L 96 340 C 128 334, 168 338, 200 356 Z" fill="url(#pageL)" />
        <path d="M200 322 C 232 300, 272 296, 304 302 L 304 340 C 272 334, 232 338, 200 356 Z" fill="url(#pageR)" />
        <path
          d="M200 322 L 200 356"
          stroke="var(--brand-gold)"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M200 322 C 168 300, 128 296, 96 302 L 96 340 C 128 334, 168 338, 200 356 C 232 338, 272 334, 304 340 L 304 302 C 272 296, 232 300, 200 322 Z"
          fill="none"
          stroke="var(--brand-gold)"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
