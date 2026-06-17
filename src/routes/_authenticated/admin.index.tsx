import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Image, Newspaper } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const cards = [
    { to: "/admin/agenda", label: "Agenda", desc: "Gestisci eventi e appuntamenti.", icon: Calendar },
    { to: "/admin/news", label: "News", desc: "Pubblica articoli e aggiornamenti.", icon: Newspaper },
    { to: "/admin/gallery", label: "Galleria", desc: "Aggiungi e ordina foto.", icon: Image },
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className="group rounded-md border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent"
        >
          <c.icon size={20} className="text-accent" />
          <div className="mt-3 font-serif text-xl">{c.label}</div>
          <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
        </Link>
      ))}
    </div>
  );
}
