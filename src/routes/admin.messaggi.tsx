import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { Trash2, Mail } from "lucide-react";

type Msg = { id: string; name: string; email: string; subject: string | null; message: string; created_at: string };

export const Route = createFileRoute("/admin/messaggi")({ component: AdminMessaggi });

function AdminMessaggi() {
  const [items, setItems] = useState<Msg[]>([]);
  const [open, setOpen] = useState<Msg | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    const { data, error } = await db.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) setErr(error.message); else setItems((data as Msg[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  async function remove(id: string) {
    if (!confirm("Eliminare il messaggio?")) return;
    const { error } = await db.from("contact_messages").delete().eq("id", id);
    if (error) return alert(error.message);
    if (open?.id === id) setOpen(null);
    reload();
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Casella</p>
        <h1 className="mt-1 font-serif text-3xl italic text-primary">Messaggi ({items.length})</h1>
      </header>
      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Data</th><th className="px-4 py-3">Da</th><th className="px-4 py-3">Oggetto</th><th className="px-4 py-3 text-right">Azioni</th></tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="cursor-pointer border-t border-border hover:bg-secondary/30" onClick={() => setOpen(m)}>
                <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{new Date(m.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="px-4 py-3"><div className="font-serif">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></td>
                <td className="px-4 py-3">{m.subject ?? <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <a href={`mailto:${m.email}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Mail size={14} /></a>
                  <button onClick={() => remove(m.id)} className="ml-1 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Nessun messaggio.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card p-6 shadow-xl">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{new Date(open.created_at).toLocaleString("it-IT")}</div>
            <h2 className="mt-1 font-serif text-2xl italic text-primary">{open.subject ?? "(senza oggetto)"}</h2>
            <p className="mt-2 text-sm"><strong>{open.name}</strong> · <a href={`mailto:${open.email}`} className="text-accent underline">{open.email}</a></p>
            <pre className="mt-4 whitespace-pre-wrap font-serif text-base leading-relaxed text-foreground/90">{open.message}</pre>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(null)} className="rounded-md border border-border px-4 py-2 text-sm">Chiudi</button>
              <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject ?? "")}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"><Mail size={14} /> Rispondi</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
