/**
 * Piccoli disegni a tratto oro scelti in base alle parole chiave del titolo
 * della fiaba. Tutti condividono lo stesso viewBox 48x48 e il tratto sottile.
 */

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Kind =
  | "corona"
  | "rana"
  | "luna"
  | "bosco"
  | "stella"
  | "gatto"
  | "fiore"
  | "strega"
  | "uccello"
  | "cuore"
  | "note";

const RULES: [Kind, RegExp][] = [
  ["corona", /princip|re\b|regin|castell|coron|cavalier/i],
  ["rana", /ran[ae]|rospo|stagn|lago|pesc/i],
  ["luna", /luna|notte|sogn|nann|dorm|stell.*notte/i],
  ["bosco", /bosc|alber|fores|legn|natur|fogli/i],
  ["stella", /stell|magi|incant|desider|cometa/i],
  ["gatto", /gatt|micio|cane|lupo|volp|orso|animal/i],
  ["fiore", /fior|petal|prima|giardin|rosa/i],
  ["strega", /streg|fattucc|maga|troll|folle|gnom|fata/i],
  ["uccello", /uccel|passer|rondin|ali\b|vol[oa]|angel/i],
  ["cuore", /amor|cuore|amic|mamm|nonn|bambin/i],
];

export function pickKind(title: string): Kind {
  for (const [kind, re] of RULES) if (re.test(title)) return kind;
  return "note";
}

export function FiabaIcon({ title, className }: { title: string; className?: string }) {
  const kind = pickKind(title);
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {shapes[kind]}
    </svg>
  );
}

const shapes: Record<Kind, JSX.Element> = {
  corona: (
    <g {...S}>
      <path d="M10 32 L8 16 L17 23 L24 12 L31 23 L40 16 L38 32 Z" />
      <path d="M10 36 H38" />
      <circle cx="24" cy="26" r="1.6" />
    </g>
  ),
  rana: (
    <g {...S}>
      <path d="M12 34 C12 24 18 20 24 20 C30 20 36 24 36 34 Z" />
      <circle cx="18" cy="18" r="4.5" />
      <circle cx="30" cy="18" r="4.5" />
      <circle cx="18" cy="18" r="1.2" fill="currentColor" />
      <circle cx="30" cy="18" r="1.2" fill="currentColor" />
      <path d="M20 29 C22 31 26 31 28 29" />
      <path d="M10 34 l-3 4 M38 34 l3 4" />
    </g>
  ),
  luna: (
    <g {...S}>
      <path d="M31 8 A16 16 0 1 0 31 40 A13 13 0 1 1 31 8 Z" />
      <path d="M38 14 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" />
    </g>
  ),
  bosco: (
    <g {...S}>
      <path d="M24 6 L15 22 H21 L13 36 H35 L27 22 H33 Z" />
      <path d="M24 36 V42" />
      <path d="M8 42 H40" />
    </g>
  ),
  stella: (
    <g {...S}>
      <path d="M24 7 l4.6 10.6 11.4 1 -8.6 7.6 2.6 11.2 -10-6 -10 6 2.6-11.2 -8.6-7.6 11.4-1 Z" />
    </g>
  ),
  gatto: (
    <g {...S}>
      <path d="M13 20 L11 10 L20 15" />
      <path d="M35 20 L37 10 L28 15" />
      <circle cx="24" cy="26" r="13" />
      <circle cx="19" cy="24" r="1.4" fill="currentColor" />
      <circle cx="29" cy="24" r="1.4" fill="currentColor" />
      <path d="M24 29 l-2 2 M24 29 l2 2" />
      <path d="M8 27 H16 M32 27 H40" />
    </g>
  ),
  fiore: (
    <g {...S}>
      <circle cx="24" cy="18" r="4" />
      <path d="M24 14 C18 6 12 12 20 16 M24 14 C30 6 36 12 28 16" />
      <path d="M20 21 C12 20 12 30 20 24 M28 21 C36 20 36 30 28 24" />
      <path d="M24 22 V42" />
      <path d="M24 32 C18 28 14 32 20 35" />
    </g>
  ),
  strega: (
    <g {...S}>
      <path d="M12 20 H36 L24 5 Z" />
      <ellipse cx="24" cy="20" rx="15" ry="3" />
      <path d="M17 24 C17 34 20 40 24 42 C28 40 31 34 31 24" />
      <circle cx="21" cy="28" r="1.2" fill="currentColor" />
      <circle cx="27" cy="28" r="1.2" fill="currentColor" />
    </g>
  ),
  uccello: (
    <g {...S}>
      <path d="M8 28 C16 14 30 14 38 22 L42 20 L39 26 C36 36 20 40 10 34" />
      <circle cx="33" cy="22" r="1.3" fill="currentColor" />
      <path d="M18 28 C22 22 28 22 32 26" />
    </g>
  ),
  cuore: (
    <g {...S}>
      <path d="M24 40 C6 28 10 12 20 12 C23 12 24 15 24 15 C24 15 25 12 28 12 C38 12 42 28 24 40 Z" />
    </g>
  ),
  note: (
    <g {...S}>
      <path d="M18 34 V12 L36 8 V30" />
      <circle cx="14" cy="34" r="4.5" />
      <circle cx="32" cy="30" r="4.5" />
    </g>
  ),
};
