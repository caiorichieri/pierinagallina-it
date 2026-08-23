import { createFileRoute, Outlet, Link, useRouter, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { usePierinaAuth } from "@/integrations/pierina/auth";
import { db } from "@/integrations/pierina/client";
import { FileText, BookOpen, Headphones, Feather, Image as ImageIcon, Mail, Send, LogOut, LayoutDashboard, Tags, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Pierina Gallina" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "Articoli", icon: FileText },
  { to: "/admin/etichette", label: "Etichette", icon: Tags },
  { to: "/admin/libri", label: "Libri", icon: BookOpen },
  { to: "/admin/fiabe", label: "Fiabe sonore", icon: Headphones },
  { to: "/admin/poesie", label: "Poesie", icon: Feather },
  { to: "/admin/fotografie", label: "Fotografie", icon: ImageIcon },
  { to: "/admin/commenti", label: "Commenti", icon: MessageCircle },
  { to: "/admin/messaggi", label: "Messaggi", icon: Mail },
  { to: "/admin/newsletter", label: "Newsletter", icon: Send },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading } = usePierinaAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Caricamento…</div>;
  }

  if (!user) return <LoginCard />;
  if (!isAdmin) return <NotAuthorized email={user.email} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 md:grid-cols-[240px_1fr]">
        <aside className="border-b border-border bg-card md:min-h-screen md:border-b-0 md:border-r">
          <div className="p-5">
            <div className="font-serif text-xl italic text-primary">Pierina · admin</div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{user.email}</div>
          </div>
          <nav className="px-2 pb-6">
            {NAV.map((n) => (
              <AdminNavLink key={n.to} to={n.to} label={n.label} Icon={n.icon} exact={"exact" in n && n.exact} />
            ))}
          </nav>
          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={() => db.auth.signOut()}
              className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut size={14} /> Esci
            </button>
          </div>
        </aside>
        <main className="min-h-screen min-w-0 overflow-x-hidden p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ to, label, Icon, exact }: { to: string; label: string; Icon: React.ComponentType<{ size?: number }>; exact?: boolean }) {
  const loc = useLocation();
  const active = exact ? loc.pathname === to : loc.pathname === to || loc.pathname.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={[
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary hover:text-foreground",
      ].join(" ")}
    >
      <Icon size={15} />
      <span>{label}</span>
    </Link>
  );
}

function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await db.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
    else router.invalidate();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="font-serif text-2xl italic text-primary">Area riservata</h1>
        <p className="mt-1 text-xs text-muted-foreground">Accesso amministrazione · pierinagallina.it</p>
        <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-foreground/70">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-foreground/70">Password</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
        <button
          type="submit" disabled={busy}
          className="mt-5 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Accesso…" : "Entra"}
        </button>
      </form>
    </div>
  );
}

function NotAuthorized({ email }: { email: string | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center">
      <h1 className="font-serif text-2xl italic text-primary">Accesso negato</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        L'utente <strong>{email}</strong> non ha il ruolo <code>admin</code>. Contatta l'amministratore del sito.
      </p>
      <button
        type="button"
        onClick={() => db.auth.signOut()}
        className="mt-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
      >
        Esci
      </button>
    </div>
  );
}
