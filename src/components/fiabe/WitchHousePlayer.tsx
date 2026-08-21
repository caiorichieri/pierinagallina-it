import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import playerArt from "@/assets/witch-house-player.jpg.asset.json";

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
const HIT =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-gold)]";

export function WitchHousePlayer(p: PlayerProps) {
  const pct = p.duration > 0 ? (p.current / p.duration) * 100 : 0;
  const [showVol, setShowVol] = useState(false);

  return (
    <div className="fiaba-player-enter fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
      {/* ---------- Desktop: illustrazione intera con comandi sovrapposti ---------- */}
      <div
        className="relative mx-auto hidden w-full max-w-[1600px] bg-cover bg-center bg-no-repeat shadow-2xl lg:block"
        style={{ backgroundImage: `url(${playerArt.url})`, aspectRatio: "1920 / 538" }}
      >
        {/* titolo */}
        <div className="pointer-events-none absolute left-[13%] top-[52%] w-[26%] -translate-y-1/2">
          <p
            className="truncate font-serif text-[1.6cqw] italic leading-tight"
            style={{ color: "#e2a45c", fontSize: "clamp(14px, 1.5vw, 26px)" }}
          >
            {p.title}
          </p>
          {p.collection && (
            <p
              className="truncate font-mono uppercase tracking-[0.18em]"
              style={{ color: "#c9b79a", fontSize: "clamp(9px, 0.85vw, 15px)" }}
            >
              {p.collection}
            </p>
          )}
        </div>

        {/* tempo trascorso */}
        <span
          className="pointer-events-none absolute right-[83.5%] top-[69%] -translate-y-1/2 font-mono"
          style={{ color: "#d8c3a0", fontSize: "clamp(9px, 0.8vw, 14px)" }}
        >
          {fmt(p.current)}
        </span>

        {/* barra di avanzamento sopra il tratto disegnato */}
        <div className="absolute left-[18.1%] top-[69%] h-[7%] w-[25.6%] -translate-y-1/2">
          <div
            className="absolute left-0 top-1/2 h-[26%] -translate-y-1/2 rounded-full"
            style={{ width: `${pct}%`, background: "var(--brand-gold)", boxShadow: "0 0 8px rgba(232,184,74,0.6)" }}
          />
          <span
            className="pointer-events-none absolute top-1/2 h-[70%] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${pct}%`, background: "var(--brand-gold)" }}
          />
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

        {/* durata totale */}
        <span
          className="pointer-events-none absolute left-[92.5%] top-[69%] -translate-y-1/2 font-mono"
          style={{ color: "#d8c3a0", fontSize: "clamp(9px, 0.8vw, 14px)" }}
        >
          {fmt(p.duration)}
        </span>

        {/* pergamene: precedente / play / successivo */}
        <button
          type="button"
          onClick={p.onPrev}
          aria-label="Fiaba precedente"
          className={`${HIT} left-[28.4%] top-[83.6%] h-[22%] w-[5%]`}
        />
        <button
          type="button"
          onClick={p.onToggle}
          aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
          className={`${HIT} left-[35.2%] top-[83.6%] h-[22%] w-[5.5%]`}
        />
        <button
          type="button"
          onClick={p.onNext}
          aria-label="Fiaba successiva"
          className={`${HIT} left-[41.7%] top-[83.6%] h-[22%] w-[5%]`}
        />

        {/* calderone: comando principale */}
        <button
          type="button"
          onClick={p.onToggle}
          aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
          className={`${HIT} left-[51.3%] top-[66%] grid h-[26%] w-[6%] place-items-center`}
        >
          {p.playing && (
            <Pause
              size={30}
              style={{ color: "#e2a45c", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.7))" }}
            />
          )}
        </button>

        {/* fumo animato sopra il calderone */}
        {p.playing && (
          <span
            aria-hidden="true"
            className="fiaba-smoke pointer-events-none absolute left-[51.3%] top-[52%] h-[18%] w-[4%] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(150,255,190,0.35), transparent 70%)" }}
          />
        )}

        {/* volume */}
        <div className="absolute left-[59.4%] top-[83.6%] -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={() => setShowVol((v) => !v)}
            aria-label="Volume"
            className="block h-[2.4vw] max-h-[46px] w-[3vw] max-w-[56px] rounded-full transition-transform hover:scale-110"
          />
          {showVol && (
            <div
              className="absolute bottom-[130%] left-1/2 -translate-x-1/2 rounded-full border px-3 py-2"
              style={{ background: "rgba(30,18,12,0.92)", borderColor: "rgba(232,184,74,0.45)" }}
            >
              <div className="flex items-center gap-2">
                <Volume2 size={14} style={{ color: "var(--brand-gold)" }} />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={p.volume}
                  onChange={(e) => p.onVolume(Number(e.target.value))}
                  aria-label="Livello del volume"
                  className="h-1 w-28 cursor-pointer accent-[var(--brand-gold)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* boccette della velocità */}
        {RATES.map((r, i) => (
          <button
            key={r}
            type="button"
            onClick={() => p.onRate(r)}
            aria-label={`Velocità ${r}x`}
            aria-pressed={p.rate === r}
            className={`${HIT} top-[83.6%] h-[26%] w-[4.2%]`}
            style={{
              left: `${[64.2, 68.9, 73.5][i]}%`,
              boxShadow: p.rate === r ? "0 0 0 2px var(--brand-gold), 0 0 14px rgba(232,184,74,0.6)" : undefined,
            }}
          />
        ))}
      </div>

      {/* ---------- Mobile / tablet: ritaglio centrale + comandi ---------- */}
      <div
        className="relative block border-t px-3 py-3 shadow-2xl lg:hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(28,16,10,0.72), rgba(28,16,10,0.82)), url(${playerArt.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderColor: "rgba(232,184,74,0.4)",
        }}
      >
        <p className="truncate font-serif text-base italic leading-tight" style={{ color: "#e8c48a" }}>
          {p.title}
        </p>
        {p.collection && (
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "#c9b79a" }}>
            {p.collection}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="w-9 shrink-0 text-right font-mono text-[11px]" style={{ color: "#d8c3a0" }}>
            {fmt(p.current)}
          </span>
          <div className="relative h-4 min-w-0 flex-1">
            <div
              className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full"
              style={{ background: "rgba(232,184,74,0.2)" }}
            />
            <div
              className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full"
              style={{ width: `${pct}%`, background: "var(--brand-gold)" }}
            />
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
          <span className="w-9 shrink-0 font-mono text-[11px]" style={{ color: "#d8c3a0" }}>
            {fmt(p.duration)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <IconBtn label="Fiaba precedente" onClick={p.onPrev}>
            <SkipBack size={18} />
          </IconBtn>
          <button
            type="button"
            onClick={p.onToggle}
            aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
            className="grid h-14 w-14 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--brand-gold)", color: "#2a1710" }}
          >
            {p.playing ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
          </button>
          <IconBtn label="Fiaba successiva" onClick={p.onNext}>
            <SkipForward size={18} />
          </IconBtn>
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
      className="grid h-10 w-10 place-items-center rounded-full border transition-colors hover:bg-white/10"
      style={{ borderColor: "rgba(232,184,74,0.4)", color: "#e8c48a" }}
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
