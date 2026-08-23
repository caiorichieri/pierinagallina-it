import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "u", "s", "code", "pre", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "img", "figure", "figcaption",
  "hr", "span", "div",
  "iframe",
];

const ALLOWED_ATTR = [
  "href", "title", "target", "rel", "src", "alt", "class",
  "allow", "allowfullscreen", "frameborder", "width", "height", "loading",
];

// Solo i video YouTube possono essere incorporati.
const YOUTUBE_EMBED = /^https:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)[A-Za-z0-9_-]{6,20}(?:\?[^"'<>\s]*)?$/;

/** Rimuove ogni iframe che non punti a un video YouTube. */
function stripForeignIframes(html: string): string {
  return html.replace(/<iframe\b([^>]*)>([\s\S]*?)<\/iframe\s*>/gi, (full, attrs: string) => {
    const m = /src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs);
    const src = (m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim();
    return YOUTUBE_EMBED.test(src) ? full : "";
  });
}

const VOID_TAGS = new Set(["br", "hr", "img"]);
const TAG_SET = new Set(ALLOWED_TAGS);
const ATTR_SET = new Set(ALLOWED_ATTR);

const SAFE_URL = /^(?:https?:|mailto:|tel:|\/|#|\.\/|\.\.\/)/i;

function escapeText(s: string): string {
  return s.replace(/&(?!(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/&(?!(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Allowlist sanitizer used during SSR (DOMPurify needs a DOM).
// Mirrors the client-side DOMPurify configuration so markup matches on hydration.
function sanitizeOnServer(rawInput: string): string {
  const input = stripForeignIframes(rawInput);
  // Drop dangerous elements together with their content.
  let html = input.replace(
    /<(script|style|object|embed|noscript|template)\b[\s\S]*?<\/\1\s*>/gi,
    "",
  );
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  let out = "";
  const open: string[] = [];
  const tokenRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = tokenRe.exec(html)) !== null) {
    out += escapeText(html.slice(last, m.index));
    last = m.index + m[0].length;

    const name = m[1]!.toLowerCase();
    const isClose = m[0].startsWith("</");
    if (!TAG_SET.has(name)) continue;

    if (isClose) {
      if (VOID_TAGS.has(name)) continue;
      const idx = open.lastIndexOf(name);
      if (idx === -1) continue;
      while (open.length > idx) out += `</${open.pop()}>`;
      continue;
    }

    if (name === "iframe") {
      const srcMatch = /src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(m[2] ?? "");
      const src = (srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3] ?? "").trim();
      if (!YOUTUBE_EMBED.test(src)) continue;
    }

    let attrs = "";
    const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let a: RegExpExecArray | null;
    while ((a = attrRe.exec(m[2] ?? "")) !== null) {
      const key = a[1]!.toLowerCase();
      if (!ATTR_SET.has(key)) continue;
      const raw = (a[2] ?? a[3] ?? a[4] ?? "").trim();
      if ((key === "href" || key === "src") && raw && !SAFE_URL.test(raw)) continue;
      attrs += ` ${key}="${escapeAttr(raw)}"`;
    }

    if (VOID_TAGS.has(name)) {
      out += `<${name}${attrs}>`;
    } else {
      out += `<${name}${attrs}>`;
      open.push(name);
    }
  }

  out += escapeText(html.slice(last));
  while (open.length) out += `</${open.pop()}>`;
  return out;
}

export function sanitizeHtml(dirty: string | null | undefined): string {
  const input = dirty ?? "";
  if (typeof window === "undefined") return sanitizeOnServer(input);
  return DOMPurify.sanitize(stripForeignIframes(input), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder"],
  });
}
