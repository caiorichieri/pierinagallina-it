// Typed Supabase client for the pierina-archive-transfer backend.
// Uses the same VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY that
// already point to foubruudcsrbfucuavob (see .env). Types are local to
// this folder because the auto-generated src/integrations/supabase/types.ts
// is bound to the original Lovable Cloud project and cannot be edited.

import { createClient } from "@supabase/supabase-js";
import type { PierinaDatabase } from "./types";

function build() {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env for pierina client");
  return createClient<PierinaDatabase>(url, key, {
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
