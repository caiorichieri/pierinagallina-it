import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type Category } from "@/integrations/pierina/client";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export const Route = createFileRoute("/admin/etichette")({
  component: AdminEtichette,
});

export function slugifyTag(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Row = Category & { used: number };

function AdminEtichette() {
  const [rows, setRows] = useState<Row[]>([]);
  const [noneCount, setNoneCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function reload() {
    setLoading(true);
    setErr(null);
    const [cats, posts] = await Promise.all([
      db.from("categories").select("id,name,slug,post_count").order("name", { ascending: true }),
      db.from("posts").select("category_id").limit(5000),
    ]);
    if (cats.error) {
      setErr(cats.error.message);
      setLoading(false);
      return;
    }
    const counts = new Map<string, number>();
    let none = 0;
    for (const p of (posts.data ?? []) as { category_id: string | null }[]) {
      if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
      else none++;
    }
    setNoneCount(none);
    const list = ((cats.data as Category[] | null) ?? []).map((c) => ({
      ...c,
      used: counts.get(c.id) ?? c.post_count ?? 0,
    }));
    // etichette usate dagli articoli ma non più in elenco: recuperate come voci "orfane"
    for (const [id, n] of counts) {
      if (!list.some((c) => c.id === id)) {
        list.push({ id, name: "(etichetta senza nome)", slug: "", post_count: n, used: n });
      }
    }
    list.sort((a, b) => b.used - a.used || a.name.localeCompare(b.name));
    setRows(list);
    setLoading(false);
  }


  useEffect(() => {
    reload();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    const { error } = await db.from("categories").insert({ name, slug: slugifyTag(name), post_count: 0 });
    setBusy(false);
    if (error) return setErr(error.message);
    setNewName("");
    reload();
  }

  async function rename(id: string) {
    const name = editName.trim();
    if (!name) return;
    setBusy(true);
    const { error } = await db.from("categories").update({ name, slug: slugifyTag(name) }).eq("id", id);
    setBusy(false);
    if (error) return setErr(error.message);
    setEditId(null);
    reload();
  }

  async function remove(row: Row) {
    const msg = row.used
      ? `L'etichetta "${row.name}" è usata da ${row.used} articoli. Eliminandola, quegli articoli resteranno senza etichetta (nessun articolo verrà cancellato). Procedere?`
      : `Eliminare l'etichetta "${row.name}"?`;
    if (!confirm(msg)) return;
    setBusy(true);
    if (row.used) {
      const { error } = await db.from("posts").update({ category_id: null }).eq("category_id", row.id);
      if (error) {
        setBusy(false);
        return setErr(error.message);
      }
    }
    const { error } = await db.from("categories").delete().eq("id", row.id);
    setBusy(false);
    if (error) return setErr(error.message);
    reload();
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Contenuti</p>
        <h1 className="mt-1 font-serif text-3xl italic text-primary">Etichette ({rows.length})</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Le etichette servono a raggruppare gli articoli e appaiono nei filtri della pagina Blog.
        </p>
      </header>

      <form onSubmit={create} className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nome della nuova etichetta…"
          className="w-full max-w-sm rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy || !newName.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={14} /> Crea
        </button>
      </form>

      {err && <p className="mb-4 text-sm text-destructive">{err}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Caricamento…</p>
      ) : (
        <div className="w-full max-w-full overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Etichetta</th>
                <th className="w-[30%] px-4 py-3 hidden md:table-cell">Slug</th>
                <th className="w-[90px] px-4 py-3 text-right">Articoli</th>
                <th className="w-[90px] px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {editId === c.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") rename(c.id);
                          if (e.key === "Escape") setEditId(null);
                        }}
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm outline-none focus:border-accent"
                      />
                    ) : (
                      <span className="font-serif text-base text-foreground break-words">{c.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden break-all font-mono text-xs text-muted-foreground md:table-cell">{c.slug}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-xs text-muted-foreground">{c.used}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {editId === c.id ? (
                        <>
                          <button
                            onClick={() => rename(c.id)}
                            disabled={busy}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-accent"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditId(c.id);
                              setEditName(c.name);
                            }}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => remove(c)}
                            disabled={busy}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Nessuna etichetta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
