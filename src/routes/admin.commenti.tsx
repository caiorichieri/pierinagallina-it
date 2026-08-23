import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Trash2, Undo2 } from "lucide-react";
import { db } from "@/integrations/pierina/client";
import {
  listCommentsAdmin,
  setCommentApproved,
  deleteComment,
  type AdminComment,
} from "@/lib/comments.functions";

export const Route = createFileRoute("/admin/commenti")({ component: AdminCommenti });

async function token(): Promise<string> {
  const { data } = await db.auth.getSession();
  return data.session?.access_token ?? "";
}

function AdminCommenti() {
  const [items, setItems] = useState<AdminComment[]>([]);
  const [filter, setFilter] = useState<"attesa" | "approvati">("attesa");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCommentsAdmin({ data: { token: await token() } });
      setItems(res.comments);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function approve(id: string, approved: boolean) {
    try {
      await setCommentApproved({ data: { token: await token(), id, approved } });
      void reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore");
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminare il commento?")) return;
    try {
      await deleteComment({ data: { token: await token(), id } });
      void reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore");
    }
  }

  const pending = items.filter((c) => !c.approved);
  const approved = items.filter((c) => c.approved);
  const list = filter === "attesa" ? pending : approved;

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Lettori</p>
        <h1 className="mt-1 font-serif text-3xl italic text-primary">Commenti</h1>
      </header>

      <div className="mb-5 flex gap-2">
        {(["attesa", "approvati"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {f === "attesa" ? `In attesa (${pending.length})` : `Approvati (${approved.length})`}
          </button>
        ))}
      </div>

      {err && <p className="mb-3 text-sm text-destructive">{err}</p>}
      {loading && <p className="text-sm text-muted-foreground">Caricamento…</p>}

      <div className="space-y-4">
        {list.map((c) => (
          <div key={c.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="font-serif text-lg">{c.author_name}</span>
                {c.author_email && <span className="ml-2 text-xs text-muted-foreground">{c.author_email}</span>}
                <div className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleString("it-IT")} · su{" "}
                  <a href={`/blog/${c.post_slug}`} className="text-accent underline">
                    {c.post_title ?? c.post_slug}
                  </a>
                </div>
              </div>
              <div className="flex gap-1">
                {c.approved ? (
                  <button
                    onClick={() => approve(c.id, false)}
                    title="Rimetti in attesa"
                    className="rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Undo2 size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => approve(c.id, true)}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                  >
                    <Check size={14} /> Approva
                  </button>
                )}
                <button
                  onClick={() => remove(c.id)}
                  className="rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap font-serif text-base leading-relaxed text-foreground/90">{c.body}</p>
          </div>
        ))}
        {!loading && list.length === 0 && (
          <p className="rounded-md border border-border bg-card px-4 py-10 text-center text-muted-foreground">
            Nessun commento {filter === "attesa" ? "in attesa" : "approvato"}.
          </p>
        )}
      </div>
    </div>
  );
}
