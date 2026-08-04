import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { sendNewsletter } from "@/lib/newsletter.functions";
import { SITE_URL } from "@/lib/newsletter-config";
import { Trash2, Download, Upload, Mail, Copy, Check, Send } from "lucide-react";

type Sub = { id: string; email: string; created_at: string; confirmed?: boolean | null };
type Post = { id: string; title: string; slug: string; excerpt: string | null };

export const Route = createFileRoute("/admin/newsletter")({ component: AdminNewsletter });


function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function AdminNewsletter() {
  const [items, setItems] = useState<Sub[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postId, setPostId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState<"bcc" | "body" | null>(null);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<string | null>(null);
  const [testTo, setTestTo] = useState("");


  async function reload() {
    const { data, error } = await db.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(2000);
    if (error) setErr(error.message); else setItems((data as Sub[]) ?? []);
  }
  useEffect(() => { reload(); }, []);

  useEffect(() => {
    db.from("posts")
      .select("id,title,slug,excerpt")
      .order("published_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        const list = (data as Post[]) ?? [];
        setPosts(list);
        // se arrivo da "Invia newsletter" su un articolo, precompilo tutto
        const wanted = new URLSearchParams(window.location.search).get("post");
        if (wanted) {
          const p = list.find((x) => x.id === wanted);
          if (p) fill(p);
        }
      });
  }, []);

  function fill(p: Post) {
    setPostId(p.id);
    setSubject(`Novità dal sito di Pierina Gallina — ${p.title}`);
    setBody(
      `Cara lettrice, caro lettore,\n\n` +
        `ho pubblicato un nuovo scritto: «${p.title}».\n\n` +
        (p.excerpt ? `${stripHtml(p.excerpt)}\n\n` : "") +
        `Puoi leggerlo qui:\n${SITE_URL}/blog/${p.slug}\n\n` +
        `Grazie di cuore per il tempo che mi dedichi.\nPierina Gallina\n\n` +
        `—\nRicevi questa email perché ti sei iscritto/a alla newsletter del sito. ` +
        `Per non riceverla più, rispondi a questo messaggio scrivendo "cancellami".`,
    );
  }

  function pickPost(id: string) {
    setPostId(id);
    const p = posts.find((x) => x.id === id);
    if (p) fill(p);
  }


  const bcc = items.map((i) => i.email).join(", ");

  async function copy(text: string, what: "bcc" | "body") {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  }

  function openMailClient() {
    const href = `mailto:?bcc=${encodeURIComponent(items.map((i) => i.email).join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }


  async function remove(id: string) {
    if (!confirm("Rimuovere l'iscritto?")) return;
    setErr(null);
    const { data, error } = await db
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) {
      setErr(`Impossibile rimuovere: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) {
      setErr(
        "L'iscritto non è stato rimosso: il database non consente la cancellazione con questo accesso. Serve una regola di eliminazione per gli amministratori sulla tabella degli iscritti.",
      );
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function exportCsv() {
    const csv = ["email,created_at", ...items.map((i) => `${i.email},${i.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function parseEmails(text: string): string[] {
    const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const matches = text.match(emailRe) ?? [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const m of matches) {
      const e = m.trim().toLowerCase();
      if (!seen.has(e)) { seen.add(e); out.push(e); }
    }
    return out;
  }

  async function handleImport(file: File) {
    setImporting(true);
    setImportMsg(null);
    try {
      const text = await file.text();
      const emails = parseEmails(text);
      if (emails.length === 0) {
        setImportMsg("Nessuna email valida trovata nel file.");
        return;
      }
      const existing = new Set(items.map((i) => i.email.toLowerCase()));
      const toInsert = emails.filter((e) => !existing.has(e));
      if (toInsert.length === 0) {
        setImportMsg(`Tutte le ${emails.length} email sono già iscritte.`);
        return;
      }
      const rows = toInsert.map((email) => ({ email }));
      // chunk inserts to avoid payload limits
      let inserted = 0;
      const chunkSize = 500;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const { error } = await db.from("newsletter_subscribers").insert(chunk);
        if (error) throw error;
        inserted += chunk.length;
      }
      setImportMsg(`Importate ${inserted} nuove email (${emails.length - toInsert.length} già presenti).`);
      reload();
    } catch (e: any) {
      setImportMsg(`Errore: ${e.message ?? e}`);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Lista</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">Newsletter ({items.length})</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent disabled:opacity-50"
          >
            <Upload size={14} /> {importing ? "Importazione…" : "Importa CSV"}
          </button>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent">
            <Download size={14} /> Esporta CSV
          </button>
        </div>
      </header>

      <section className="mb-8 rounded-md border border-border bg-card p-4">
        <h2 className="font-serif text-xl italic text-primary">Invia una newsletter</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Prepara il messaggio qui, poi aprilo nel tuo programma di posta: l'email parte dal tuo indirizzo,
          con tutti gli iscritti in copia nascosta (Ccn), così nessuno vede gli indirizzi degli altri.
        </p>

        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Parti da un articolo (facoltativo)</span>
            <select
              value={postId}
              onChange={(e) => pickPost(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">— Scrivi da zero —</option>
              {posts.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Oggetto</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Novità dal sito di Pierina Gallina"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Messaggio</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="Cara lettrice, caro lettore…"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={openMailClient}
            disabled={items.length === 0 || !subject}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Mail size={14} /> Apri nel mio programma email ({items.length} iscritti)
          </button>
          <button
            onClick={() => copy(bcc, "bcc")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
          >
            {copied === "bcc" ? <Check size={14} /> : <Copy size={14} />} Copia indirizzi (Ccn)
          </button>
          <button
            onClick={() => copy(body, "body")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
          >
            {copied === "body" ? <Check size={14} /> : <Copy size={14} />} Copia testo
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Se il programma di posta non si apre (succede con liste lunghe), usa «Copia indirizzi (Ccn)» e
          «Copia testo» e incollali in una nuova email dal tuo Gmail/Outlook. Metti sempre gli indirizzi in
          <strong> Ccn</strong>, mai in «A».
        </p>
      </section>



      {importMsg && (
        <div className="mb-3 rounded-md border border-border bg-card px-3 py-2 text-sm">{importMsg}</div>
      )}
      <p className="mb-3 text-xs text-muted-foreground">
        Accetta file .csv o .txt: una email per riga o separate da virgole. I duplicati vengono ignorati.
      </p>
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
