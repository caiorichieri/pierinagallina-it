import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListNews, adminUpsertNews, adminDeleteNews } from "@/lib/admin.functions";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { Field } from "./admin.agenda";
import { ImageUpload } from "@/components/ImageUpload";
import { MultiImageUpload } from "@/components/MultiImageUpload";

export const Route = createFileRoute("/_authenticated/admin/news")({
  component: AdminNews,
});

type N = {
  id: string;
  slug: string;
  title_it: string;
  title_en: string;
  excerpt_it: string;
  excerpt_en: string;
  body_it: string;
  body_en: string;
  cover_url: string | null;
  status: string;
  published_at: string;
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function AdminNews() {
  const list = useServerFn(adminListNews);
  const upsert = useServerFn(adminUpsertNews);
  const del = useServerFn(adminDeleteNews);
  const [items, setItems] = useState<N[]>([]);
  const [editing, setEditing] = useState<Partial<N> | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await list();
    setItems(r.news as N[]);
  }
  useEffect(() => { refresh(); }, []);

  async function save() {
    if (!editing) return;
    setBusy(true);
    try {
      await upsert({
        data: {
          id: editing.id,
          slug: editing.slug || slugify(editing.title_it || ""),
          title_it: editing.title_it || "",
          title_en: editing.title_en || editing.title_it || "",
          excerpt_it: editing.excerpt_it || "",
          excerpt_en: editing.excerpt_en || "",
          body_it: editing.body_it || "",
          body_en: editing.body_en || "",
          cover_url: editing.cover_url || null,
          status: editing.status || "published",
          published_at: new Date(editing.published_at || new Date()).toISOString(),
        },
      });
      setEditing(null);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminare questo articolo?")) return;
    await del({ data: { id } });
    await refresh();
  }

  function toLocal(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-serif text-xl">News ({items.length})</h2>
        <button onClick={() => setEditing({ status: "published", published_at: toLocal(new Date().toISOString()) })} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          <Plus size={13} /> Nuovo
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-4">
            <div className="min-w-0">
              <div className="text-xs font-mono uppercase text-accent">
                {new Date(n.published_at).toLocaleDateString("it-IT")} · {n.status}
              </div>
              <div className="truncate font-medium">{n.title_it}</div>
              <div className="truncate text-xs text-muted-foreground">/{n.slug}</div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => setEditing({ ...n, published_at: toLocal(n.published_at) })} className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
              <button onClick={() => remove(n.id)} className="rounded-md border border-border p-2 text-destructive"><Trash2 size={14} /></button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nessun articolo.</li>}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-10 w-full max-w-3xl rounded-md border border-border bg-background p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-lg">{editing.id ? "Modifica articolo" : "Nuovo articolo"}</h3>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="mt-4 grid gap-3">
              <Field label="Titolo (IT)" value={editing.title_it || ""} onChange={(v) => setEditing({ ...editing, title_it: v, slug: editing.slug || slugify(v) })} required />
              <Field label="Titolo (EN)" value={editing.title_en || ""} onChange={(v) => setEditing({ ...editing, title_en: v })} />
              <Field label="Slug" value={editing.slug || ""} onChange={(v) => setEditing({ ...editing, slug: slugify(v) })} required />
              <Field label="Estratto (IT)" value={editing.excerpt_it || ""} onChange={(v) => setEditing({ ...editing, excerpt_it: v })} textarea />
              <Field label="Estratto (EN)" value={editing.excerpt_en || ""} onChange={(v) => setEditing({ ...editing, excerpt_en: v })} textarea />
              <Field label="Contenuto (IT)" value={editing.body_it || ""} onChange={(v) => setEditing({ ...editing, body_it: v })} textarea />
              <MultiImageUpload
                label="Immagini da inserire (IT/EN)"
                onInsert={(token) =>
                  setEditing((prev) =>
                    prev ? { ...prev, body_it: (prev.body_it || "") + "\n\n" + token + "\n\n" } : prev,
                  )
                }
              />
              <Field label="Contenuto (EN)" value={editing.body_en || ""} onChange={(v) => setEditing({ ...editing, body_en: v })} textarea />
              <ImageUpload label="Copertina" value={editing.cover_url || ""} onChange={(v) => setEditing({ ...editing, cover_url: v })} />
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">Stato</span>
                  <select value={editing.status || "published"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <option value="published">Pubblicato</option>
                    <option value="draft">Bozza</option>
                  </select>
                </label>
                <Field label="Data pubblicazione" type="datetime-local" value={editing.published_at || ""} onChange={(v) => setEditing({ ...editing, published_at: v })} required />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">Annulla</button>
              <button onClick={save} disabled={busy || !editing.title_it} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
                {busy ? "..." : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
