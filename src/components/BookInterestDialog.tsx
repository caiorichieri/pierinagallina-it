import { useEffect, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { Send, X } from "lucide-react";

type Status = "idle" | "sending" | "ok" | "err";

export function BookInterestDialog({
  bookTitle,
  open,
  onClose,
}: {
  bookTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setForm({
        name: "",
        email: "",
        message: `Sono interessato/a al libro "${bookTitle}". Vorrei ricevere informazioni su come acquistarlo.`,
      });
    }
  }, [open, bookTitle]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await db.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: `Interesse libro: ${bookTitle}`,
      message: form.message.trim(),
    });
    if (error) {
      console.error(error);
      setStatus("err");
    } else {
      setStatus("ok");
    }
  };

  const input =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-lg bg-card p-6 shadow-xl sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X size={18} />
        </button>

        <p className="text-xs uppercase tracking-widest text-muted-foreground">Richiesta informazioni</p>
        <h2 className="mt-1 font-serif text-2xl italic text-primary">{bookTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Lascia i tuoi recapiti: Pierina ti risponderà con i dettagli per ricevere il libro.
        </p>

        {status === "ok" ? (
          <div className="mt-6 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
            Grazie! La tua richiesta è stata inviata. Ti risponderemo al più presto.
            <div className="mt-4 text-right">
              <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:border-accent">
                Chiudi
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nome</span>
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={input}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
              <input
                required
                type="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={input}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Messaggio</span>
              <textarea
                required
                rows={5}
                minLength={5}
                maxLength={4000}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={input + " resize-y"}
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-1">
              {status === "err" ? (
                <span className="text-sm text-destructive">Errore nell'invio. Riprova.</span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send size={14} />
                {status === "sending" ? "Invio…" : "Invia richiesta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
