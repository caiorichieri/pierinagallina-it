// Untyped Supabase client pointed at the project's Lovable Cloud backend.
// It reuses the same auth session as the main integration so that admin
// routes can read and write the content tables (posts, books, poems, etc.)
// that were migrated from the old pierina-archive-transfer project.

import { createClient } from "@supabase/supabase-js";
import { brokeredPreviewStorage } from "@/integrations/supabase/previewAuthStorage";

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image: string | null
  published_at: string | null
  created_at: string
  category_id?: string | null
}

export type Category = {
  id: string
  name: string
  slug: string
  post_count: number | null
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

export type FiabaCollection = {
  id: string
  title: string
  subtitle: string | null
  slug: string
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

// Use the current project's Lovable Cloud backend. The anon key is the
// browser publishable key and is safe to ship to the client.
const PIERINA_URL = "https://muhsqviepidroymvsevd.supabase.co";
const PIERINA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHNxdmllcGlkcm95bXZzZXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDQ0NzYsImV4cCI6MjA5NzI4MDQ3Nn0.q54hqVp0suYtSkibtCacYShhkuE_UNLJw5x0BJ6pAA0";

function build() {
  return createClient(PIERINA_URL, PIERINA_ANON_KEY, {
    auth: {
      storage: brokeredPreviewStorage(),
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
