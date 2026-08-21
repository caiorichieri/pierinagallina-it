// Metadati extra degli articoli (etichette multiple, copertina intera).
// Sono salvati come commento HTML dentro l'estratto: il backend dei contenuti
// non ha colonne dedicate e il commento viene rimosso sia dalla resa pubblica
// (sanitize) sia dall'editor.

export type PostMeta = {
  tags: string[];
  coverFull: boolean;
};

const EMPTY: PostMeta = { tags: [], coverFull: false };
const RE = /<!--\s*pg-meta:(\{[\s\S]*?\})\s*-->/;

export function readPostMeta(raw: string | null | undefined): { meta: PostMeta; clean: string } {
  const text = raw ?? "";
  const m = text.match(RE);
  if (!m) return { meta: { ...EMPTY }, clean: text };
  let meta: PostMeta = { ...EMPTY };
  try {
    const parsed = JSON.parse(m[1]!) as Partial<PostMeta>;
    meta = {
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t): t is string => typeof t === "string") : [],
      coverFull: parsed.coverFull === true,
    };
  } catch {
    /* marcatore corrotto: lo ignoriamo */
  }
  return { meta, clean: text.replace(RE, "").trim() };
}

export function writePostMeta(clean: string, meta: PostMeta): string {
  const body = (clean ?? "").replace(RE, "").trim();
  const isDefault = meta.tags.length === 0 && !meta.coverFull;
  if (isDefault) return body;
  return `${body}\n<!--pg-meta:${JSON.stringify({ tags: meta.tags, coverFull: meta.coverFull })}-->`;
}

/** Tutte le etichette di un articolo: quella principale + quelle extra. */
export function postTagIds(post: { category_id?: string | null; excerpt?: string | null }): string[] {
  const { meta } = readPostMeta(post.excerpt);
  const ids = new Set<string>();
  if (post.category_id) ids.add(post.category_id);
  for (const t of meta.tags) ids.add(t);
  return [...ids];
}
