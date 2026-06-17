import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListGallery,
  adminUpsertPhoto,
  adminDeletePhoto,
  adminListAlbums,
  adminUpsertAlbum,
  adminDeleteAlbum,
} from "@/lib/admin.functions";
import { Trash2, Pencil, Plus, X, FolderPlus } from "lucide-react";
import { Field } from "./admin.agenda";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: AdminGallery,
});

type P = {
  id: string;
  url: string;
  caption_it: string;
  caption_en: string;
  taken_at: string | null;
  sort_order: number;
  album_id: string | null;
};

type A = {
  id: string;
  slug: string;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  cover_url: string | null;
  sort_order: number;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function AdminGallery() {
  const listPhotos = useServerFn(adminListGallery);
  const upsertPhoto = useServerFn(adminUpsertPhoto);
  const delPhoto = useServerFn(adminDeletePhoto);
  const listAlbums = useServerFn(adminListAlbums);
  const upsertAlbum = useServerFn(adminUpsertAlbum);
  const delAlbum = useServerFn(adminDeleteAlbum);

  const [photos, setPhotos] = useState<P[]>([]);
  const [albums, setAlbums] = useState<A[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [editingPhoto, setEditingPhoto] = useState<Partial<P> | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Partial<A> | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [rp, ra] = await Promise.all([listPhotos(), listAlbums()]);
    setPhotos(rp.photos as P[]);
    setAlbums(ra.albums as A[]);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function savePhoto() {
    if (!editingPhoto) return;
    setBusy(true);
    try {
      await upsertPhoto({
        data: {
          id: editingPhoto.id,
          url: editingPhoto.url || "",
          caption_it: editingPhoto.caption_it || "",
          caption_en: editingPhoto.caption_en || "",
          taken_at: editingPhoto.taken_at || null,
          sort_order: Number(editingPhoto.sort_order ?? 0),
          album_id: editingPhoto.album_id || null,
        },
      });
      setEditingPhoto(null);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(id: string) {
    if (!confirm("Eliminare questa foto?")) return;
    await delPhoto({ data: { id } });
    await refresh();
  }

  async function saveAlbum() {
    if (!editingAlbum) return;
    setBusy(true);
    try {
      await upsertAlbum({
        data: {
          id: editingAlbum.id,
          slug: editingAlbum.slug || slugify(editingAlbum.title_it || ""),
          title_it: editingAlbum.title_it || "",
          title_en: editingAlbum.title_en || "",
          description_it: editingAlbum.description_it || "",
          description_en: editingAlbum.description_en || "",
          cover_url: editingAlbum.cover_url || null,
          sort_order: Number(editingAlbum.sort_order ?? 0),
        },
      });
      setEditingAlbum(null);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  async function removeAlbum(id: string) {
    if (!confirm("Eliminare questo album? Le foto non saranno eliminate ma resteranno senza album.")) return;
    await delAlbum({ data: { id } });
    await refresh();
  }

  const filteredPhotos =
    filter === "all"
      ? photos
      : filter === "none"
        ? photos.filter((p) => !p.album_id)
        : photos.filter((p) => p.album_id === filter);

  return (
    <div className="space-y-8">
      {/* ALBUMS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Album ({albums.length})</h2>
          <button
            onClick={() => setEditingAlbum({ sort_order: albums.length })}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <FolderPlus size={13} /> Nuovo album
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {albums.map((a) => (
            <div key={a.id} className="group relative overflow-hidden rounded-md border border-border bg-card">
              {a.cover_url ? (
                <img src={a.cover_url} alt={a.title_it} className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                  nessuna copertina
                </div>
              )}
              <div className="p-2">
                <div className="truncate text-sm font-medium">{a.title_it}</div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">/{a.slug}</div>
              </div>
              <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => setEditingAlbum(a)} className="rounded-md bg-background/90 p-1.5">
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => removeAlbum(a.id)}
                  className="rounded-md bg-background/90 p-1.5 text-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {albums.length === 0 && (
            <div className="col-span-full rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nessun album. Crea il primo per organizzare le foto.
            </div>
          )}
        </div>
      </section>

      {/* PHOTOS */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-xl">Foto ({photos.length})</h2>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
            >
              <option value="all">Tutti gli album</option>
              <option value="none">Senza album</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title_it}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                setEditingPhoto({
                  sort_order: photos.length,
                  album_id: filter !== "all" && filter !== "none" ? filter : null,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Plus size={13} /> Nuova foto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredPhotos.map((p) => {
            const album = albums.find((a) => a.id === p.album_id);
            return (
              <div key={p.id} className="group relative overflow-hidden rounded-md border border-border bg-card">
                <img src={p.url} alt={p.caption_it} className="aspect-square w-full object-cover" />
                <div className="p-2">
                  <div className="truncate text-xs font-medium">{p.caption_it || "—"}</div>
                  <div className="truncate text-[10px] font-mono uppercase text-muted-foreground">
                    {album ? album.title_it : "senza album"} · #{p.sort_order}
                  </div>
                </div>
                <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => setEditingPhoto(p)} className="rounded-md bg-background/90 p-1.5">
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => removePhoto(p.id)}
                    className="rounded-md bg-background/90 p-1.5 text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredPhotos.length === 0 && (
            <div className="col-span-full rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nessuna foto.
            </div>
          )}
        </div>
      </section>

      {/* PHOTO MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-10 w-full max-w-xl rounded-md border border-border bg-background p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-lg">{editingPhoto.id ? "Modifica foto" : "Nuova foto"}</h3>
              <button onClick={() => setEditingPhoto(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <ImageUpload
                label="Immagine"
                value={editingPhoto.url || ""}
                onChange={(v) => setEditingPhoto({ ...editingPhoto, url: v })}
                required
              />
              <label className="block">
                <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Album
                </span>
                <select
                  value={editingPhoto.album_id || ""}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, album_id: e.target.value || null })
                  }
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">— Senza album —</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title_it}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Didascalia (IT)"
                value={editingPhoto.caption_it || ""}
                onChange={(v) => setEditingPhoto({ ...editingPhoto, caption_it: v })}
              />
              <Field
                label="Didascalia (EN)"
                value={editingPhoto.caption_en || ""}
                onChange={(v) => setEditingPhoto({ ...editingPhoto, caption_en: v })}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Data scatto"
                  type="date"
                  value={editingPhoto.taken_at || ""}
                  onChange={(v) => setEditingPhoto({ ...editingPhoto, taken_at: v })}
                />
                <Field
                  label="Ordine"
                  type="number"
                  value={String(editingPhoto.sort_order ?? 0)}
                  onChange={(v) => setEditingPhoto({ ...editingPhoto, sort_order: Number(v) })}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingPhoto(null)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Annulla
              </button>
              <button
                onClick={savePhoto}
                disabled={busy || !editingPhoto.url}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
              >
                {busy ? "..." : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALBUM MODAL */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-10 w-full max-w-xl rounded-md border border-border bg-background p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif text-lg">
                {editingAlbum.id ? "Modifica album" : "Nuovo album"}
              </h3>
              <button onClick={() => setEditingAlbum(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <Field
                label="Titolo (IT)"
                value={editingAlbum.title_it || ""}
                onChange={(v) =>
                  setEditingAlbum({
                    ...editingAlbum,
                    title_it: v,
                    slug: editingAlbum.slug || slugify(v),
                  })
                }
                required
              />
              <Field
                label="Titolo (EN)"
                value={editingAlbum.title_en || ""}
                onChange={(v) => setEditingAlbum({ ...editingAlbum, title_en: v })}
              />
              <Field
                label="Slug"
                value={editingAlbum.slug || ""}
                onChange={(v) => setEditingAlbum({ ...editingAlbum, slug: slugify(v) })}
                required
              />
              <Field
                label="Descrizione (IT)"
                value={editingAlbum.description_it || ""}
                onChange={(v) => setEditingAlbum({ ...editingAlbum, description_it: v })}
                textarea
              />
              <Field
                label="Descrizione (EN)"
                value={editingAlbum.description_en || ""}
                onChange={(v) => setEditingAlbum({ ...editingAlbum, description_en: v })}
                textarea
              />
              <ImageUpload
                label="Copertina"
                value={editingAlbum.cover_url || ""}
                onChange={(v) => setEditingAlbum({ ...editingAlbum, cover_url: v })}
              />
              <Field
                label="Ordine"
                type="number"
                value={String(editingAlbum.sort_order ?? 0)}
                onChange={(v) => setEditingAlbum({ ...editingAlbum, sort_order: Number(v) })}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingAlbum(null)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Annulla
              </button>
              <button
                onClick={saveAlbum}
                disabled={busy || !editingAlbum.title_it}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
              >
                {busy ? "..." : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
