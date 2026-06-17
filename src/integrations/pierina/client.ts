// Untyped Supabase client pointed at pierina-archive-transfer.
// Types live next to each query in routes/lib because the auto-generated
// types.ts is bound to the original Lovable Cloud project.

import { createClient } from "@supabase/supabase-js";

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image: string | null
  published_at: string | null
  created_at: string
}

export type Book = {
  id: string
  title: string
  year: number | null
  price: number | null
  description: string | null
  buy_url: string | null
  youtube_id: string | null
  type: string | null
  cover_url: string | null
  sort_order: number
}

export type Poem = {
  id: string
  title: string
  slug: string
  content_friulian: string | null
  content_italian: string | null
  written_at: string | null
  sort_order: number
}

export type FiabaTrack = {
  id: string
  collection_id: string | null
  title: string
  mp3_url: string
  sort_order: number
}

export type GalleryPhoto = {
  id: string
  title: string | null
  image_url: string
  sort_order: number
  created_at: string
}

function build() {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env for pierina client");
  return createClient(url, key, {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _c: ReturnType<typeof build> | undefined;
export const db = new Proxy({} as ReturnType<typeof build>, {
  get(_t, p, r) {
    if (!_c) _c = build();
    return Reflect.get(_c, p, r);
  },
});
