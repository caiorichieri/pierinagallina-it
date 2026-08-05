import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type FiabaCollection, type FiabaTrack } from "@/integrations/pierina/client";
import { Plus, Trash2, Save, ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/fiabe")({ component: AdminFiabe });

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

function AdminFiabe() {
  const [cols, setCols] = useState<FiabaCollection[]>([]);
  const [tracks, setTracks] = useState<FiabaTrack[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [editCol, setEditCol] = useState<Partial<FiabaCollection> | null>(null);
  const [editTrack, setEditTrack] = useState<Partial<FiabaTrack> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    const [c, t] = await Promise.all([
      db.from("fiabe_collections").select("*").order("sort_order"),
      db.from("fiabe_tracks").select("*").order("sort_order"),
    ]);
    if (c.error) setErr(c.error.message);
    if (t.error) setErr(t.error.message);
    setCols((c.data as FiabaCollection[]) ?? []);
    setTracks((t.data as FiabaTrack[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  async function saveCol() {
    if (!editCol) return;
    const { id, ...rest } = editCol as FiabaCollection & { id?: string };
    const payload = { ...rest, slug: rest.slug?.trim() || slugify(rest.title ?? "") };
    const op = id ? db.from("fiabe_collections").update(payload).eq("id", id) : db.from("fiabe_collections").insert(payload);
    const { error } = await op;
    if (error) return setErr(error.message);
    setEditCol(null); reload();
  }
  async function saveTrack() {
    if (!editTrack) return;
    const { id, ...payload } = editTrack as FiabaTrack & { id?: string };
    const op = id ? db.from("fiabe_tracks").update(payload).eq("id", id) : db.from("fiabe_tracks").insert(payload);
    const { error } = await op;
    if (error) return setErr(error.message);
    setEditTrack(null); reload();
  }
  async function removeCol(id: string) {
    if (!confirm("Eliminare la raccolta e tutte le tracce?")) return;
    await db.from("fiabe_tracks").delete().eq("collection_id", id);
    const { error } = await db.from("fiabe_collections").delete().eq("id", id);
    if (error) return alert(error.message);
    reload();
  }
  async function removeTrack(id: string) {
    if (!confirm("Eliminare la traccia?")) return;
    const { error } = await db.from("fiabe_tracks").delete().eq("id", id);
    if (error) return alert(error.message);
    reload();
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Audio</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Fiabe sonore</h1>
        </div>
        <button onClick={() => setEditCol({ title: "", slug: "", subtitle: "", sort_order: 0 })} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
          <Plus size={14} /> Nuova raccolta
        </button>
      </header>
      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}

      <div className="space-y-3">
        {cols.map((c) => {
          const ts = tracks.filter((t) => t.collection_id === c.id);
          const isOpen = open[c.id] ?? true;
          return (
            <div key={c.id} className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between p-4">
                <button onClick={() => setOpen({ ...open, [c.id]: !isOpen })} className="flex items-center gap-2 text-left">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <div>
                    <div className="font-serif text-lg text-primary">{c.title}</div>
                    {c.subtitle && <div className="text-xs text-muted-foreground">{c.subtitle}</div>}
                  </div>
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{ts.length}</span>
                </button>
                <div className="flex gap-1">
                  <button onClick={() => setEditTrack({ collection_id: c.id, title: "", mp3_url: "", sort_order: ts.length })} className="rounded-md border border-border px-3 py-1 text-xs hover:border-accent hover:text-accent">+ traccia</button>
                  <button onClick={() => setEditCol(c)} className="rounded-md border border-border px-3 py-1 text-xs hover:border-accent hover:text-accent">Modifica</button>
                  <button onClick={() => removeCol(c.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
              {isOpen && ts.length > 0 && (
                <ul className="border-t border-border">
                  {ts.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-serif">{t.title}</div>
                        <audio controls src={t.mp3_url} className="mt-1 h-8 w-full max-w-md" />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditTrack(t)} className="rounded-md border border-border px-3 py-1 text-xs hover:border-accent hover:text-accent">Modifica</button>
                        <button onClick={() => removeTrack(t.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {cols.length === 0 && <p className="text-sm text-muted-foreground">Nessuna raccolta.</p>}
      </div>

      {editCol && (
        <Modal onClose={() => setEditCol(null)} title={editCol.id ? "Modifica raccolta" : "Nuova raccolta"}>
          <L label="Titolo"><input value={editCol.title ?? ""} onChange={(e) => setEditCol({ ...editCol, title: e.target.value })} className={inp} /></L>
          <L label="Sottotitolo"><input value={editCol.subtitle ?? ""} onChange={(e) => setEditCol({ ...editCol, subtitle: e.target.value })} className={inp} /></L>
          <L label="Slug"><input value={editCol.slug ?? ""} placeholder={slugify(editCol.title ?? "")} onChange={(e) => setEditCol({ ...editCol, slug: e.target.value })} className={inp + " font-mono"} /></L>
          <L label="Ordine"><input type="number" value={editCol.sort_order ?? 0} onChange={(e) => setEditCol({ ...editCol, sort_order: Number(e.target.value) })} className={inp} /></L>
          <Actions onCancel={() => setEditCol(null)} onSave={saveCol} />
        </Modal>
      )}

      {editTrack && (
        <Modal onClose={() => setEditTrack(null)} title={editTrack.id ? "Modifica traccia" : "Nuova traccia"}>
          <L label="Raccolta">
            <select value={editTrack.collection_id ?? ""} onChange={(e) => setEditTrack({ ...editTrack, collection_id: e.target.value })} className={inp}>
              <option value="">—</option>
              {cols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </L>
          <L label="Titolo"><input value={editTrack.title ?? ""} onChange={(e) => setEditTrack({ ...editTrack, title: e.target.value })} className={inp} /></L>
          <ImageUpload
            label="Audio MP3"
            accept="audio/*"
            value={editTrack.mp3_url ?? ""}
            onChange={(url) => setEditTrack({ ...editTrack, mp3_url: url })}
          />
          <L label="Ordine"><input type="number" value={editTrack.sort_order ?? 0} onChange={(e) => setEditTrack({ ...editTrack, sort_order: Number(e.target.value) })} className={inp} /></L>
          <Actions onCancel={() => setEditTrack(null)} onSave={saveTrack} />
        </Modal>
      )}
    </div>
  );
}

const inp = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium uppercase tracking-wider text-foreground/70">{label}</span>{children}</label>;
}
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-xl space-y-3 overflow-y-auto rounded-lg bg-card p-6 shadow-xl">
        <h2 className="font-serif text-2xl italic text-primary">{title}</h2>
        {children}
      </div>
    </div>
  );
}
function Actions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">Annulla</button>
      <button onClick={onSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"><Save size={14} /> Salva</button>
    </div>
  );
}
