import { FiabaIcon } from "./FiabaIcon";

export function FiabaCard({
  title,
  index,
  duration,
  active,
  playing,
  onSelect,
}: {
  title: string;
  index: number;
  duration?: number;
  active: boolean;
  playing: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={[
        "fiaba-card group relative flex w-full flex-col items-start gap-4 rounded-xl border p-5 text-left transition-all duration-300",
        active
          ? "border-transparent bg-card shadow-lg ring-2"
          : "border-border bg-card hover:-translate-y-1 hover:shadow-lg",
      ].join(" ")}
      style={active ? ({ ["--tw-ring-color" as string]: "var(--brand-gold)" }) : undefined}
    >
      <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
        <span
          className="fiaba-card-icon grid h-14 w-14 shrink-0 place-items-center rounded-full border transition-transform duration-500"
          style={{
            borderColor: "color-mix(in oklab, var(--brand-gold) 45%, transparent)",
            background: "color-mix(in oklab, var(--brand-gold) 10%, transparent)",
            color: "var(--brand-gold)",
          }}
        >
          <FiabaIcon title={title} className="h-8 w-8" />
        </span>

        <span className="min-w-0">
          <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Fiaba {String(index + 1).padStart(2, "0")}
            {duration ? ` · ${fmt(duration)}` : ""}
          </span>
          <span className="mt-1 block font-serif text-lg italic leading-snug text-foreground md:text-xl">
            {title}
          </span>
        </span>
      </div>

      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        {active && playing ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="fiaba-wave w-[3px] rounded-full"
                style={{ background: "var(--brand-gold)", animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </span>
        ) : null}
        {active ? (playing ? "In ascolto" : "In pausa") : "Ascolta"}
      </span>
    </button>
  );
}

function fmt(s: number) {
  if (!isFinite(s)) return "";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
