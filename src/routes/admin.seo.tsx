import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { useVisitStats } from "@/components/admin/VisitsPanel";
import { AlertTriangle, CheckCircle2, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/admin/seo")({ component: AdminSeo });

const SITE_URL = "https://www.pierinagallina.it";

type SeoPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
};

type Issue = { level: "error" | "warn"; text: string };

function auditPost(p: SeoPost): Issue[] {
  const issues: Issue[] = [];
  const plainExcerpt = (p.excerpt ?? "").replace(/<[^>]*>/g, "").trim();
  if (!plainExcerpt) issues.push({ level: "error", text: "Manca il riassunto (meta description)" });
  else if (plainExcerpt.length < 70) issues.push({ level: "warn", text: `Riassunto troppo corto (${plainExcerpt.length} caratteri, ideale 120–160)` });
  else if (plainExcerpt.length > 200) issues.push({ level: "warn", text: `Riassunto troppo lungo (${plainExcerpt.length} caratteri)` });

  if (!p.title?.trim()) issues.push({ level: "error", text: "Manca il titolo" });
  else if (p.title.length > 65) issues.push({ level: "warn", text: `Titolo lungo (${p.title.length} caratteri, ideale sotto 60)` });

  if (!p.featured_image) issues.push({ level: "warn", text: "Manca l'immagine di copertina (anteprima social)" });

  if (!p.slug) issues.push({ level: "error", text: "Manca l'indirizzo (slug)" });
  else if (!/^[a-z0-9-]+$/.test(p.slug)) issues.push({ level: "warn", text: "Indirizzo con maiuscole o caratteri strani" });
  else if (p.slug.length > 70) issues.push({ level: "warn", text: "Indirizzo molto lungo" });

  if (!p.published_at) issues.push({ level: "warn", text: "Articolo non pubblicato: non compare su Google" });

  return issues;
}

function AdminSeo() {
  const [posts, setPosts] = useState<SeoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [onlyIssues, setOnlyIssues] = useState(true);
  const [q, setQ] = useState("");
  const { stats } = useVisitStats();

  useEffect(() => {
    (async () => {
      const { data, error } = await db
        .from("posts")
        .select("id,title,slug,excerpt,featured_image,published_at")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(2000);
      if (error) setErr(error.message);
      else setPosts((data ?? []) as SeoPost[]);
      setLoading(false);
    })();
  }, []);

  const views = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of stats?.postsLast30 ?? []) m.set(p.slug, p.count);
    return m;
  }, [stats]);

  const audited = useMemo(
    () => posts.map((p) => ({ post: p, issues: auditPost(p) })),
    [posts],
  );

  const totals = useMemo(() => {
    let errors = 0, warns = 0, clean = 0;
    for (const a of audited) {
      const e = a.issues.filter((i) => i.level === "error").length;
      const w = a.issues.length - e;
      errors += e; warns += w;
      if (a.issues.length === 0) clean++;
    }
    return { errors, warns, clean };
  }, [audited]);

  const duplicateSlugs = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of posts) m.set(p.slug, (m.get(p.slug) ?? 0) + 1);
    return [...m.entries()].filter(([, n]) => n > 1).map(([s]) => s);
  }, [posts]);

  const filtered = audited
    .filter((a) => (onlyIssues ? a.issues.length > 0 : true))
    .filter((a) => !q || a.post.title.toLowerCase().includes(q.toLowerCase()));

  const score = posts.length
    ? Math.max(0, Math.round(100 - (totals.errors * 3 + totals.warns) / posts.length * 20))
    : 100;

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Visibilità</p>
        <h1 className="mt-1 font-serif text-3xl italic text-primary">SEO — come ti vede Google</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Qui trovi lo stato di salute dei contenuti (titoli, riassunti, immagini, indirizzi) e i
          collegamenti tecnici che servono ai motori di ricerca.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Punteggio contenuti</div>
          <div className="mt-1 font-serif text-3xl text-foreground tabular-nums">{score}/100</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Articoli</div>
          <div className="mt-1 font-serif text-3xl text-foreground tabular-nums">{posts.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Problemi seri</div>
          <div className="mt-1 font-serif text-3xl text-destructive tabular-nums">{totals.errors}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Da migliorare</div>
          <div className="mt-1 font-serif text-3xl text-amber-700 tabular-nums">{totals.warns}</div>
        </div>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 className="font-serif text-xl italic text-primary">Tecnico</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
              <ExternalLink size={13} /> Mappa del sito (sitemap.xml)
            </a>
          </li>
          <li>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
              <ExternalLink size={13} /> Istruzioni per i motori (robots.txt)
            </a>
          </li>
          <li>
            <a href={`https://search.google.com/search-console?resource_id=${encodeURIComponent(SITE_URL)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
              <ExternalLink size={13} /> Google Search Console
            </a>
          </li>
          <li>
            <a href={`https://www.google.com/search?q=site:pierinagallina.it`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
              <Search size={13} /> Pagine già indicizzate su Google
            </a>
          </li>
        </ul>
        {duplicateSlugs.length > 0 && (
          <p className="mt-3 text-sm text-destructive">
            Indirizzi duplicati ({duplicateSlugs.length}): {duplicateSlugs.slice(0, 5).join(", ")}
          </p>
        )}
      </section>

      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca per titolo…"
            className="w-full max-w-xs rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} />
            Mostra solo articoli con problemi
          </label>
          <span className="text-xs text-muted-foreground">{totals.clean} articoli senza problemi</span>
        </div>

        {err && <p className="mb-3 text-sm text-destructive">{err}</p>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Analisi in corso…</p>
        ) : (
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Articolo</th>
                  <th className="px-4 py-3">Cosa migliorare</th>
                  <th className="px-4 py-3 hidden text-right md:table-cell">Letture 30gg</th>
                  <th className="px-4 py-3 text-right">Modifica</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 300).map(({ post, issues }) => (
                  <tr key={post.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <div className="font-serif text-base text-foreground">{post.title}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">/blog/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      {issues.length === 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                          <CheckCircle2 size={13} /> Tutto a posto
                        </span>
                      ) : (
                        <ul className="space-y-1">
                          {issues.map((i) => (
                            <li
                              key={i.text}
                              className={`inline-flex items-start gap-1.5 text-xs ${i.level === "error" ? "text-destructive" : "text-amber-700"}`}
                            >
                              <AlertTriangle size={12} className="mt-0.5 shrink-0" /> {i.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden text-right tabular-nums text-muted-foreground md:table-cell">
                      {views.get(post.slug) ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to="/admin/posts/$id" params={{ id: post.id }} className="text-xs text-muted-foreground hover:text-accent">
                        Apri →
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">Nessun articolo con problemi. Ottimo!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
