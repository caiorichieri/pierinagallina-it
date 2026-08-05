import { useRef, useState } from "react";
import { useUpload } from "@/lib/use-upload";
import { Upload } from "lucide-react";

/** Carica più immagini in una volta e restituisce gli URL caricati. */
export function MultiImageUpload({
  label = "Carica immagini",
  onUploaded,
}: {
  label?: string;
  onUploaded: (urls: string[]) => void | Promise<void>;
}) {
  const upload = useUpload();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setErr(null);
    setBusy(true);
    setProgress({ done: 0, total: files.length });
    const urls: string[] = [];
    try {
      for (const file of files) {
        try {
          urls.push(await upload(file));
        } catch (e2) {
          setErr(e2 instanceof Error ? e2.message : `Errore su ${file.name}`);
        }
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }
      if (urls.length) await onUploaded(urls);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent disabled:opacity-50"
      >
        <Upload size={14} />
        {busy && progress ? `Caricamento ${progress.done}/${progress.total}…` : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}
