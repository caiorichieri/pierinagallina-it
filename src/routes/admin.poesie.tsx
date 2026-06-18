import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type Poem } from "@/integrations/pierina/client";
import { Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/poesie")({ component: AdminPoesie });

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

const empty: Partial<Poem> = { title: "", slug: "", content_friulian: "", content_italian: "", written_at: null, sort_order: 0 };

function AdminPoesie() {
  const [items, setItems] = useState<Poem[]>([]);
  const [editing, setEditing] = useState<Partial<Poem> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    const { data, error } = await db.from("poems").select("*").order("sort_order");
    if (error) setErr(error.message); else setItems((data as Poem[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing as Poem & { id?: string };
    const payload = { ...rest, slug: rest.slug?.trim() || slugify(rest.title ?? "") };
    if (!payload.title) return setErr("Titolo richiesto");
    const op = id ? db.from("poems").update(payload).eq("id", id) : db.from("poems").insert(payload);
    const { error } = await op;
    if (error) return setErr(error.message);
    setEditing(null); reload();
  }
  async function remove(id: string) {
    if (!confirm("Eliminare la poesia?")) return;
    const { error } = await db.from("poems").delete().eq("id", id);
    if (error) return alert(error.message);
    reload();
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Versi</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Poesie ({items.length})</h1>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
          <Plus size={14} /> Nuova poesia
        </button>
      </header>
      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Titolo</th><th className="px-4 py-3 hidden md:table-cell">Slug</th><th className="px-4 py-3 hidden md:table-cell">Ordine</th><th className="px-4 py-3 text-right">Azioni</th></tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-serif">{p.title}</td>
                <td className="px-4 py-3 hidden font-mono text-xs text-muted-foreground md:table-cell">{p.slug}</td>
                <td className="px-4 py-3 hidden text-xs text-muted-foreground md:table-cell">{p.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="rounded-md border border-border px-3 py-1 text-xs hover:border-accent hover:text-accent">Modifica</button>
                  <button onClick={() => remove(p.id)} className="ml-1 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Nessuna poesia.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-card p-6 shadow-xl">
            <h2 className="font-serif text-2xl italic text-primary">{editing.id ? "Modifica poesia" : "Nuova poesia"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <L label="Titolo" full><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} /></L>
              <L label="Slug" full><input value={editing.slug ?? ""} placeholder={slugify(editing.title ?? "")} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inp + " font-mono"} /></L>
              <L label="Data"><input type="date" value={editing.written_at ?? ""} onChange={(e) => setEditing({ ...editing, written_at: e.target.value || null })} className={inp} /></L>
              <L label="Ordine"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} /></L>
              <L label="Furlan" full><textarea rows={10} value={editing.content_friulian ?? ""} onChange={(e) => setEditing({ ...editing, content_friulian: e.target.value })} className={inp + " font-serif"} /></L>
              <L label="Italiano" full><textarea rows={10} value={editing.content_italian ?? ""} onChange={(e) => setEditing({ ...editing, content_italian: e.target.value })} className={inp + " font-serif"} /></L>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">Annulla</button>
              <button onClick={save} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"><Save size={14} /> Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "sm:col-span-2" : ""}><span className="mb-1 block text-xs font-medium uppercase tracking-wider text-foreground/70">{label}</span>{children}</label>;
}
