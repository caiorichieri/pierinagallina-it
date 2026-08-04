import { useEffect, useState } from "react";
import { db } from "@/integrations/pierina/client";
import { getVisitStats } from "@/lib/analytics.functions";

export type VisitStats = Awaited<ReturnType<typeof getVisitStats>>;

export function useVisitStats() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await db.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error("Sessione non trovata");
        const res = await getVisitStats({ data: { token } });
        if (alive) setStats(res);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Errore");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { stats, error, loading };
}

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl text-foreground tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}


function List({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-serif text-lg italic text-primary">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm">
        {rows.length === 0 && <li className="text-xs text-muted-foreground">Nessun dato ancora.</li>}
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline justify-between gap-3">
            <span className="truncate text-foreground/85">{r.label}</span>
            <span className="tabular-nums text-muted-foreground">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VisitsPanel() {
  const { stats, error, loading } = useVisitStats();

  if (loading) return <p className="text-sm text-muted-foreground">Caricamento statistiche…</p>;
  if (error || !stats)
    return (
      <p className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
        Statistiche non disponibili: {error}
      </p>
    );

  const total30 = stats.last30.visits;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Oggi" value={stats.today.visits} sub={`${stats.today.visitors} visitatori`} />
        <Stat label="Ultimi 7 giorni" value={stats.last7.visits} sub={`${stats.last7.visitors} visitatori`} />
        <Stat label="Ultimi 30 giorni" value={total30} sub={`${stats.last30.visitors} visitatori`} />
        <Stat
          label="Media giornaliera"
          value={Math.round((total30 / 30) * 10) / 10}
          sub="ultimi 30 giorni"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <List title="Pagine più viste" rows={stats.topPages.map((p) => ({ label: p.key, count: p.count }))} />
        <List title="Provenienza" rows={stats.referrers.map((p) => ({ label: p.key, count: p.count }))} />
        <List title="Dispositivi" rows={stats.devices.map((p) => ({ label: p.key, count: p.count }))} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-serif text-lg italic text-primary">Articoli più letti (30 giorni)</h3>
        <ul className="mt-3 space-y-1.5 text-sm">
          {stats.postsLast30.length === 0 && (
            <li className="text-xs text-muted-foreground">Nessuna lettura registrata ancora.</li>
          )}
          {stats.postsLast30.slice(0, 15).map((p) => (
            <li key={p.slug} className="flex items-baseline justify-between gap-3">
              <a href={`/blog/${p.slug}`} className="truncate text-foreground/85 hover:text-accent">
                {p.title}
              </a>
              <span className="tabular-nums text-muted-foreground">{p.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        Le visite vengono registrate in forma anonima (nessun dato personale, nessun cookie di tracciamento);
        sono escluse l'area riservata, le anteprime di sviluppo e i bot. Le riletture della stessa pagina
        entro 30 minuti contano una volta sola, quindi i numeri sono più bassi (e più realistici) di altri
        contatori. I dati partono dal giorno in cui è stato attivato questo conteggio: lo storico del sito
        precedente non è incluso.
      </p>
    </div>
  );
}
