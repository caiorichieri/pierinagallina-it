import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyNewComment } from "@/lib/comments.functions";

type PublicComment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

const LIMIT_KEY = "pg-last-comment";
const LIMIT_MS = 60_000;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

export function PostComments({ postSlug, postTitle }: { postSlug: string; postTitle: string }) {
  const [items, setItems] = useState<PublicComment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [trap, setTrap] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("post_comments_public")
      .select("id,author_name,body,created_at")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: true })
      .limit(300)
      .then(({ data }) => {
        if (alive) setItems((data as PublicComment[] | null) ?? []);
      });
    return () => {
      alive = false;
    };
  }, [postSlug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (trap.trim()) return; // campo trappola: solo i bot lo compilano
    const clean = body.trim().replace(/<[^>]*>/g, "");
    if (name.trim().length < 2) return setErr("Scrivi il tuo nome.");
    if (clean.length < 2) return setErr("Scrivi il tuo commento.");
    if (clean.length > 2000) return setErr("Il commento è troppo lungo (max 2000 caratteri).");
    if (/https?:\/\/|www\./i.test(clean)) return setErr("Per sicurezza i commenti non possono contenere link.");

    const last = Number(localStorage.getItem(LIMIT_KEY) ?? 0);
    if (Date.now() - last < LIMIT_MS) return setErr("Hai appena inviato un commento: riprova tra un minuto.");

    setSending(true);
    const { error } = await supabase.from("post_comments").insert({
      post_slug: postSlug,
      post_title: postTitle.slice(0, 300),
      author_name: name.trim().slice(0, 80),
      author_email: email.trim() ? email.trim().slice(0, 255) : null,
      body: clean,
      approved: false,
    });
    setSending(false);

    if (error) return setErr("Non è stato possibile inviare il commento. Riprova più tardi.");

    localStorage.setItem(LIMIT_KEY, String(Date.now()));
    setDone(true);
    setName("");
    setEmail("");
    setBody("");
    void notifyNewComment({
      data: { name: name.trim(), email: email.trim(), postTitle, postSlug, body: clean },
    }).catch(() => {});
  }

  return (
    <section className="border-t border-border pt-10">
      <h2 className="flex items-center gap-2 font-serif text-2xl italic text-primary">
        <MessageCircle size={18} /> Commenti {items.length > 0 && <span className="not-italic text-base text-muted-foreground">({items.length})</span>}
      </h2>

      {items.length > 0 && (
        <ul className="mt-6 space-y-5">
          {items.map((c) => (
            <li key={c.id} className="rounded-md border border-border bg-card px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-lg text-foreground">{c.author_name}</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap font-serif text-base leading-relaxed text-foreground/90">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      {done ? (
        <p className="mt-6 rounded-md border border-accent/40 bg-accent/10 px-5 py-4 font-serif text-base text-foreground">
          Grazie! Il tuo commento è stato inviato e comparirà dopo l&apos;approvazione di Pierina.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-8 rounded-md border border-border bg-card p-5">
          <p className="font-serif text-lg italic text-primary">Lascia un commento</p>
          <p className="mt-1 text-xs text-muted-foreground">
            I commenti vengono pubblicati dopo l&apos;approvazione. L&apos;email non viene mai mostrata.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="Il tuo nome"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              type="email"
              placeholder="Email (facoltativa, non pubblicata)"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          {/* campo trappola anti-spam: invisibile ai lettori */}
          <input
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Il tuo commento…"
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />

          {err && <p className="mt-2 text-sm text-destructive">{err}</p>}

          <button
            type="submit"
            disabled={sending}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Send size={14} /> {sending ? "Invio…" : "Invia commento"}
          </button>
        </form>
      )}
    </section>
  );
}
