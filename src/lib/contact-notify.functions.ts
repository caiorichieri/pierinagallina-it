import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
});

/**
 * Avvisa Pierina via email quando qualcuno lascia un messaggio dal sito.
 * Il messaggio è già stato salvato nel database dal form.
 */
export const notifyNewContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const { sendContactNotification } = await import("./contact-mail.server");
    try {
      await sendContactNotification({
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
      });
      return { ok: true as const };
    } catch (e) {
      console.error("[contact] notifica email fallita", e);
      return { ok: false as const };
    }
  });
