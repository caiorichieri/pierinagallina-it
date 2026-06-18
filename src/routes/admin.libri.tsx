import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type Book } from "@/integrations/pierina/client";
import { Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/libri")({ component: AdminLibri });

const empty: Partial<Book> = {
  title: "", year: null, price: null, description: "", buy_url: "", youtube_id: "",
  type: "", cover_url: "", sort_order: 0,
};

function AdminLibri() {
  const [items, setItems] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Partial<Book> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    const { data, error } = await db.from("books").select("*").order("sort_order");
    if (error) setErr(error.message); else setItems((data as Book[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  async function save() {
    if (!editing) return;
    const { id, ...payload } = editing as Book & { id?: string };
    const op = id
      ? db.from("books").update(payload).eq("id", id)
      : db.from("books").insert(payload);
    const { error } = await op;
    if (error) return setErr(error.message);
    setEditing(null); reload();
  }
  async function remove(id: string) {
    if (!confirm("Eliminare il libro?")) return;
    const { error } = await db.from("books").delete().eq("id", id);
    if (error) return alert(error.message);
    reload();
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Catalogo</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Libri ({items.length})</h1>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
          <Plus size={14} /> Nuovo libro
        </button>
      </header>
      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <div key={b.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex gap-3">
              {b.cover_url && <img src={b.cover_url} alt="" className="h-20 w-14 rounded object-cover" />}
              <div className="min-w-0">
                <div className="font-serif text-lg leading-tight">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.year ?? "—"} · {b.type ?? "—"}</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-1">
              <button onClick={() => setEditing(b)} className="rounded-md border border-border px-3 py-1 text-xs hover:border-accent hover:text-accent">Modifica</button>
              <button onClick={() => remove(b.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card p-6 shadow-xl">
            <h2 className="font-serif text-2xl italic text-primary">{editing.id ? "Modifica libro" : "Nuovo libro"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <L label="Titolo" full><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} /></L>
              <L label="Anno"><input type="number" value={editing.year ?? ""} onChange={(e) => setEditing({ ...editing, year: e.target.value ? Number(e.target.value) : null })} className={inp} /></L>
              <L label="Prezzo (€)"><input type="number" step="0.01" value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value ? Number(e.target.value) : null })} className={inp} /></L>
              <L label="Tipo"><input value={editing.type ?? ""} onChange={(e) => setEditing({ ...editing, type: e.target.value })} placeholder="poesia, racconti…" className={inp} /></L>
              <L label="Ordine"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} /></L>
              <L label="Copertina (URL)" full><input value={editing.cover_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_url: e.target.value })} className={inp} /></L>
              <L label="Link acquisto" full><input value={editing.buy_url ?? ""} onChange={(e) => setEditing({ ...editing, buy_url: e.target.value })} className={inp} /></L>
              <L label="YouTube ID" full><input value={editing.youtube_id ?? ""} onChange={(e) => setEditing({ ...editing, youtube_id: e.target.value })} className={inp} /></L>
              <L label="Descrizione" full><textarea rows={5} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inp} /></L>
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
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-foreground/70">{label}</span>
      {children}
    </label>
  );
}
