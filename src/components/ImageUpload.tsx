import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { uploadMedia } from "@/lib/upload.functions";
import { Upload, X } from "lucide-react";

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

export function ImageUpload({
  label = "Immagine",
  value,
  onChange,
  required = false,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}) {
  const upload = useServerFn(uploadMedia);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErr("File troppo grande (max 10MB).");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const b64 = await fileToBase64(file);
      const res = await upload({
        data: { filename: file.name, contentType: file.type || "application/octet-stream", dataBase64: b64 },
      });
      onChange(res.url);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Errore upload");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}{required && " *"}
      </span>
      <div className="mt-1 flex items-start gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-28 w-28 rounded-md border border-border object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 rounded-full bg-background border border-border p-1 text-destructive"
              title="Rimuovi"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
            Nessuna
          </div>
        )}
        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent/10">
            <Upload size={13} /> {busy ? "Caricamento…" : "Carica file"}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
          </label>
          {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
          <p className="mt-2 text-[10px] text-muted-foreground break-all">{value || "Nessun file selezionato"}</p>
        </div>
      </div>
    </div>
  );
}
