import { createServerFn } from "@tanstack/react-start";

type UploadInput = {
  token: string;
  filename: string;
  contentType: string;
  dataBase64: string;
};

// 10 years (in seconds) for signed URL
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
const MAX_BYTES = 15 * 1024 * 1024;

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((d: UploadInput) => {
    if (!d.token) throw new Error("Sessione mancante: rifai il login.");
    if (!d.filename) throw new Error("File mancante.");
    if (!d.dataBase64) throw new Error("File vuoto.");
    // base64 → bytes ≈ len * 3/4
    if (d.dataBase64.length * 0.75 > MAX_BYTES) throw new Error("File troppo grande (max 15MB).");
    return d;
  })
  .handler(async ({ data }) => {
    const { assertPierinaAdmin } = await import("./newsletter.server");
    await assertPierinaAdmin(data.token);

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
