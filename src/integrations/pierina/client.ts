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

// Hardcoded — Lovable Cloud manages .env for the default project, so we
// cannot rely on VITE_SUPABASE_* here. These point at the pierina-archive-transfer
// project (anon/publishable key is safe to ship to the browser).
const PIERINA_URL = "https://foubruudcsrbfucuavob.supabase.co";
const PIERINA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdWJydXVkY3NyYmZ1Y3Vhdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjY4NTYsImV4cCI6MjA5MDc0Mjg1Nn0.Dz21-VyUZHQ2Vk29U4SQP0Img9CJoln_12s4D2DLfvw";

function build() {
  return createClient(PIERINA_URL, PIERINA_ANON_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "sb-pierina-auth",
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
