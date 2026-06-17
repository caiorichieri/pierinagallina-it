import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListEvents, adminUpsertEvent, adminDeleteEvent } from "@/lib/admin.functions";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/_authenticated/admin/agenda")({
  component: AdminAgenda,
});

type Ev = {
  id: string;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  url: string | null;
  cover_url: string | null;
};

const empty: Partial<Ev> = {
  title_it: "",
  title_en: "",
  description_it: "",
  description_en: "",
  starts_at: "",
  ends_at: "",
  location: "",
  url: "",
  cover_url: "",
};

function AdminAgenda() {
  const list = useServerFn(adminListEvents);
  const upsert = useServerFn(adminUpsertEvent);
  const del = useServerFn(adminDeleteEvent);
  const [items, setItems] = useState<Ev[]>([]);
  const [editing, setEditing] = useState<Partial<Ev> | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await list();
    setItems(r.events as Ev[]);
  }
  useEffect(() => { refresh(); }, []);

  async function save() {
    if (!editing) return;
    setBusy(true);
    try {
      await upsert({
        data: {
          id: editing.id,
          title_it: editing.title_it || "",
          title_en: editing.title_en || editing.title_it || "",
          description_it: editing.description_it || "",
          description_en: editing.description_en || "",
          starts_at: new Date(editing.starts_at!).toISOString(),
          ends_at: editing.ends_at ? new Date(editing.ends_at).toISOString() : null,
          location: editing.location || null,
          url: editing.url || null,
          cover_url: editing.cover_url || null,
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
    if (!confirm("Eliminare questo evento?")) return;
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
        <h2 className="font-serif text-xl">Eventi ({items.length})</h2>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          <Plus size={13} /> Nuovo
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-4">
            <div className="min-w-0">
              <div className="text-xs font-mono uppercase text-accent">{new Date(e.starts_at).toLocaleString("it-IT")}</div>
              <div className="truncate font-medium">{e.title_it}</div>
              {e.location && <div className="text-xs text-muted-foreground">{e.location}</div>}
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => setEditing({ ...e, starts_at: toLocal(e.starts_at), ends_at: e.ends_at ? toLocal(e.ends_at) : "" })} className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
              <button onClick={() => remove(e.id)} className="rounded-md border border-border p-2 text-destructive"><Trash2 size={14} /></button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nessun evento.</li>}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-10 w-full max-w-2xl rounded-md border border-border bg-background p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-lg">{editing.id ? "Modifica evento" : "Nuovo evento"}</h3>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="mt-4 grid gap-3">
              <Field label="Titolo (IT)" value={editing.title_it || ""} onChange={(v) => setEditing({ ...editing, title_it: v })} required />
              <Field label="Titolo (EN)" value={editing.title_en || ""} onChange={(v) => setEditing({ ...editing, title_en: v })} />
              <Field label="Descrizione (IT)" value={editing.description_it || ""} onChange={(v) => setEditing({ ...editing, description_it: v })} textarea />
              <Field label="Descrizione (EN)" value={editing.description_en || ""} onChange={(v) => setEditing({ ...editing, description_en: v })} textarea />
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Inizio" type="datetime-local" value={editing.starts_at || ""} onChange={(v) => setEditing({ ...editing, starts_at: v })} required />
                <Field label="Fine" type="datetime-local" value={editing.ends_at || ""} onChange={(v) => setEditing({ ...editing, ends_at: v })} />
              </div>
              <Field label="Luogo" value={editing.location || ""} onChange={(v) => setEditing({ ...editing, location: v })} />
              <Field label="URL" value={editing.url || ""} onChange={(v) => setEditing({ ...editing, url: v })} />
              <ImageUpload label="Copertina evento (opzionale)" value={editing.cover_url || ""} onChange={(v) => setEditing({ ...editing, cover_url: v })} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">Annulla</button>
              <button onClick={save} disabled={busy || !editing.title_it || !editing.starts_at} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
                {busy ? "..." : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Field({ label, value, onChange, type = "text", textarea = false, required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}{required && " *"}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      )}
    </label>
  );
}
