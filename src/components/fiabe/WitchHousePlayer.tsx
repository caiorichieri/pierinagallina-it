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
        {/* tetto della casetta */}
        <svg
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
          className="pointer-events-none block h-9 w-full sm:h-12"
          aria-hidden="true"
        >
          <path d="M2 58 L58 16 L206 4 L350 18 L398 58 Z" fill="var(--brand-primary)" stroke={GOLD} strokeWidth="1.5" />
          <path d="M28 42 H372 M60 28 H340" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" />
          {/* camino */}
          <path d="M300 24 h20 v-18 h-20 z" fill="var(--brand-primary)" stroke={GOLD} strokeWidth="1.5" />
        </svg>

        {/* fumo */}
        <div className="pointer-events-none absolute left-[76%] top-0 -translate-y-6" aria-hidden="true">
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
