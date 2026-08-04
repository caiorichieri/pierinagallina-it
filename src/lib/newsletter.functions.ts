import { createServerFn } from "@tanstack/react-start";

type SendInput = { token: string; subject: string; body: string; testTo?: string };

export const sendNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: SendInput) => {
    if (!d.subject?.trim()) throw new Error("Oggetto mancante.");
    if (!d.body?.trim()) throw new Error("Messaggio mancante.");
    if (d.subject.length > 200) throw new Error("Oggetto troppo lungo.");
    if (d.body.length > 50000) throw new Error("Messaggio troppo lungo.");
    return d;
  })
  .handler(async ({ data }) => {
    const { assertPierinaAdmin, fetchSubscribers, sendToRecipients } = await import(
      "./newsletter.server"
    );
    await assertPierinaAdmin(data.token);

    const test = data.testTo?.trim().toLowerCase();
    const recipients = test ? [test] : await fetchSubscribers(data.token);
    if (recipients.length === 0) throw new Error("Nessun destinatario.");

    const sent = await sendToRecipients(recipients, data.subject.trim(), data.body);
    return { sent, test: !!test };
  });
