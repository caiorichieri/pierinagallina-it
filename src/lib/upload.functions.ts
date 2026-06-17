import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type UploadInput = {
  filename: string;
  contentType: string;
  dataBase64: string;
};

// 10 years (in seconds) for signed URL
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: UploadInput) => d)
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const bytes = Buffer.from(data.dataBase64, "base64");

    const { error: upErr } = await supabaseAdmin.storage
      .from("media")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("media")
      .createSignedUrl(path, TEN_YEARS);
    if (signErr) throw new Error(signErr.message);

    return { url: signed.signedUrl, path };
  });
