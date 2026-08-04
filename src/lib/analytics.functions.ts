import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const PIERINA_URL = "https://foubruudcsrbfucuavob.supabase.co";
const PIERINA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdWJydXVkY3NyYmZ1Y3Vhdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjY4NTYsImV4cCI6MjA5MDc0Mjg1Nn0.Dz21-VyUZHQ2Vk29U4SQP0Img9CJoln_12s4D2DLfvw";

const trackSchema = z.object({
  path: z.string().trim().min(1).max(300),
  postSlug: z.string().trim().max(300).nullable().optional(),
  postTitle: z.string().trim().max(300).nullable().optional(),
  referrer: z.string().trim().max(500).nullable().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).nullable().optional(),
  sessionId: z.string().trim().max(64).nullable().optional(),
});

function publishableClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((input) => trackSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publishableClient()
      .from("page_visits")
      .insert({
        path: data.path,
        post_slug: data.postSlug ?? null,
        post_title: data.postTitle ?? null,
        referrer: data.referrer ?? null,
        device: data.device ?? null,
        session_id: data.sessionId ?? null,
      });
    if (error) {
      console.error("page_visits insert failed", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });

/** Verifies the caller holds an admin session on the content project. */
async function assertAdmin(token: string) {
  const userRes = await fetch(`${PIERINA_URL}/auth/v1/user`, {
    headers: { apikey: PIERINA_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) throw new Error("unauthorized");
  const user = (await userRes.json()) as { id?: string };
  if (!user.id) throw new Error("unauthorized");

  const roleRes = await fetch(`${PIERINA_URL}/rest/v1/rpc/has_role`, {
    method: "POST",
    headers: {
      apikey: PIERINA_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _user_id: user.id, _role: "admin" }),
  });
  if (!roleRes.ok) throw new Error("forbidden");
  const isAdmin = (await roleRes.json()) as unknown;
  if (isAdmin !== true) throw new Error("forbidden");
  return user.id;
}

type VisitRow = {
  path: string;
  post_slug: string | null;
  post_title: string | null;
  referrer: string | null;
  device: string | null;
  session_id: string | null;
  created_at: string;
};

const statsSchema = z.object({ token: z.string().min(10).max(4000) });

export const getVisitStats = createServerFn({ method: "POST" })
  .inputValidator((input) => statsSchema.parse(input))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);

    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data: rows, error } = await supabaseAdmin
      .from("page_visits")
      .select("path, post_slug, post_title, referrer, device, session_id, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(50000);

    if (error) {
      console.error("page_visits read failed", error.message);
      throw new Error("read_failed");
    }

    const visits = ((rows ?? []) as VisitRow[]).filter((r) => !r.path.startsWith("/admin"));
    const now = Date.now();
    const dayMs = 24 * 3600 * 1000;

    const inWindow = (days: number) =>
      visits.filter((v) => now - new Date(v.created_at).getTime() <= days * dayMs);

    const summarize = (list: VisitRow[]) => ({
      visits: list.length,
      visitors: new Set(list.map((v) => v.session_id ?? v.created_at)).size,
    });

    const todayKey = new Date().toISOString().slice(0, 10);
    const today = visits.filter((v) => v.created_at.slice(0, 10) === todayKey);

    // daily series, last 30 days
    const byDay = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      byDay.set(new Date(now - i * dayMs).toISOString().slice(0, 10), 0);
    }
    for (const v of visits) {
      const k = v.created_at.slice(0, 10);
      if (byDay.has(k)) byDay.set(k, (byDay.get(k) ?? 0) + 1);
    }

    const tally = (list: VisitRow[], pick: (v: VisitRow) => string | null) => {
      const m = new Map<string, number>();
      for (const v of list) {
        const k = pick(v);
        if (!k) continue;
        m.set(k, (m.get(k) ?? 0) + 1);
      }
      return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count }));
    };

    const last30 = inWindow(30);
    const last7 = inWindow(7);

    const postTitles = new Map<string, string>();
    for (const v of visits) if (v.post_slug && v.post_title) postTitles.set(v.post_slug, v.post_title);

    const postsTally = (list: VisitRow[]) =>
      tally(list, (v) => v.post_slug).map((r) => ({
        slug: r.key,
        title: postTitles.get(r.key) ?? r.key,
        count: r.count,
      }));

    return {
      today: summarize(today),
      last7: summarize(last7),
      last30: summarize(last30),
      daily: [...byDay.entries()].map(([date, count]) => ({ date, count })),
      topPages: tally(last30, (v) => v.path).slice(0, 12),
      referrers: tally(last30, (v) =>
        v.referrer ? (() => { try { return new URL(v.referrer!).hostname; } catch { return v.referrer; } })() : "Diretto",
      ).slice(0, 10),
      devices: tally(last30, (v) => v.device ?? "sconosciuto"),
      postsLast7: postsTally(last7).slice(0, 50),
      postsLast30: postsTally(last30).slice(0, 200),
    };
  });
