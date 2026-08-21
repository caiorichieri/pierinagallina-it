/**
 * Colonne decorative laterali della pagina Fiabe: bosco a sinistra,
 * torre della principessa a destra. Solo desktop, puramente estetiche.
 */

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ForestDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 620" className={className} aria-hidden="true" preserveAspectRatio="xMidYMin meet">
      <g {...S} opacity="0.75">
        {/* alberi storti */}
        <path d="M40 600 C 36 520, 48 470, 42 400" />
        <path d="M42 470 C 30 452, 24 438, 22 420" />
        <path d="M42 430 C 56 414, 64 402, 66 386" />
        <path d="M42 400 C 22 372, 20 336, 42 312 C 66 336, 62 374, 42 400 Z" />

        <path d="M86 600 C 90 540, 80 500, 86 452" />
        <path d="M86 500 C 98 486, 104 474, 104 460" />
        <path d="M86 452 C 68 428, 68 396, 86 374 C 106 396, 104 430, 86 452 Z" />

        {/* funghi */}
        <path d="M22 596 v-14" />
        <path d="M12 582 C 14 570, 30 570, 32 582 Z" />
        <path d="M100 592 v-10" />
        <path d="M92 582 C 94 573, 106 573, 108 582 Z" />

        {/* civetta */}
        <ellipse cx="62" cy="250" rx="18" ry="22" />
        <circle cx="55" cy="243" r="5" />
        <circle cx="69" cy="243" r="5" />
        <circle cx="55" cy="243" r="1.6" fill="currentColor" />
        <circle cx="69" cy="243" r="1.6" fill="currentColor" />
        <path d="M59 251 L62 255 L65 251" />
        <path d="M46 232 L50 224 L55 231 M78 232 L74 224 L69 231" />
        <path d="M40 272 H84" />

        {/* rami e foglie in alto */}
        <path d="M14 60 C 44 92, 62 130, 66 178" />
        <path d="M30 84 C 44 78, 54 82, 60 92" />
        <path d="M48 120 C 62 112, 74 116, 80 128" />
        <path d="M60 160 C 44 158, 34 164, 30 174" />
      </g>
    </svg>
  );
}

export function TowerDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 620" className={className} aria-hidden="true" preserveAspectRatio="xMidYMin meet">
      <g {...S} opacity="0.75">
        {/* luna e stelle */}
        <path d="M74 40 A22 22 0 1 0 74 84 A17 17 0 1 1 74 40 Z" />
        <path d="M30 110 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2 Z" />
        <path d="M96 132 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6-4 -4-1.6 4-1.6 Z" />
        <path d="M22 190 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4-3.4 -3.4-1.4 3.4-1.4 Z" />

        {/* pipistrelli */}
        <path d="M24 150 C 30 144, 34 150, 38 146 C 42 150, 46 144, 52 150 C 46 156, 42 152, 38 156 C 34 152, 30 156, 24 150 Z" />
        <path d="M74 214 C 79 209, 82 214, 85 211 C 88 214, 91 209, 96 214 C 91 219, 88 216, 85 219 C 82 216, 79 219, 74 214 Z" />

        {/* torre */}
        <path d="M36 600 V300 H84 V600" />
        <path d="M28 300 L60 246 L92 300 Z" />
        <path d="M60 246 V228 L82 236 L60 244" />
        <rect x="52" y="336" width="16" height="24" rx="8" />
        <path d="M52 348 H68" />
        <rect x="52" y="404" width="16" height="24" rx="8" />
        <path d="M36 470 H84" />
        <path d="M50 540 C 50 522, 70 522, 70 540 V600" />
        {/* edera */}
        <path d="M84 590 C 96 556, 88 520, 96 486" />
        <path d="M90 560 c 8 -4, 12 2, 8 8 M92 520 c 8 -4, 12 2, 8 8" />
      </g>
    </svg>
  );
}
