import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().min(10).max(4000) });

const moderateSchema = tokenSchema.extend({
  id: z.string().uuid(),
  approved: z.boolean(),
});

const deleteSchema = tokenSchema.extend({ id: z.string().uuid() });

const notifySchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().max(255).optional().or(z.literal("")),
  postTitle: z.string().trim().max(300),
  postSlug: z.string().trim().max(300),
  body: z.string().trim().min(1).max(2000),
});

export type AdminComment = {
  id: string;
  post_slug: string;
  post_title: string | null;
  author_name: string;
  author_email: string | null;
  body: string;
  approved: boolean;
  created_at: string;
};

/** Elenco completo dei commenti (in attesa + approvati) per il pannello admin. */
export const listCommentsAdmin = createServerFn({ method: "POST" })
  .inputValidator((input) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { assertPierinaAdmin } = await import("./pierina-admin.server");
    await assertPierinaAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("post_comments")
      .select("id,post_slug,post_title,author_name,author_email,body,approved,created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { comments: (rows ?? []) as AdminComment[] };
  });

/** Approva o rimette in attesa un commento. */
export const setCommentApproved = createServerFn({ method: "POST" })
  .inputValidator((input) => moderateSchema.parse(input))
  .handler(async ({ data }) => {
    const { assertPierinaAdmin } = await import("./pierina-admin.server");
    await assertPierinaAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("post_comments")
      .update({ approved: data.approved })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Elimina definitivamente un commento. */
export const deleteComment = createServerFn({ method: "POST" })
  .inputValidator((input) => deleteSchema.parse(input))
  .handler(async ({ data }) => {
    const { assertPierinaAdmin } = await import("./pierina-admin.server");
    await assertPierinaAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("post_comments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Avvisa Pierina via email che c'è un nuovo commento da approvare. */
export const notifyNewComment = createServerFn({ method: "POST" })
  .inputValidator((input) => notifySchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const { sendContactNotification } = await import("./contact-mail.server");
      await sendContactNotification({
        name: data.name,
        email: data.email || "commento@pierinagallina.it",
        subject: `Nuovo commento da approvare — ${data.postTitle}`,
        message: `${data.body}\n\nArticolo: https://www.pierinagallina.it/blog/${data.postSlug}\nApprovalo in: https://www.pierinagallina.it/admin/commenti`,
      });
      return { ok: true as const, sent: true as const };
    } catch (e) {
      console.error("[commenti] notifica email fallita", e);
      return { ok: true as const, sent: false as const };
    }
  });
