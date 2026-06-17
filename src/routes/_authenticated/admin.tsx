import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminMe } from "@/lib/admin.functions";
import { LogOut, Image, Calendar, Newspaper, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Piergiorgio Iacuzzo" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "forbidden">("loading");
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    adminMe()
      .then((res) => setStatus(res.isAdmin ? "ok" : "forbidden"))
      .catch(() => setStatus("forbidden"));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (status === "loading") {
    return <div className="p-10 text-center text-sm text-muted-foreground">Verifica accesso…</div>;
  }
  if (status === "forbidden") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-2xl">Accesso negato</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Il tuo account non ha i permessi di amministratore. Contatta il proprietario del sito.
        </p>
        <button onClick={signOut} className="mt-6 text-sm text-primary hover:text-accent">
          Esci e riprova
        </button>
      </div>
    );
  }

  const tabs = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/agenda", label: "Agenda", icon: Calendar, exact: false },
    { to: "/admin/news", label: "News", icon: Newspaper, exact: false },
    { to: "/admin/gallery", label: "Galleria", icon: Image, exact: false },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <h1 className="font-serif text-2xl">Admin</h1>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut size={13} /> Esci
        </button>
      </div>
      <nav className="mt-4 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={
                "inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors " +
                (active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              <t.icon size={14} /> {t.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
