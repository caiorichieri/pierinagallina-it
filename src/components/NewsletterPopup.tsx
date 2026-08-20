import { useEffect, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { X, Send, Feather, Stamp } from "lucide-react";
import { trackNewsletterIntent } from "@/lib/ga4-events";

const KEY = "pg_newsletter_popup";
const DELAY_MS = 18000;
const SNOOZE_DAYS = 30;

function shouldShow(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return true;
    const v = JSON.parse(raw) as { until?: number; done?: boolean };
    if (v.done) return false;
    return !v.until || Date.now() > v.until;
  } catch {
    return true;
  }
}

function remember(done: boolean) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ done, until: Date.now() + SNOOZE_DAYS * 864e5 }),
    );
  } catch {
    /* ignore */
  }
}

type Status = "idle" | "sending" | "ok" | "err";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;
    if (!shouldShow()) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      setOpen(true);
      trackNewsletterIntent("popup_cartolina");
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h > 0.45) fire();
    };
    const timer = window.setTimeout(fire, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close(subscribed: boolean) {
    remember(subscribed);
    setOpen(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const mail = email.trim().toLowerCase();
    if (!mail.includes("@")) return;
    setStatus("sending");
    const { error } = await db.from("contact_messages").insert({
      name: name.trim() || mail,
      email: mail,
      message:
        `[NEWSLETTER] Richiesta di iscrizione alla newsletter dal sito.\n` +
        `Nome: ${name.trim() || "—"}\nEmail: ${mail}`,
    });
    if (error) {
      console.error(error);
      setStatus("err");
      return;
    }
    trackNewsletterIntent("popup_cartolina_inviata");
    setStatus("ok");
    remember(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
      onClick={() => close(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Iscriviti alla newsletter di Pierina Gallina"
      style={{ perspective: "1400px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="postcard-pop relative w-full max-w-xl overflow-hidden rounded-sm bg-card shadow-2xl"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 0% 0%, color-mix(in oklab, hsl(var(--accent)) 8%, transparent), transparent 60%)",
          border: "1px solid color-mix(in oklab, hsl(var(--primary)) 25%, transparent)",
        }}
      >
        {/* bordo cartolina aerea */}
        <div className="pointer-events-none absolute inset-0 p-[6px]">
          <div
            className="h-full w-full rounded-sm"
            style={{
              border: "8px solid transparent",
              borderImage:
                "repeating-linear-gradient(45deg, #6b1f2a 0 10px, #f4f5f0 10px 20px, #1e3a5f 20px 30px) 8",
              opacity: 0.5,
            }}
          />
        </div>

        <button
          onClick={() => close(false)}
          aria-label="Chiudi"
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="relative grid gap-6 p-7 sm:grid-cols-[1.15fr_1fr] sm:p-9">
          {/* lato sinistro: il messaggio scritto a mano */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Cartolina da Codroipo
            </p>
            <h2 className="mt-2 font-serif text-3xl italic leading-tight text-primary">
              Ti scrivo,<br />ogni tanto.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Poche righe, quando esce un nuovo scritto, una fiaba sonora o un libro.
              Nessuna fretta, nessuna pubblicità: solo parole.
            </p>
            <p className="mt-4 font-serif text-lg italic text-accent">Pierina Gallina</p>
            <div className="mt-1 h-px w-24 bg-accent/40" />
          </div>

          {/* lato destro: francobollo + form */}
          <div className="relative sm:border-l sm:border-dashed sm:border-primary/25 sm:pl-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div
                className="flex h-16 w-14 flex-col items-center justify-center rounded-[2px] text-primary-foreground"
                style={{
                  background: "hsl(var(--primary))",
                  outline: "2px dashed color-mix(in oklab, hsl(var(--primary)) 35%, transparent)",
                  outlineOffset: "3px",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,.25))",
                }}
              >

                <Feather size={18} />
                <span className="mt-1 font-mono text-[8px] uppercase tracking-widest opacity-80">
                  Friuli
                </span>
              </div>
              <Stamp size={34} className="mt-1 shrink-0 rotate-[-14deg] text-accent/45" />
            </div>

            {status === "ok" ? (
              <div className="rounded-sm border border-accent/30 bg-accent/5 p-4 text-sm">
                <p className="font-serif text-lg italic text-primary">Grazie di cuore!</p>
                <p className="mt-1 text-muted-foreground">
                  La tua cartolina è partita: ti scriverò presto.
                </p>
                <button
                  onClick={() => close(true)}
                  className="mt-4 rounded-full border border-border px-4 py-2 text-xs hover:border-accent hover:text-accent"
                >
                  Chiudi
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Il tuo nome
                  </span>
                  <input
                    value={name}
                    maxLength={120}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border-0 border-b border-primary/25 bg-transparent px-0 py-1.5 font-serif text-base italic text-foreground outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    La tua email
                  </span>
                  <input
                    required
                    type="email"
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full border-0 border-b border-primary/25 bg-transparent px-0 py-1.5 font-serif text-base italic text-foreground outline-none focus:border-accent"
                  />
                </label>

                {status === "err" && (
                  <p className="text-xs text-destructive">
                    Non è stato possibile inviare. Riprova tra poco.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  <Send size={14} />
                  {status === "sending" ? "Invio…" : "Spedisci la cartolina"}
                </button>
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="w-full text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
                >
                  Non ora
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
