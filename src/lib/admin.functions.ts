import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { userId: context.userId, isAdmin: !!data };
  });

/* ------------------ EVENTS ------------------ */

export const adminListEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { events: data ?? [] };
  });

type EventInput = {
  id?: string;
  title_it: string;
  title_en: string;
  description_it?: string;
  description_en?: string;
  starts_at: string;
  ends_at?: string | null;
  location?: string | null;
  url?: string | null;
  cover_url?: string | null;
};

export const adminUpsertEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: EventInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      title_it: data.title_it,
      title_en: data.title_en,
      description_it: data.description_it ?? "",
      description_en: data.description_en ?? "",
      starts_at: data.starts_at,
      ends_at: data.ends_at || null,
      location: data.location || null,
      url: data.url || null,
      cover_url: data.cover_url || null,
    };
    const q = data.id
      ? supabaseAdmin.from("events").update(payload).eq("id", data.id)
      : supabaseAdmin.from("events").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("events").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------ NEWS ------------------ */

export const adminListNews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { news: data ?? [] };
  });

type NewsInput = {
  id?: string;
  slug: string;
  title_it: string;
  title_en: string;
  excerpt_it?: string;
  excerpt_en?: string;
  body_it?: string;
  body_en?: string;
  cover_url?: string | null;
  status: string;
  published_at: string;
};

export const adminUpsertNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: NewsInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.slug,
      title_it: data.title_it,
      title_en: data.title_en,
      excerpt_it: data.excerpt_it ?? "",
      excerpt_en: data.excerpt_en ?? "",
      body_it: data.body_it ?? "",
      body_en: data.body_en ?? "",
      cover_url: data.cover_url || null,
      status: data.status,
      published_at: data.published_at,
    };
    const q = data.id
      ? supabaseAdmin.from("news").update(payload).eq("id", data.id)
      : supabaseAdmin.from("news").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("news").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------ GALLERY ------------------ */

export const adminListGallery = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { photos: data ?? [] };
  });

type PhotoInput = {
  id?: string;
  url: string;
  caption_it?: string;
  caption_en?: string;
  taken_at?: string | null;
  sort_order?: number;
  album_id?: string | null;
};

export const adminUpsertPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: PhotoInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      url: data.url,
      caption_it: data.caption_it ?? "",
      caption_en: data.caption_en ?? "",
      taken_at: data.taken_at || null,
      sort_order: data.sort_order ?? 0,
      album_id: data.album_id || null,
    };
    const q = data.id
      ? supabaseAdmin.from("gallery_photos").update(payload).eq("id", data.id)
      : supabaseAdmin.from("gallery_photos").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("gallery_photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------ ALBUMS ------------------ */

export const adminListAlbums = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("gallery_albums")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { albums: data ?? [] };
  });

type AlbumInput = {
  id?: string;
  slug: string;
  title_it: string;
  title_en?: string;
  description_it?: string;
  description_en?: string;
  cover_url?: string | null;
  sort_order?: number;
};

export const adminUpsertAlbum = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: AlbumInput) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.slug,
      title_it: data.title_it,
      title_en: data.title_en ?? "",
      description_it: data.description_it ?? "",
      description_en: data.description_en ?? "",
      cover_url: data.cover_url || null,
      sort_order: data.sort_order ?? 0,
    };
    const q = data.id
      ? supabaseAdmin.from("gallery_albums").update(payload).eq("id", data.id)
      : supabaseAdmin.from("gallery_albums").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteAlbum = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("gallery_albums").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
