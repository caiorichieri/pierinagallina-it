import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";
import { submitContact } from "../lib/contact.functions";
import { MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Piergiorgio Iacuzzo" },
      {
        name: "description",
        content: "Scrivi a Piergiorgio Iacuzzo, ASD Atletica 2000 e Codroipo C'è.",
      },
      { property: "og:title", content: "Contatti — Piergiorgio Iacuzzo" },
      { property: "og:description", content: "Scrivi a Piergiorgio Iacuzzo, ASD Atletica 2000 e Codroipo C'è." },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/contatti" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/contatti" }],
  }),
  component: ContactPage,
});


type Status = "idle" | "sending" | "ok" | "err";

function ContactPage() {
  const { t } = useT();
  const send = useServerFn(submitContact);
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
      const r = await send({ data: form });
      if (r.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", subject: "", message: "" });
        setPrivacy(false);
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  };

  const input =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <>
      <PageHero
        eyebrow={t("contact_tag")}
        title={t("contact_title")}
        intro={t("contact_intro")}
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("contact_name")}
              </span>
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={input}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("contact_email")}
              </span>
              <input
                required
                type="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={input}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("contact_subject")}
            </span>
            <input
              maxLength={200}
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              className={input}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("contact_message")}
            </span>
            <textarea
              required
              rows={7}
              minLength={5}
              maxLength={4000}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={input + " resize-y"}
            />
          </label>

          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            {t("contact_titolare_note")}
          </div>

          <label className="flex items-start gap-2.5 text-sm text-foreground/85">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => {
                setPrivacy(e.target.checked);
                if (e.target.checked) setPrivacyErr(false);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              required
            />
            <span>
              {t("contact_privacy_label")}
              <Link to="/privacy" className="underline hover:text-accent">
                {t("contact_privacy_link")}
              </Link>
              {t("contact_privacy_label_2")}
            </span>
          </label>
          {privacyErr && (
            <div className="text-sm text-destructive">{t("contact_privacy_required")}</div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Send size={15} />
              {status === "sending" ? t("contact_sending") : t("contact_send")}
            </button>
            {status === "ok" && (
              <span className="text-sm text-primary">{t("contact_ok")}</span>
            )}
            {status === "err" && (
              <span className="text-sm text-destructive">{t("contact_err")}</span>
            )}
          </div>
        </form>

        <aside className="space-y-6 rounded-md border border-border bg-card p-6">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {t("contact_address_label")}
            </div>
            <div className="flex gap-3 text-sm text-foreground/80">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>{t("contact_address")}</span>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">ASD Atletica 2000</div>
            <div className="mt-1">Polisportivo comunale</div>
            <div>Codroipo (UD), Italia</div>
          </div>
        </aside>
      </section>
    </>
  );
}
