import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { Trash2, Download } from "lucide-react";

type Sub = { id: string; email: string; created_at: string; confirmed?: boolean | null };

export const Route = createFileRoute("/admin/newsletter")({ component: AdminNewsletter });

function AdminNewsletter() {
  const [items, setItems] = useState<Sub[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    const { data, error } = await db.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(2000);
    if (error) setErr(error.message); else setItems((data as Sub[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  async function remove(id: string) {
    if (!confirm("Rimuovere l'iscritto?")) return;
    const { error } = await db.from("newsletter_subscribers").delete().eq("id", id);
    if (error) return alert(error.message);
    reload();
  }

  function exportCsv() {
    const csv = ["email,created_at", ...items.map((i) => `${i.email},${i.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Lista</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Newsletter ({items.length})</h1>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent">
          <Download size={14} /> Esporta CSV
        </button>
      </header>
      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3 hidden md:table-cell">Iscritto il</th><th className="px-4 py-3 text-right">Azioni</th></tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-3"><a href={`mailto:${s.email}`} className="hover:text-accent">{s.email}</a></td>
                <td className="px-4 py-3 hidden text-xs text-muted-foreground md:table-cell">{new Date(s.created_at).toLocaleDateString("it-IT")}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(s.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">Nessun iscritto.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
