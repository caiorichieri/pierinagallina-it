import { useState } from "react";
import { Pause, Volume2, X } from "lucide-react";
import playerArt from "@/assets/witch-house-player.png.asset.json";
import mobileArt from "@/assets/witch-house-mobile.png.asset.json";

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
  onClose?: () => void;
};

const RATES = [0.75, 1, 1.25];
const HIT =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-gold)]";

export function WitchHousePlayer(p: PlayerProps) {
  const pct = p.duration > 0 ? (p.current / p.duration) * 100 : 0;
  const [showVol, setShowVol] = useState(false);

  const closeBtn = p.onClose ? (
    <button
      type="button"
      onClick={p.onClose}
      aria-label="Chiudi player"
      className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border-2 shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{
        borderColor: "var(--brand-gold)",
        background: "var(--brand-primary)",
        color: "var(--brand-gold)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      }}
    >
      <X size={18} />
    </button>
  ) : null;

  return (
    <div className="fiaba-player-enter pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
      {/* ---------- Desktop: illustrazione trasparente con comandi sovrapposti ---------- */}
      <div className="pointer-events-none relative mx-auto hidden lg:block" style={{ width: "min(100%, calc(clamp(148px, 16vw, 226px) * 3.508))" }}>
        {closeBtn && (
          <div className="pointer-events-auto absolute -right-3 -top-12 z-50">
            {closeBtn}
          </div>
        )}

        {/* fumo dal camino durante la riproduzione (dietro la casetta) */}
        {p.playing && (
          <div aria-hidden="true" className="pointer-events-none absolute left-[76.6%] top-[13%] z-0 h-0 w-0">
            {[0, 1.5, 3].map((d) => (
              <span
                key={d}
                className="fiaba-chimney-smoke absolute block h-[46px] w-[46px] rounded-full"
                style={{
                  animationDelay: `${d}s`,
                  background: "radial-gradient(circle, rgba(168,28,46,0.9), rgba(168,28,46,0) 70%)",
                  filter: "blur(0.5px)",
                }}
              />
            ))}
          </div>
        )}

        <div
          className="pointer-events-auto relative z-10 w-full"
          style={{
            backgroundImage: `url(${playerArt.url})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom center",
            aspectRatio: "1866 / 532",
            height: "clamp(148px, 16vw, 226px)",
            filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.45))",
          }}
        >

        {/* targa che copre il titolo disegnato */}
        <div
          className="pointer-events-none absolute left-[10.2%] top-[47%] h-[20%] w-[20%] rounded-[6px]"
          style={{
            background: "linear-gradient(180deg, #3a2820 0%, #2c1d16 100%)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.7)",
          }}
        />

        {/* titolo */}
        <div className="pointer-events-none absolute left-[11.5%] top-[56%] w-[18.5%] -translate-y-1/2">
          <p
            className="truncate font-serif italic leading-tight"
            style={{ color: "#e2a45c", fontSize: "clamp(12px, 1.1vw, 20px)" }}
          >
            {p.title}
          </p>

          {p.collection && (
            <p
              className="truncate font-mono uppercase tracking-[0.18em]"
              style={{ color: "#c9b79a", fontSize: "clamp(8px, 0.65vw, 12px)" }}
            >
              {p.collection}
            </p>
          )}
        </div>

        {/* tempo trascorso */}
        <span
          className="pointer-events-none absolute right-[85%] top-[67%] -translate-y-1/2 font-mono"
          style={{ color: "#d8c3a0", fontSize: "clamp(9px, 0.8vw, 14px)" }}
        >
          {fmt(p.current)}
        </span>

        {/* barra di avanzamento sopra il tratto disegnato */}
        <div className="absolute left-[16.4%] top-[67%] h-[8%] w-[26.3%] -translate-y-1/2">
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
          className="pointer-events-none absolute left-[93%] top-[67%] -translate-y-1/2 font-mono"
          style={{ color: "#d8c3a0", fontSize: "clamp(9px, 0.8vw, 14px)" }}
        >
          {fmt(p.duration)}
        </span>

        {/* pergamene: precedente / play / successivo */}
        <button
          type="button"
          onClick={p.onPrev}
          aria-label="Fiaba precedente"
          className={`${HIT} left-[27.5%] top-[81%] h-[22%] w-[5%]`}
        />
        <button
          type="button"
          onClick={p.onToggle}
          aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
          className={`${HIT} left-[34.1%] top-[81%] h-[22%] w-[5.5%]`}
        />
        <button
          type="button"
          onClick={p.onNext}
          aria-label="Fiaba successiva"
          className={`${HIT} left-[40.8%] top-[81%] h-[22%] w-[5%]`}
        />

        {/* calderone: comando principale (nessuna icona: il disegno basta) */}
        <button
          type="button"
          onClick={p.onToggle}
          aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
          className={`${HIT} left-[49.6%] top-[82%] h-[28%] w-[6.5%]`}
        />


        {/* volume */}
        <div className="absolute left-[58.8%] top-[81%] -translate-x-1/2 -translate-y-1/2">
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
            className={`${HIT} top-[81%] h-[28%] w-[4.2%]`}
            style={{
              left: `${[64, 68.7, 73.5][i]}%`,
              boxShadow: p.rate === r ? "0 0 0 2px var(--brand-gold), 0 0 14px rgba(232,184,74,0.6)" : undefined,
            }}
          />
        ))}
      </div>
      </div>

      {/* ---------- Mobile / tablet: casetta verticale interattiva ---------- */}
      <div className="pointer-events-none relative block lg:hidden">
        <div className="pointer-events-none relative mx-auto w-full max-w-[520px]">
          {closeBtn && (
            <div className="pointer-events-auto absolute right-2 -top-11 z-50">{closeBtn}</div>
          )}

          {/* fumo dal calderone */}
          {p.playing && (
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[34%] z-0 h-0 w-0">
              {[0, 1.5, 3].map((d) => (
                <span
                  key={d}
                  className="fiaba-chimney-smoke absolute block h-[34px] w-[34px] rounded-full"
                  style={{
                    animationDelay: `${d}s`,
                    background: "radial-gradient(circle, rgba(168,28,46,0.9), rgba(168,28,46,0) 70%)",
                    filter: "blur(0.5px)",
                  }}
                />
              ))}
            </div>
          )}

          <div
            className="pointer-events-auto relative z-10 w-full"
            style={{
              backgroundImage: `url(${mobileArt.url})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              aspectRatio: "1 / 1",
              filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.45))",
            }}
          >
            {/* titolo appena sopra il fumo del calderone */}
            <div className="pointer-events-none absolute left-1/2 top-[30%] w-[58%] -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="truncate font-serif text-[15px] italic leading-tight" style={{ color: "#e2a45c" }}>
                {p.title}
              </p>
              {p.collection && (
                <p className="truncate font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "#c9b79a" }}>
                  {p.collection}
                </p>
              )}
            </div>

            {/* calderone = play/pausa */}

            <button
              type="button"
              onClick={p.onToggle}
              aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
              className={`${HIT} left-[50%] top-[40%] h-[14%] w-[18%]`}
            />

            {/* pergamene prev / next e disco play */}
            <button
              type="button"
              onClick={p.onPrev}
              aria-label="Fiaba precedente"
              className={`${HIT} left-[34.6%] top-[54%] h-[8%] w-[10%]`}
            />
            <button
              type="button"
              onClick={p.onToggle}
              aria-label={p.playing ? "Metti in pausa" : "Ascolta"}
              className={`${HIT} left-[50%] top-[53.6%] h-[13%] w-[13%]`}
            >
              {p.playing && (
                <span
                  className="absolute inset-0 grid place-items-center"
                  style={{ color: "#e8b84a" }}
                >
                  <Pause size={22} />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={p.onNext}
              aria-label="Fiaba successiva"
              className={`${HIT} left-[65.5%] top-[54%] h-[8%] w-[10%]`}
            />

            {/* boccette velocità */}
            {RATES.map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() => p.onRate(r)}
                aria-label={`Velocità ${r}x`}
                aria-pressed={p.rate === r}
                className={`${HIT} top-[68.2%] h-[9%] w-[8%]`}
                style={{
                  left: `${[41, 50, 59.4][i]}%`,
                  boxShadow: p.rate === r ? "0 0 0 2px var(--brand-gold), 0 0 14px rgba(232,184,74,0.6)" : undefined,
                }}
              />
            ))}

            {/* contatore del tempo unico */}
            <span
              className="pointer-events-none absolute left-1/2 top-[94.6%] -translate-x-1/2 -translate-y-1/2 font-mono text-[11px]"
              style={{ color: "#d8c3a0" }}
            >
              {fmt(p.current)} / {fmt(p.duration)}
            </span>


            {/* barra di avanzamento */}
            <div className="absolute left-[32.3%] top-[90.6%] h-[5%] w-[35.4%] -translate-y-1/2">
              <div
                className="absolute left-0 top-1/2 h-[5px] -translate-y-1/2 rounded-full"
                style={{ width: `${pct}%`, background: "var(--brand-gold)", boxShadow: "0 0 8px rgba(232,184,74,0.6)" }}
              />
              <span
                className="pointer-events-none absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full"
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

            {/* volume verticale sulla porta */}
            <div className="absolute left-[88.5%] top-[80.5%] h-[14%] w-[10%] -translate-x-1/2 -translate-y-1/2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={p.volume}
                onChange={(e) => p.onVolume(Number(e.target.value))}
                aria-label="Livello del volume"
                className="absolute left-1/2 top-1/2 h-6 w-[110%] -translate-x-1/2 -translate-y-1/2 -rotate-90 cursor-pointer opacity-0"
              />
              <span
                className="pointer-events-none absolute left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full"
                style={{ bottom: `${p.volume * 100}%`, background: "var(--brand-gold)" }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


function fmt(s: number) {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
