import { useRef, useState } from "react";
import { useUpload } from "@/lib/use-upload";
import { Upload, X, Link2 } from "lucide-react";

export function ImageUpload({
  label = "Immagine",
  value,
  onChange,
  required = false,
  accept = "image/*",
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  accept?: string;
}) {
  const upload = useUpload();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAudio = accept.startsWith("audio");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      onChange(await upload(file));
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Errore upload");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="block text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
        {required && " *"}
      </span>
      <div className="mt-1 flex items-start gap-3">
        {value && !isAudio ? (
          <div className="relative shrink-0">
            <img src={value} alt="" className="h-28 w-28 rounded-md border border-border object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 text-destructive"
              title="Rimuovi"
            >
              <X size={12} />
            </button>
          </div>
        ) : !isAudio ? (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
            Nessuna
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent/10 disabled:opacity-50"
            >
              <Upload size={13} /> {busy ? "Caricamento…" : value ? "Sostituisci file" : "Carica file"}
            </button>
            <button
              type="button"
              onClick={() => setShowUrl((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-accent"
            >
              <Link2 size={12} /> URL
            </button>
            {value && isAudio && (
              <button type="button" onClick={() => onChange("")} className="text-[11px] text-destructive">
                Rimuovi
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept={accept} onChange={onFile} disabled={busy} className="hidden" />

          {showUrl && (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://…"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-accent"
            />
          )}
          {isAudio && value && <audio controls src={value} className="mt-2 h-9 w-full" />}
          {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
          {!showUrl && (
            <p className="mt-2 truncate text-[10px] text-muted-foreground">{value || "Nessun file selezionato"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
