import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { uploadMedia } from "@/lib/upload.functions";
import { Upload, Copy, Check } from "lucide-react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      resolve(r.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload multiple images at once. For each uploaded image gives a `[[img:URL]]`
 * token that can be pasted into the article body to render the image inline.
 */
export function MultiImageUpload({
  label = "Immagini nel corpo",
  onInsert,
}: {
  label?: string;
  onInsert?: (token: string) => void;
}) {
  const upload = useServerFn(uploadMedia);
  const [urls, setUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setErr(null);
    setBusy(true);
    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          setErr(`File troppo grande (max 10MB): ${file.name}`);
          continue;
        }
        const b64 = await fileToBase64(file);
        const res = await upload({
          data: {
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            dataBase64: b64,
          },
        });
        setUrls((prev) => [...prev, res.url]);
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Errore upload");
    } finally {
      setBusy(false);
    }
  }

  function copy(token: string) {
    navigator.clipboard.writeText(token).catch(() => {});
    setCopied(token);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="rounded-md border border-dashed border-border bg-card/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Carica più immagini, poi copia il token <code className="rounded bg-muted px-1">[[img:URL]]</code> e incollalo nel corpo dove vuoi che appaia la foto.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent/10">
          <Upload size={13} /> {busy ? "Caricamento…" : "Carica immagini"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFiles}
            disabled={busy}
            className="hidden"
          />
        </label>
      </div>
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
      {urls.length > 0 && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {urls.map((u, i) => {
            const token = `[[img:${u}]]`;
            const isCopied = copied === token;
            return (
              <li
                key={i}
                className="flex items-center gap-2 rounded-md border border-border bg-background p-2"
              >
                <img
                  src={u}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[10px] font-mono text-muted-foreground">
                    {u}
                  </div>
                  <div className="mt-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => copy(token)}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] hover:bg-accent/10"
                    >
                      {isCopied ? <Check size={10} /> : <Copy size={10} />}
                      {isCopied ? "Copiato" : "Copia token"}
                    </button>
                    {onInsert && (
                      <button
                        type="button"
                        onClick={() => onInsert(token)}
                        className="rounded border border-border px-2 py-0.5 text-[10px] hover:bg-accent/10"
                      >
                        Inserisci
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
