import { ExternalLink } from "lucide-react";

export const SOCIAL_URLS = {
  instagram: "https://www.instagram.com/pierinagallina",
  facebook: "https://www.facebook.com/pierina.gallina",
  youtube: "https://www.youtube.com/@pierinagallina",
} as const;

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

type Social = keyof typeof SOCIAL_URLS;

const LABELS: Record<Social, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
};

interface SocialLinksProps {
  variant?: "light" | "dark";
  size?: number;
  className?: string;
  showLabels?: boolean;
}

export function SocialLinks({
  variant = "light",
  size = 20,
  className = "",
  showLabels = false,
}: SocialLinksProps) {
  const base =
    variant === "light"
      ? "text-primary/80 hover:text-accent"
      : "text-primary-foreground/80 hover:text-accent";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {(Object.keys(SOCIAL_URLS) as Social[]).map((key) => (
        <a
          key={key}
          href={SOCIAL_URLS[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={LABELS[key]}
          className={`inline-flex items-center gap-2 rounded-full p-2 transition-colors hover:scale-105 ${base}`}
          style={{ width: showLabels ? "auto" : size, height: showLabels ? "auto" : size }}
        >
          <span style={{ width: size, height: size }}>{ICONS[key]}</span>
          {showLabels && <span className="text-sm">{LABELS[key]}</span>}
        </a>
      ))}
    </div>
  );
}

export function SocialLinksRow({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {(Object.keys(SOCIAL_URLS) as Social[]).map((key) => (
        <a
          key={key}
          href={SOCIAL_URLS[key]}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 transition-colors ${
            variant === "light"
              ? "text-foreground/80 hover:text-accent"
              : "text-primary-foreground/80 hover:text-accent"
          }`}
        >
          <span className="h-4 w-4">{ICONS[key]}</span>
          <span>{LABELS[key]}</span>
          <ExternalLink size={12} className="opacity-60" />
        </a>
      ))}
    </div>
  );
}
