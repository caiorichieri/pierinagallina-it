import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { db } from "@/integrations/pierina/client";
import { MapPin, Send } from "lucide-react";
import { SocialLinksRow } from "@/components/SocialLinks";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Pierina Gallina" },
      { name: "description", content: "Scrivi a Pierina Gallina per presentazioni di libri, letture nelle scuole e collaborazioni." },
      { property: "og:title", content: "Contatti — Pierina Gallina" },
    ],
  }),
  component: ContactPage,
});

type Status = "idle" | "sending" | "ok" | "err";

function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [privacy, setPrivacy] = useState(false);
  const [privacyErr, setPrivacyErr] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacy) {
      setPrivacyErr(true);
      return;
    }
    setPrivacyErr(false);
    setStatus("sending");
    try {
      const { error } = await db.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      if (error) {
        console.error(error);
        setStatus("err");
      } else {
        setStatus("ok");
        setForm({ name: "", email: "", subject: "", message: "" });
        setPrivacy(false);
      }
    } catch (err) {
      console.error(err);
      setStatus("err");
    }
  };

  const input =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title={<>Una parola, <span className="italic" style={{ color: "var(--brand-gold)" }}>e ci sentiamo.</span></>}
        intro="Per presentazioni di libri, letture nelle scuole, collaborazioni con biblioteche e case editrici."
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nome</span>
              <input required maxLength={120} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={input} />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
              <input required type="email" maxLength={255} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={input} />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Oggetto</span>
            <input maxLength={200} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className={input} />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Messaggio</span>
            <textarea required rows={7} minLength={5} maxLength={4000} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className={input + " resize-y"} />
          </label>

          <label className="flex items-start gap-2.5 text-sm text-foreground/85">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => { setPrivacy(e.target.checked); if (e.target.checked) setPrivacyErr(false); }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              required
            />
            <span>
              Ho letto e accetto la{" "}
              <Link to="/privacy" className="underline hover:text-accent">privacy policy</Link>.
            </span>
          </label>
          {privacyErr && <div className="text-sm text-destructive">Devi accettare la privacy per inviare il messaggio.</div>}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Send size={15} />
              {status === "sending" ? "Invio…" : "Invia"}
            </button>
            {status === "ok" && <span className="text-sm text-primary">Messaggio inviato, grazie!</span>}
            {status === "err" && <span className="text-sm text-destructive">Errore nell'invio. Riprova.</span>}
          </div>
        </form>

        <aside className="space-y-6 rounded-md border border-border bg-card p-6">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Dove sono</div>
            <div className="flex gap-3 text-sm text-foreground/80">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>Codroipo, Friuli‑Venezia Giulia<br />Italia</span>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">Pierina Gallina</div>
            <div className="mt-1 italic">Scrittrice, paroliera per passione</div>
          </div>
        </aside>
      </section>
    </>
  );
}
