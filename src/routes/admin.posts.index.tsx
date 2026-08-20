import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type Post } from "@/integrations/pierina/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { useVisitStats } from "@/components/admin/VisitsPanel";
import { Pencil, Plus, Trash2, Eye, EyeOff, Send } from "lucide-react";

export const Route = createFileRoute("/admin/posts/")({
  component: AdminPosts,
});

function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const { stats } = useVisitStats();
  const views = new Map((stats?.postsLast30 ?? []).map((p) => [p.slug, p.count]));

  async function reload() {
    setLoading(true);
    const { data, error } = await db
      .from("posts")
      .select("id,title,slug,excerpt,published_at,created_at,featured_image,category_id")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) setErr(error.message);
    else setPosts((data ?? []) as Post[]);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  useEffect(() => {
    (async () => {
      const { data } = await db.from("categories").select("id,name");
      setCats(new Map(((data ?? []) as { id: string; name: string }[]).map((c) => [c.id, c.name])));
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm("Eliminare l'articolo? L'azione non è reversibile.")) return;
    const { error } = await db.from("posts").delete().eq("id", id);
    if (error) alert(error.message);
    else reload();
  }

  const filtered = posts.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Contenuti</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Articoli ({posts.length})</h1>
        </div>
        <Link
          to="/admin/posts/$id" params={{ id: "new" }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus size={14} /> Nuovo articolo
        </Link>
      </header>

      <input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca per titolo…"
        className="mb-5 w-full max-w-md rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
      />

      {err && <p className="mb-4 text-sm text-destructive">{err}</p>}
      {loading ? (
        <p className="text-sm text-muted-foreground">Caricamento…</p>
      ) : (
        <div className="w-full max-w-full overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Titolo</th>
                <th className="w-[26%] px-4 py-3 hidden md:table-cell">Slug</th>
                <th className="w-[110px] px-4 py-3 hidden lg:table-cell">Pubblicato</th>
                <th className="w-[90px] px-4 py-3 hidden text-right sm:table-cell">Letture 30gg</th>
                <th className="w-[110px] px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <div className="font-serif text-base text-foreground break-words">{p.title}</div>
                    {p.excerpt && (
                      <div className="mt-0.5 line-clamp-1 break-words text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.excerpt) }} />
                    )}
                  </td>
                  <td className="px-4 py-3 hidden break-all font-mono text-xs text-muted-foreground md:table-cell">{p.slug}</td>

                  <td className="px-4 py-3 hidden text-xs text-muted-foreground lg:table-cell">
                    {p.published_at ? (
                      <span className="inline-flex items-center gap-1"><Eye size={12} />{new Date(p.published_at).toLocaleDateString("it-IT")}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700"><EyeOff size={12} /> bozza</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden text-right tabular-nums text-xs text-muted-foreground sm:table-cell">
                    {views.get(p.slug) ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <a
                        href={`/admin/newsletter?post=${p.id}`}
                        title="Invia newsletter agli iscritti"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-accent"
                      >
                        <Send size={14} />
                      </a>
                      <Link to="/admin/posts/$id" params={{ id: p.id }} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => remove(p.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Nessun articolo.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
