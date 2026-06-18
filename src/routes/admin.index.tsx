import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { FileText, BookOpen, Headphones, Feather, Image as ImageIcon, Mail, Send } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const TILES = [
  { to: "/admin/posts", label: "Articoli", table: "posts", icon: FileText },
  { to: "/admin/libri", label: "Libri", table: "books", icon: BookOpen },
  { to: "/admin/fiabe", label: "Fiabe sonore", table: "fiabe_tracks", icon: Headphones },
  { to: "/admin/poesie", label: "Poesie", table: "poems", icon: Feather },
  { to: "/admin/fotografie", label: "Fotografie", table: "gallery_photos", icon: ImageIcon },
  { to: "/admin/messaggi", label: "Messaggi", table: "contact_messages", icon: Mail },
  { to: "/admin/newsletter", label: "Iscritti newsletter", table: "newsletter_subscribers", icon: Send },
] as const;

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    (async () => {
      const out: Record<string, number | null> = {};
      await Promise.all(
        TILES.map(async (t) => {
          const { count } = await db.from(t.table).select("*", { count: "exact", head: true });
          out[t.table] = count ?? null;
        }),
      );
      setCounts(out);
    })();
  }, []);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Pannello</p>
        <h1 className="mt-1 font-serif text-4xl italic text-primary">Buongiorno, Pierina</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Da qui gestisci articoli, libri, fiabe, poesie, fotografie, messaggi e iscritti alla newsletter.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ to, label, table, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <Icon size={20} className="text-accent" />
              <span className="font-serif text-3xl text-foreground tabular-nums">
                {counts[table] ?? "—"}
              </span>
            </div>
            <div className="mt-4 font-serif text-lg text-foreground">{label}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground group-hover:text-accent">
              Apri →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
