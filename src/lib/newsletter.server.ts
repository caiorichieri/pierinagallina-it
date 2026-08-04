/**
 * Helper server-only per l'invio della newsletter tramite Resend
 * (attraverso il gateway dei connettori Lovable).
 */
import process from "node:process";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from "./newsletter-config";

const PIERINA_URL = "https://foubruudcsrbfucuavob.supabase.co";
const PIERINA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdWJydXVkY3NyYmZ1Y3Vhdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjY4NTYsImV4cCI6MjA5MDc0Mjg1Nn0.Dz21-VyUZHQ2Vk29U4SQP0Img9CJoln_12s4D2DLfvw";

const GATEWAY = "https://connector-gateway.lovable.dev/resend";

function authHeaders(token: string) {
  return { apikey: PIERINA_ANON_KEY, Authorization: `Bearer ${token}` };
}

/** Verifica che il token appartenga a un utente con ruolo admin. */
export async function assertPierinaAdmin(token: string): Promise<string> {
  if (!token) throw new Error("Sessione mancante: rifai il login.");
  const userRes = await fetch(`${PIERINA_URL}/auth/v1/user`, { headers: authHeaders(token) });
  if (!userRes.ok) throw new Error("Sessione non valida: rifai il login.");
  const user = (await userRes.json()) as { id?: string };
  if (!user.id) throw new Error("Sessione non valida: rifai il login.");

  const roleRes = await fetch(`${PIERINA_URL}/rest/v1/rpc/has_role`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ _user_id: user.id, _role: "admin" }),
  });
  const isAdmin = roleRes.ok && (await roleRes.json()) === true;
  if (!isAdmin) throw new Error("Accesso riservato agli amministratori.");
  return user.id;
}

export async function fetchSubscribers(token: string): Promise<string[]> {
  const res = await fetch(
    `${PIERINA_URL}/rest/v1/newsletter_subscribers?select=email&limit=5000`,
    { headers: authHeaders(token) },
  );
  if (!res.ok) throw new Error(`Impossibile leggere gli iscritti (${res.status}).`);
  const rows = (await res.json()) as Array<{ email?: string }>;
  const seen = new Set<string>();
  for (const r of rows) {
    const e = (r.email ?? "").trim().toLowerCase();
    if (e.includes("@")) seen.add(e);
  }
  return [...seen];
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Converte il testo semplice del pannello in un HTML sobrio e leggibile. */
export function buildHtml(bodyText: string, subject: string): string {
  const paragraphs = bodyText
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.7;color:#3a2a26;">${esc(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:normal;font-style:italic;color:#6b1f2a;">${esc(subject)}</h1>
    <hr style="border:none;border-top:1px solid #e6d9c8;margin:16px 0 24px;"/>
    ${paragraphs}
  </div>
</body></html>`;
}

type BatchItem = { from: string; to: string[]; subject: string; html: string; text: string; reply_to?: string };

async function postBatch(items: BatchItem[]) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) throw new Error("Connessione Resend non configurata.");

  const res = await fetch(`${GATEWAY}/emails/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify(items),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ha rifiutato l'invio [${res.status}]: ${body}`);
  }
}

/** Invia la stessa email a ogni destinatario, separatamente, in blocchi da 100. */
export async function sendToRecipients(recipients: string[], subject: string, bodyText: string) {
  const html = buildHtml(bodyText, subject);
  let sent = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    await postBatch(
      chunk.map((to) => ({
        from: NEWSLETTER_FROM,
        to: [to],
        subject,
        html,
        text: bodyText,
        reply_to: NEWSLETTER_REPLY_TO,
      })),
    );
    sent += chunk.length;
  }
  return sent;
}
