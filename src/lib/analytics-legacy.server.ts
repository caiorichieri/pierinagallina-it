/**
 * Reads the visit history of the previous site (table `site_visits` on the
 * content database). Column names differ between versions, so the rows are
 * normalised defensively and any failure is ignored — the legacy history is a
 * bonus, never a reason to break the dashboard.
 */
const PIERINA_URL = "https://foubruudcsrbfucuavob.supabase.co";
const PIERINA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdWJydXVkY3NyYmZ1Y3Vhdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjY4NTYsImV4cCI6MjA5MDc0Mjg1Nn0.Dz21-VyUZHQ2Vk29U4SQP0Img9CJoln_12s4D2DLfvw";

export type NormalisedVisit = {
  path: string;
  post_slug: string | null;
  post_title: string | null;
  referrer: string | null;
  device: string | null;
  session_id: string | null;
  created_at: string;
};

type LooseRow = Record<string, unknown>;

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : null;

export async function fetchLegacyVisits(token: string, sinceIso: string): Promise<NormalisedVisit[]> {
  try {
    const res = await fetch(
      `${PIERINA_URL}/rest/v1/site_visits?select=*&order=created_at.desc&limit=50000`,
      { headers: { apikey: PIERINA_ANON_KEY, Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as LooseRow[];
    if (!Array.isArray(rows)) return [];

    const sinceMs = new Date(sinceIso).getTime();
    const out: NormalisedVisit[] = [];
    for (const r of rows) {
      const created =
        str(r["created_at"]) ?? str(r["visited_at"]) ?? str(r["inserted_at"]) ?? str(r["date"]);
      if (!created) continue;
      const t = new Date(created).getTime();
      if (!Number.isFinite(t) || t < sinceMs) continue;

      const path = str(r["path"]) ?? str(r["page_path"]) ?? str(r["page"]) ?? str(r["url"]);
      if (!path) continue;

      out.push({
        path: path.startsWith("http") ? new URL(path).pathname : path,
        post_slug: str(r["post_slug"]) ?? str(r["slug"]),
        post_title: str(r["post_title"]) ?? str(r["title"]),
        referrer: str(r["referrer"]) ?? str(r["referer"]),
        device: str(r["device"]) ?? str(r["device_type"]),
        session_id: str(r["session_id"]) ?? str(r["visitor_id"]),
        created_at: new Date(t).toISOString(),
      });
    }
    return out;
  } catch {
    return [];
  }
}
