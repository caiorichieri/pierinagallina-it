import type { ReactNode } from "react";

export type Tone = "default" | "libri" | "fiabe" | "poesie" | "fotografie";

export const TONES: Record<
  Tone,
  { bg: string; tint: string; accent: string; ring: string }
> = {
  default:    { bg: "#1e3a5f", tint: "#f3ead8", accent: "#e8b84a", ring: "#e8b84a" },
  libri:      { bg: "#7a1d3a", tint: "#f7e3ea", accent: "#e8b84a", ring: "#c44569" },
  fiabe:      { bg: "#6b4a1a", tint: "#f8ebcf", accent: "#fff3d1", ring: "#e8b84a" },
  poesie:     { bg: "#2f4a3a", tint: "#e4ecdf", accent: "#e8b84a", ring: "#6b8e5a" },
  fotografie: { bg: "#1e3a5f", tint: "#dee5ee", accent: "#e8b84a", ring: "#3b6fa0" },
};

export function PageHero({
  eyebrow,
  title,
  intro,
  tone = "default",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
}) {
  const t = TONES[tone];
  return (
    <section
      className="relative overflow-hidden border-b border-border text-primary-foreground"
      style={{ background: t.bg }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-line" style={{ top: "30%", animationDelay: "0s" }} />
        <div className="hero-line" style={{ top: "70%", animationDelay: "3s" }} />
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: t.ring }}
        />
        <div
          className="absolute -left-32 bottom-[-6rem] h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: t.accent }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: t.accent }}
          />
          {eyebrow}
        </div>
        <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
