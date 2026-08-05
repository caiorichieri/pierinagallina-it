import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from "./newsletter-config";

const GATEWAY = "https://connector-gateway.lovable.dev/resend";

/** Indirizzo che riceve la notifica di ogni nuovo messaggio dal sito. */
export const CONTACT_NOTIFY_TO = NEWSLETTER_REPLY_TO;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Msg = { name: string; email: string; subject?: string | null; message: string };

function buildHtml(m: Msg) {
  const body = esc(m.message)
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#2b2b2b;">${p.replace(/\n/g, "<br/>")}</p>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#9a8a76;">Nuovo messaggio dal sito</p>
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:normal;font-style:italic;color:#6b1f2a;">${esc(m.subject || "Senza oggetto")}</h1>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px;color:#5b4b3a;">
      <tr><td style="padding:4px 0;width:80px;">Nome</td><td style="padding:4px 0;color:#2b2b2b;">${esc(m.name)}</td></tr>
      <tr><td style="padding:4px 0;">Email</td><td style="padding:4px 0;"><a href="mailto:${esc(m.email)}" style="color:#6b1f2a;">${esc(m.email)}</a></td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #e6d9c8;margin:0 0 20px;"/>
    ${body}
    <hr style="border:none;border-top:1px solid #e6d9c8;margin:24px 0 12px;"/>
    <p style="margin:0;font-size:12px;color:#9a8a76;">Rispondendo a questa email scrivi direttamente a ${esc(m.email)}.</p>
  </div>
</body></html>`;
}

export async function sendContactNotification(m: Msg) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) throw new Error("Connessione Resend non configurata.");

  const text = `Nuovo messaggio dal sito\n\nNome: ${m.name}\nEmail: ${m.email}\nOggetto: ${m.subject || "—"}\n\n${m.message}`;

  const res = await fetch(`${GATEWAY}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from: NEWSLETTER_FROM,
      to: [CONTACT_NOTIFY_TO],
      subject: `Nuovo messaggio dal sito — ${m.subject || m.name}`,
      html: buildHtml(m),
      text,
      reply_to: m.email,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ha rifiutato l'invio [${res.status}]: ${body}`);
  }
}
