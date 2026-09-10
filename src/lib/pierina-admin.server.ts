// Verifica che chi chiama sia l'amministratrice del sito.
// L'autenticazione dell'area admin vive nel backend dei contenuti
// (progetto "pierina"), quindi validiamo lì il token e il ruolo.

const PIERINA_URL = "https://muhsqviepidroymvsevd.supabase.co";
const PIERINA_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHNxdmllcGlkcm95bXZzZXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDQ0NzYsImV4cCI6MjA5NzI4MDQ3Nn0.q54hqVp0suYtSkibtCacYShhkuE_UNLJw5x0BJ6pAA0";

export async function assertPierinaAdmin(accessToken: string): Promise<string> {
  const token = (accessToken ?? "").trim();
  if (!token) throw new Error("Non autorizzato");

  const headers = {
    apikey: PIERINA_ANON_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const userRes = await fetch(`${PIERINA_URL}/auth/v1/user`, { headers });
  if (!userRes.ok) throw new Error("Non autorizzato");
  const user = (await userRes.json()) as { id?: string };
  if (!user.id) throw new Error("Non autorizzato");

  const roleRes = await fetch(`${PIERINA_URL}/rest/v1/rpc/has_role`, {
    method: "POST",
    headers,
    body: JSON.stringify({ _user_id: user.id, _role: "admin" }),
  });
  if (!roleRes.ok) throw new Error("Non autorizzato");
  const isAdmin = (await roleRes.json()) as unknown;
  if (isAdmin !== true) throw new Error("Non autorizzato");

  return user.id;
}
