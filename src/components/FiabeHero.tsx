/**
 * Hero della pagina "Fiabe sonore": tre personaggi da fiaba — una principessa,
 * un troll e una strega — che entrano in scena e si incontrano attorno a un
 * falò di note musicali. Stessa logica di animazione degli hero
 * "Scritti" e "Fotografie" (origine fuori scena → posizione finale).
 */

const GOLD = "var(--brand-gold)";
const CREAM = "#f7ead0";

export function FiabeHero() {
  return (
    <section className="surface-bordeaux surface-bordeaux-glow relative overflow-hidden border-b border-border">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
            Fiabe sonore
          </div>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Voci, suoni,{" "}
            <span className="italic" style={{ color: GOLD }}>
              storie da ascoltare.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Una principessa, un troll e una strega si incontrano attorno alla
            stessa voce: quella di Fata Pierina. Fiabe nate nei giorni del
            lockdown e proseguite negli anni come piccolo dono per bambine e
            bambini.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]">
          <FairyTaleScene />
        </div>
      </div>
    </section>
  );
}

function FairyTaleScene() {
  const notes = Array.from({ length: 7 }, (_, i) => ({
    x: 130 + i * 23,
    y: 96 - (i % 3) * 22,
    delay: 1.1 + i * 0.18,
    gold: i % 2 === 0,
  }));

  return (
    <svg
      viewBox="0 0 400 380"
      className="h-auto w-full"
      role="img"
      aria-label="Una principessa, un troll e una strega si incontrano attorno a un falò di note musicali"
    >
      <defs>
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.55" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* terreno */}
      <path
        className="tree-draw"
        d="M22 322 C 130 300, 270 300, 378 322"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* alone del falò */}
      <circle cx="200" cy="292" r="86" fill="url(#fireGlow)" />

      {/* note musicali che salgono */}
      <g>
        {notes.map((n, i) => (
          <g
            key={i}
            className="fiaba-note"
            style={
              {
                "--dx": `${200 - n.x}px`,
                "--dy": `${292 - n.y}px`,
                animationDelay: `${n.delay}s, ${n.delay + 1.2}s`,
              } as React.CSSProperties
            }
          >
            <circle cx={n.x} cy={n.y} r="5.5" fill={n.gold ? GOLD : CREAM} fillOpacity="0.9" />
            <rect
              x={n.x + 4}
              y={n.y - 22}
              width="2.2"
              height="22"
              fill={n.gold ? GOLD : CREAM}
              fillOpacity="0.9"
            />
          </g>
        ))}
      </g>

      {/* falò */}
      <g className="book-open">
        <path d="M182 306 L218 288 M182 288 L218 306" stroke="#8a5a2b" strokeWidth="6" strokeLinecap="round" />
        <path
          className="fiaba-flame"
          d="M200 252 C 214 268, 216 282, 200 292 C 184 282, 186 268, 200 252 Z"
          fill={GOLD}
          fillOpacity="0.9"
        />
      </g>

      {/* principessa — entra da sinistra */}
      <g
        className="fiaba-char"
        style={{ "--dx": "-150px", animationDelay: "0.25s, 1.5s" } as React.CSSProperties}
      >
        <path d="M78 306 L104 306 L96 244 L86 244 Z" fill="#c44569" fillOpacity="0.9" />
        <rect x="86" y="228" width="10" height="18" rx="4" fill={CREAM} fillOpacity="0.9" />
        <circle cx="91" cy="220" r="12" fill={CREAM} fillOpacity="0.95" />
        <path d="M79 218 C 82 236, 100 236, 103 218 L103 226 C 101 242, 81 242, 79 226 Z" fill="#7c1818" />
        <path d="M81 209 L85 200 L88 207 L91 198 L94 207 L97 200 L101 209 Z" fill={GOLD} />
      </g>

      {/* troll — entra da destra */}
      <g
        className="fiaba-char"
        style={{ "--dx": "160px", animationDelay: "0.6s, 1.8s" } as React.CSSProperties}
      >
        <ellipse cx="318" cy="284" rx="30" ry="26" fill="#6f7c4a" fillOpacity="0.95" />
        <rect x="300" y="300" width="10" height="16" rx="4" fill="#6f7c4a" />
        <rect x="326" y="300" width="10" height="16" rx="4" fill="#6f7c4a" />
        <circle cx="309" cy="278" r="4.5" fill={CREAM} />
        <circle cx="327" cy="278" r="4.5" fill={CREAM} />
        <circle cx="309" cy="278" r="2" fill="#2d0808" />
        <circle cx="327" cy="278" r="2" fill="#2d0808" />
        <path d="M306 292 L312 288 L318 292 L324 288 L330 292" stroke="#2d0808" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M296 262 L292 250 L302 258 Z" fill="#6f7c4a" />
        <path d="M340 262 L344 250 L334 258 Z" fill="#6f7c4a" />
        <path d="M304 258 C 312 246, 324 246, 332 258" stroke={GOLD} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* strega — scende dall'alto sulla scopa */}
      <g
        className="fiaba-char"
        style={{ "--dx": "0px", "--dy2": "-170px", animationDelay: "0.95s, 2.1s" } as React.CSSProperties}
      >
        <path d="M160 176 L246 200" stroke="#8a5a2b" strokeWidth="4" strokeLinecap="round" />
        <path d="M246 200 L266 190 M246 200 L268 200 M246 200 L264 210" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M186 190 L214 190 L206 156 L194 156 Z" fill="#3b2a52" fillOpacity="0.95" />
        <circle cx="200" cy="146" r="11" fill={CREAM} fillOpacity="0.95" />
        <circle cx="196" cy="145" r="1.8" fill="#2d0808" />
        <circle cx="204" cy="145" r="1.8" fill="#2d0808" />
        <path d="M182 136 L218 136 L200 108 Z" fill="#3b2a52" />
        <ellipse cx="200" cy="136" rx="22" ry="4" fill="#3b2a52" />
        <path d="M188 128 L212 128" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
