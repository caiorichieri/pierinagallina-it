import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "../integrations/supabase/client.server";

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("id, title_it, title_en, description_it, description_en, location, url, cover_url, starts_at, ends_at")
    .order("starts_at", { ascending: true });
  if (error) return { events: [], error: error.message };
  return { events: data ?? [], error: null };
});

export const getNewsList = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("id, slug, title_it, title_en, excerpt_it, excerpt_en, cover_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) return { news: [], error: error.message };
  return { news: data ?? [], error: null };
});

export const getNewsBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("news")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) return { news: null, error: error.message };
    return { news: row, error: null };
  });

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("gallery_photos")
    .select("id, url, caption_it, caption_en, taken_at, sort_order, album_id")
    .order("sort_order", { ascending: true });
  if (error) return { photos: [], error: error.message };
  return { photos: data ?? [], error: null };
});

export const getAlbums = createServerFn({ method: "GET" }).handler(async () => {
  const { data: albums, error } = await supabaseAdmin
    .from("gallery_albums")
    .select("id, slug, title_it, title_en, description_it, description_en, cover_url, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { albums: [], counts: {} as Record<string, number>, uncategorized: 0, error: error.message };
  const { data: photos } = await supabaseAdmin.from("gallery_photos").select("album_id");
  const counts: Record<string, number> = {};
  let uncategorized = 0;
  for (const p of photos ?? []) {
    if (p.album_id) counts[p.album_id] = (counts[p.album_id] ?? 0) + 1;
    else uncategorized++;
  }
  return { albums: albums ?? [], counts, uncategorized, error: null };
});

export const getAlbumBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    if (data.slug === "_uncategorized") {
      const { data: photos, error } = await supabaseAdmin
        .from("gallery_photos")
        .select("id, url, caption_it, caption_en, taken_at, sort_order")
        .is("album_id", null)
        .order("sort_order", { ascending: true });
      if (error) return { album: null, photos: [], error: error.message };
      return {
        album: { id: "_uncategorized", slug: "_uncategorized", title_it: "Senza album", title_en: "Uncategorized", description_it: "", description_en: "", cover_url: null },
        photos: photos ?? [],
        error: null,
      };
    }
    const { data: album, error: ae } = await supabaseAdmin
      .from("gallery_albums")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (ae) return { album: null, photos: [], error: ae.message };
    if (!album) return { album: null, photos: [], error: null };
    const { data: photos, error: pe } = await supabaseAdmin
      .from("gallery_photos")
      .select("id, url, caption_it, caption_en, taken_at, sort_order")
      .eq("album_id", album.id)
      .order("sort_order", { ascending: true });
    if (pe) return { album, photos: [], error: pe.message };
    return { album, photos: photos ?? [], error: null };
  });
