import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, type Post, type Category } from "@/integrations/pierina/client";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ImageUpload } from "@/components/ImageUpload";
import { RichTextEditor } from "@/components/RichTextEditor";
import { slugifyTag } from "@/routes/admin.etichette";
import { readPostMeta, writePostMeta } from "@/lib/post-meta";

export const Route = createFileRoute("/admin/posts/$id")({
  component: PostEditor,
});

function slugify(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-");
}

function PostEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Post>>({
    title: "", slug: "", excerpt: "", content: "", featured_image: "", published_at: null, category_id: null,
  });
  const [cats, setCats] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");
  const [catBusy, setCatBusy] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [coverFull, setCoverFull] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await db.from("categories").select("id,name,slug,post_count").order("name", { ascending: true });
      setCats((data as Category[] | null) ?? []);
    })();
  }, []);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await db.from("posts").select("*").eq("id", id).maybeSingle();
      if (error) setErr(error.message);
      else if (data) {
        const p = data as Post;
        const { meta, clean } = readPostMeta(p.excerpt);
        setForm({ ...p, excerpt: clean });
        const ids = new Set<string>(meta.tags);
        if (p.category_id) ids.add(p.category_id);
        setTags([...ids]);
        setCoverFull(meta.coverFull);
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  function update<K extends keyof Post>(k: K, v: Post[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleTag(tagId: string) {
    setTags((t) => (t.includes(tagId) ? t.filter((x) => x !== tagId) : [...t, tagId]));
  }

  async function createCategory() {
    const name = newCat.trim();
    if (!name) return;
    setCatBusy(true);
    const { data, error } = await db
      .from("categories")
      .insert({ name, slug: slugifyTag(name), post_count: 0 })
      .select("id,name,slug,post_count")
      .single();
    setCatBusy(false);
    if (error) return setErr(error.message);
    const c = data as Category;
    setCats((l) => [...l, c].sort((a, b) => a.name.localeCompare(b.name)));
    setTags((t) => [...t, c.id]);
    setNewCat("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const [first, ...extra] = tags;
    const payload = {
      title: form.title ?? "",
      slug: form.slug?.trim() ? form.slug.trim() : slugify(form.title ?? ""),
      excerpt: writePostMeta(form.excerpt ?? "", { tags: extra, coverFull }) || null,
      content: form.content || null,
      featured_image: form.featured_image || null,
      published_at: form.published_at || null,
      category_id: first ?? null,
    };
    if (!payload.title) { setErr("Il titolo è obbligatorio."); setSaving(false); return; }

    if (isNew) {
      const { data, error } = await db.from("posts").insert(payload).select("id").single();
      setSaving(false);
      if (error) return setErr(error.message);
      nav({ to: "/admin/posts/$id", params: { id: (data as { id: string }).id } });
    } else {
      const { error } = await db.from("posts").update(payload).eq("id", id);
      setSaving(false);
      if (error) return setErr(error.message);
      alert("Salvato.");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Caricamento…</p>;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/posts" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
        <ArrowLeft size={12} /> Tutti gli articoli
      </Link>
      <h1 className="mt-3 font-serif text-3xl italic text-primary">
        {isNew ? "Nuovo articolo" : "Modifica articolo"}
      </h1>

      <form onSubmit={save} className="mt-6 space-y-5">
        <Field label="Titolo">
          <input
            value={form.title ?? ""} onChange={(e) => update("title", e.target.value)} required
            className="w-full rounded-md border border-border bg-card px-3 py-2 font-serif text-lg outline-none focus:border-accent"
          />
        </Field>
        <Field label="Slug" hint="Lascia vuoto per generarlo dal titolo.">
          <input
            value={form.slug ?? ""} onChange={(e) => update("slug", e.target.value)}
            placeholder={slugify(form.title ?? "")}
            className="w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-sm outline-none focus:border-accent"
          />
        </Field>
        <Field
          label="Etichette"
          hint="Puoi sceglierne più di una: l'articolo comparirà sotto ognuna di esse."
        >
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => {
              const on = tags.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleTag(c.id)}
                  className={
                    "rounded-full border px-3 py-1.5 text-sm transition-colors " +
                    (on
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent")
                  }
                >
                  {c.name}
                </button>
              );
            })}
            {cats.length === 0 && (
              <span className="text-sm text-muted-foreground">Nessuna etichetta ancora creata.</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createCategory(); } }}
              placeholder="Nuova etichetta…"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button" onClick={createCategory} disabled={catBusy || !newCat.trim()}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Plus size={14} /> Crea
            </button>
          </div>
        </Field>
        <ImageUpload
          label="Immagine in evidenza"
          value={form.featured_image ?? ""}
          onChange={(url) => update("featured_image", url)}
        />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={coverFull}
            onChange={(e) => setCoverFull(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--accent))]"
          />
          Mostra la foto di copertina intera (senza taglio) nella pagina dell'articolo
        </label>
        <Field label="Estratto" hint="Breve testo di anteprima mostrato negli elenchi.">
          <RichTextEditor
            value={form.excerpt ?? ""}
            onChange={(html) => update("excerpt", html)}
            minHeight={100}
          />
        </Field>
        <Field label="Contenuto" hint="Usa la barra in alto per grassetto, titoli, elenchi, link e per inserire foto nel testo.">
          <RichTextEditor
            value={form.content ?? ""}
            onChange={(html) => update("content", html)}
            minHeight={380}
          />
        </Field>
        <Field label="Data di pubblicazione" hint="Lascia vuoto per salvare come bozza.">
          <input
            type="datetime-local"
            value={form.published_at ? form.published_at.slice(0, 16) : ""}
            onChange={(e) => update("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>

        {err && <p className="text-sm text-destructive">{err}</p>}

        <div className="flex items-center gap-3 border-t border-border pt-5">
          <button
            type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "Salvataggio…" : "Salva"}
          </button>
          {!isNew && form.slug && (
            <Link to="/blog/$slug" params={{ slug: form.slug }} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
              Apri sul sito →
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-foreground/70">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
