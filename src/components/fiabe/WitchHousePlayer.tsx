import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const GOLD = "var(--brand-gold)";

export type PlayerProps = {
  title: string;
  collection?: string;
  playing: boolean;
  current: number;
  duration: number;
  volume: number;
  rate: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (t: number) => void;
  onVolume: (v: number) => void;
  onRate: (r: number) => void;
};

const RATES = [0.75, 1, 1.25];

export function WitchHousePlayer(p: PlayerProps) {
  const pct = p.duration > 0 ? (p.current / p.duration) * 100 : 0;

  return (
    <div className="fiaba-player-enter fixed inset-x-0 bottom-0 z-40 px-2 pb-[env(safe-area-inset-bottom)] sm:px-4 sm:pb-4">
      <div className="relative mx-auto max-w-4xl">
        {/* tetto della casetta — cottage disegnato */}
        <svg
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          className="pointer-events-none block h-16 w-full sm:h-24"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="fiabaRoof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--brand-primary) 70%, black)" />
              <stop offset="100%" stopColor="var(--brand-primary)" />
            </linearGradient>
            <clipPath id="fiabaRoofClip">
              <path d="M4 116 L54 56 C 96 22, 150 6, 200 10 C 252 14, 306 32, 346 62 L396 116 Z" />
            </clipPath>
          </defs>

          {/* comignolo in mattoni */}
          <g>
            <path d="M296 60 h30 v-40 h-30 z" fill="url(#fiabaRoof)" stroke={GOLD} strokeWidth="1.6" />
            <path d="M292 22 h38 v-9 h-38 z" fill="url(#fiabaRoof)" stroke={GOLD} strokeWidth="1.6" />
            <g stroke={GOLD} strokeOpacity="0.32" strokeWidth="1">
              <path d="M296 32 H326 M296 44 H326 M311 22 V32 M304 32 V44 M318 32 V44 M311 44 V56" />
            </g>
          </g>

          {/* falda del tetto */}
          <path
            d="M4 116 L54 56 C 96 22, 150 6, 200 10 C 252 14, 306 32, 346 62 L396 116 Z"
            fill="url(#fiabaRoof)"
            stroke={GOLD}
            strokeWidth="1.8"
          />

          {/* tegole a scaglie */}
          <g clipPath="url(#fiabaRoofClip)" stroke={GOLD} strokeOpacity="0.28" strokeWidth="1" fill="none">
            {[38, 58, 78, 98].map((y, r) => (
              <g key={y}>
                {Array.from({ length: 22 }).map((_, i) => {
                  const x = -10 + i * 20 + (r % 2 ? 10 : 0);
                  return <path key={i} d={`M${x} ${y} a10 9 0 0 1 20 0`} />;
                })}
              </g>
            ))}
          </g>

          {/* colmo e abbaino */}
          <path d="M56 58 C 100 26, 152 10, 200 12 C 250 14, 304 34, 344 64" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.2" fill="none" />
          <path d="M150 116 V78 C 150 60, 186 60, 186 78 V116 Z" fill="url(#fiabaRoof)" stroke={GOLD} strokeWidth="1.6" />
          <path d="M144 80 C 152 62, 184 62, 192 80" fill="none" stroke={GOLD} strokeWidth="1.6" />
          <path d="M168 86 v24 M158 96 h20" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1.1" />
          <circle cx="168" cy="84" r="9" fill="none" stroke={GOLD} strokeWidth="1.2" />

          {/* banderuola */}
          <path d="M200 10 V-2 M200 2 l16 4 -16 4 z" stroke={GOLD} strokeWidth="1.4" fill="none" />
        </svg>

        {/* fumo */}
        <div className="pointer-events-none absolute left-[77%] top-0 -translate-y-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={p.playing ? "fiaba-smoke" : "opacity-0"}
              style={{
                display: "block",
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: "color-mix(in oklab, var(--brand-gold) 40%, transparent)",
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div
          className="surface-bordeaux -mt-px rounded-b-xl border border-t-0 px-3 py-3 shadow-2xl sm:px-5"
          style={{ borderColor: "color-mix(in oklab, var(--brand-gold) 35%, transparent)" }}
        >
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:gap-5">
            {/* finestrelle illuminate */}
            <div className="hidden shrink-0 gap-2 sm:flex" aria-hidden="true">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={p.playing ? "fiaba-window" : ""}
                  style={{
                    display: "block",
                    width: 22,
                    height: 26,
                    borderRadius: "4px 4px 2px 2px",
                    border: `1.5px solid ${GOLD}`,
                    background: `color-mix(in oklab, ${GOLD} ${p.playing ? 45 : 12}%, transparent)`,
                    animationDelay: `${i * 0.45}s`,
                  }}
                />
              ))}
            </div>

            <div className="min-w-0">
              <p className="truncate font-serif text-base italic leading-tight text-primary-foreground sm:text-lg">
                {p.title}
              </p>
              {p.collection && (
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">
                  {p.collection}
                </p>
              )}

              {/* staccionata / barra di avanzamento */}
              <div className="mt-2 flex items-center gap-2">
                <span className="w-9 shrink-0 text-right font-mono text-[11px] text-primary-foreground/70">
                  {fmt(p.current)}
                </span>
                <div className="relative h-4 min-w-0 flex-1">
                  <div
                    className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full"
                    style={{ background: "color-mix(in oklab, var(--brand-gold) 18%, transparent)" }}
                  />
                  <div
                    className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full"
                    style={{ width: `${pct}%`, background: GOLD }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1" aria-hidden="true">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span
                        key={i}
                        className="block h-3 w-[2px] rounded-full"
                        style={{ background: "color-mix(in oklab, var(--brand-gold) 45%, transparent)" }}
                      />
                    ))}
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={p.duration || 0}
                    step={0.1}
                    value={p.current}
                    onChange={(e) => p.onSeek(Number(e.target.value))}
                    aria-label="Avanzamento della fiaba"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
                <span className="w-9 shrink-0 font-mono text-[11px] text-primary-foreground/70">{fmt(p.duration)}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 sm:mt-2 sm:gap-4">
            <IconBtn label="Fiaba precedente" onClick={p.onPrev}>
              <SkipBack size={18} />
            </IconBtn>

            <button
              type="button"
              onClick={p.onToggle}
              aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
              className="grid h-14 w-14 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ background: GOLD, color: "var(--brand-primary)" }}
            >
              {p.playing ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>

            <IconBtn label="Fiaba successiva" onClick={p.onNext}>
              <SkipForward size={18} />
            </IconBtn>

            <div className="ml-4 hidden items-center gap-2 sm:flex">
              <Volume2 size={16} className="text-primary-foreground/70" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={p.volume}
                onChange={(e) => p.onVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1 w-24 cursor-pointer accent-[var(--brand-gold)]"
              />
            </div>

            <div className="hidden items-center gap-1 sm:flex">
              {RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => p.onRate(r)}
                  aria-label={`Velocità ${r}x`}
                  className="rounded-full border px-2 py-1 font-mono text-[11px] transition-colors"
                  style={{
                    borderColor: "color-mix(in oklab, var(--brand-gold) 35%, transparent)",
                    background: p.rate === r ? GOLD : "transparent",
                    color: p.rate === r ? "var(--brand-primary)" : "var(--primary-foreground)",
                  }}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border text-primary-foreground transition-colors hover:bg-primary-foreground/10"
      style={{ borderColor: "color-mix(in oklab, var(--brand-gold) 35%, transparent)" }}
    >
      {children}
    </button>
  );
}

function fmt(s: number) {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
