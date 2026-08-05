import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type GalleryPhoto } from "@/integrations/pierina/client";
import { Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/fotografie")({ component: AdminFoto });

function AdminFoto() {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  const [editing, setEditing] = useState<Partial<GalleryPhoto> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    const { data, error } = await db.from("gallery_photos").select("*").order("sort_order");
    if (error) setErr(error.message); else setItems((data as GalleryPhoto[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  async function save() {
    if (!editing) return;
    const { id, created_at, ...payload } = editing as GalleryPhoto & { id?: string };
    if (!payload.image_url) return setErr("URL immagine richiesto");
    const op = id ? db.from("gallery_photos").update(payload).eq("id", id) : db.from("gallery_photos").insert(payload);
    const { error } = await op;
    if (error) return setErr(error.message);
    setEditing(null); reload();
  }
  async function remove(id: string) {
    if (!confirm("Eliminare la fotografia?")) return;
    const { error } = await db.from("gallery_photos").delete().eq("id", id);
    if (error) return alert(error.message);
    reload();
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Galleria</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Fotografie ({items.length})</h1>
        </div>
        <button onClick={() => setEditing({ title: "", image_url: "", sort_order: items.length })} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
          <Plus size={14} /> Nuova foto
        </button>
      </header>
      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-md border border-border bg-card">
            <img src={g.image_url} alt={g.title ?? ""} className="aspect-square w-full object-cover" />
            <div className="p-2">
              <div className="truncate text-xs">{g.title ?? "(senza titolo)"}</div>
              <div className="text-[10px] text-muted-foreground">ord. {g.sort_order}</div>
            </div>
            <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => setEditing(g)} className="rounded-md bg-card/90 px-2 py-1 text-xs">Edit</button>
              <button onClick={() => remove(g.id)} className="rounded-md bg-destructive/90 p-1 text-destructive-foreground"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg space-y-3 rounded-lg bg-card p-6 shadow-xl">
            <h2 className="font-serif text-2xl italic text-primary">{editing.id ? "Modifica foto" : "Nuova foto"}</h2>
            <ImageUpload
              label="Immagine"
              required
              value={editing.image_url ?? ""}
              onChange={(url) => setEditing({ ...editing, image_url: url })}
            />
            <L label="Titolo"><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} /></L>
            <L label="Ordine"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} /></L>
            <div className="flex justify-end gap-2 pt-2">
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
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium uppercase tracking-wider text-foreground/70">{label}</span>{children}</label>;
}
