import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { trackContactSubmit } from "@/lib/ga4-events";
import { useServerFn } from "@tanstack/react-start";
import { notifyNewContactMessage } from "@/lib/contact-notify.functions";
import { ContattiHero } from "@/components/ContattiHero";
import { db } from "@/integrations/pierina/client";
import { MapPin, Send } from "lucide-react";
import { SocialLinksRow } from "@/components/SocialLinks";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Pierina Gallina" },
      { name: "description", content: "Scrivi a Pierina Gallina per presentazioni di libri, letture nelle scuole e collaborazioni." },
      { property: "og:title", content: "Contatti — Pierina Gallina" },
      { property: "og:description", content: "Scrivi a Pierina Gallina per presentazioni di libri, letture nelle scuole, laboratori e collaborazioni in Friuli." },
      { name: "twitter:description", content: "Scrivi a Pierina Gallina per presentazioni di libri, letture nelle scuole, laboratori e collaborazioni in Friuli." },
      { property: "og:url", content: "https://www.pierinagallina.it/contatti" },
    ],
    links: [{ rel: "canonical", href: "https://www.pierinagallina.it/contatti" }],
  }),

  component: ContactPage,
});

type Status = "idle" | "sending" | "ok" | "ok-no-mail" | "err";

function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const notify = useServerFn(notifyNewContactMessage);
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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      };
      const { error } = await db.from("contact_messages").insert(payload);
      if (error) {
        console.error(error);
        setStatus("err");
      } else {
        // Avvisa Pierina via email (non blocca l'esito del form)
        const notifyResult = await notify({ data: { ...payload, subject: payload.subject ?? "" } }).catch(
          (e) => {
            console.error("notifica email", e);
            return { ok: false, sent: false } as const;
          },
        );
        trackContactSubmit(payload.subject ?? undefined);
        setStatus(notifyResult.ok && notifyResult.sent ? "ok" : "ok-no-mail");
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
      <ContattiHero />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} className="paper-card space-y-4 p-6 sm:p-8">

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
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Send
                size={15}
                className={`transition-transform duration-300 ${
                  status === "sending"
                    ? "-translate-y-1 translate-x-1.5 opacity-70"
                    : "group-hover:-translate-y-0.5 group-hover:translate-x-1"
                }`}
              />
              {status === "sending" ? "Invio…" : "Invia"}
            </button>
            {status === "ok" && <span className="animate-in fade-in text-sm text-primary">Messaggio inviato, grazie!</span>}
            {status === "ok-no-mail" && (
              <span className="animate-in fade-in text-sm text-amber-600">Messaggio salvato, ma l'avviso email non è partito (dominio in attesa di verifica).</span>
            )}
            {status === "err" && <span className="animate-in fade-in text-sm text-destructive">Errore nell'invio. Riprova.</span>}
          </div>
        </form>

        <aside className="surface-bordeaux h-fit space-y-6 rounded-md p-6 text-primary-foreground">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--brand-gold)" }}>Dove sono</div>
            <div className="flex gap-3 text-sm text-primary-foreground/85">
              <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--brand-gold)" }} />
              <span>Codroipo, Friuli‑Venezia Giulia<br />Italia</span>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--brand-gold)" }}>Social</div>
            <SocialLinksRow variant="dark" />
          </div>
          <div className="border-t border-primary-foreground/20 pt-6 text-sm text-primary-foreground/75">
            <div className="font-medium text-primary-foreground">Pierina Gallina</div>
            <div className="mt-1 italic">Scrittrice, paroliera per passione</div>
          </div>
        </aside>

      </section>
    </>
  );
}
