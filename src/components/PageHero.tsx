import type { ReactNode } from "react";
import logoStamp from "../assets/logo-pg-friuli-trasparente.png.asset.json";

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-line" style={{ top: "30%", animationDelay: "0s" }} />
        <div className="hero-line" style={{ top: "70%", animationDelay: "3s" }} />
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--brand-gold)" }}
        />
        <img
          src={logoStamp.url}
          alt=""
          aria-hidden
          className="absolute -right-10 top-1/2 hidden h-56 w-56 -translate-y-1/2 select-none opacity-20 mix-blend-screen md:block lg:h-72 lg:w-72"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
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
