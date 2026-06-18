import { createFileRoute } from "@tanstack/react-router";
import { Database } from "lucide-react";

export const Route = createFileRoute("/admin/migrazione")({ component: AdminMigrazione });

function AdminMigrazione() {
  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Strumenti</p>
        <h1 className="mt-1 font-serif text-3xl italic text-primary">Migrazione contenuti</h1>
      </header>

      <div className="rounded-md border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-md bg-secondary p-3 text-accent"><Database size={20} /></div>
          <div>
            <h2 className="font-serif text-xl text-foreground">Backend collegato</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Il sito è collegato al database <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">pierina-archive-transfer</code>.
              Tutti i contenuti — articoli, libri, fiabe, poesie, fotografie, messaggi e iscritti — sono già migrati.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Per importazioni massive da file (CSV, JSON, backup), contatta l'amministratore tecnico.
              Le operazioni di migrazione vengono eseguite direttamente sul database con script dedicati.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
        <p>Strumenti futuri: import CSV, export completo, snapshot del sito.</p>
      </div>
    </div>
  );
}
