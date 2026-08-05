import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useUpload } from "@/lib/use-upload";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Link2Off, Minus, Undo2, Redo2, ImagePlus, Code2,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

const BTN =
  "inline-flex h-8 w-8 items-center justify-center rounded border border-transparent text-foreground/70 hover:bg-accent/10 hover:text-accent disabled:opacity-40";
const ACTIVE = "bg-accent/15 text-accent border-accent/30";

function Btn({
  on, title, onClick, children, disabled,
}: {
  on?: boolean; title: string; onClick: () => void; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button type="button" title={title} onClick={onClick} disabled={disabled} className={`${BTN} ${on ? ACTIVE : ""}`}>
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const upload = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const insertImages = useCallback(
    async (files: File[]) => {
      setErr(null);
      setBusy(true);
      try {
        for (const f of files) {
          const url = await upload(f);
          editor.chain().focus().setImage({ src: url, alt: f.name }).run();
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Errore upload");
      } finally {
        setBusy(false);
      }
    },
    [editor, upload],
  );

  function setLink() {
    const prev = editor.getAttributes("link")["href"] as string | undefined;
    const url = window.prompt("Indirizzo del link:", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function imgWidth(cls: string) {
    editor.chain().focus().updateAttributes("image", { class: cls }).run();
  }

  const imageActive = editor.isActive("image");

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-md border-b border-border bg-card px-2 py-1.5">
      <Btn title="Grassetto" on={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></Btn>
      <Btn title="Corsivo" on={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></Btn>
      <Btn title="Sottolineato" on={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={15} /></Btn>
      <Btn title="Barrato" on={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={15} /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Titolo" on={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></Btn>
      <Btn title="Sottotitolo" on={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></Btn>
      <Btn title="Elenco puntato" on={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></Btn>
      <Btn title="Elenco numerato" on={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></Btn>
      <Btn title="Citazione" on={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Inserisci link" on={editor.isActive("link")} onClick={setLink}><Link2 size={15} /></Btn>
      <Btn title="Rimuovi link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}><Link2Off size={15} /></Btn>
      <Btn title="Linea divisoria" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={15} /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Inserisci foto" onClick={() => fileRef.current?.click()} disabled={busy}><ImagePlus size={15} /></Btn>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) void insertImages(files);
        }}
      />
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Annulla" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={15} /></Btn>
      <Btn title="Ripeti" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={15} /></Btn>

      {busy && <span className="ml-2 text-[11px] text-muted-foreground">Caricamento foto…</span>}
      {err && <span className="ml-2 text-[11px] text-destructive">{err}</span>}

      {imageActive && (
        <div className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
          Foto:
          <button type="button" onClick={() => imgWidth("img-sm")} className="rounded border border-border px-1.5 py-0.5 hover:text-accent">piccola</button>
          <button type="button" onClick={() => imgWidth("img-md")} className="rounded border border-border px-1.5 py-0.5 hover:text-accent">media</button>
          <button type="button" onClick={() => imgWidth("img-full")} className="rounded border border-border px-1.5 py-0.5 hover:text-accent">piena</button>
        </div>
      )}
    </div>
  );
}

const ImageWithClass = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: { default: "img-full" },
    };
  },
});

export function RichTextEditor({ value, onChange, placeholder, minHeight = 320 }: Props) {
  const [raw, setRaw] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } },
      }),
      ImageWithClass.configure({ inline: false, allowBase64: false }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "rte-content focus:outline-none",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  });

  // Sincronizza quando il contenuto arriva dal server dopo il primo render.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && !editor.isFocused) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      {editor && !raw && <Toolbar editor={editor} />}
      {raw ? (
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            editor?.commands.setContent(e.target.value || "", { emitUpdate: false });
          }}
          rows={18}
          className="w-full bg-background px-4 py-3 font-mono text-xs leading-relaxed outline-none"
        />
      ) : (
        <EditorContent editor={editor} className="px-4 py-3" data-placeholder={placeholder} />
      )}
      <div className="flex justify-end border-t border-border bg-card px-2 py-1">
        <button
          type="button"
          onClick={() => setRaw((v) => !v)}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-accent"
        >
          <Code2 size={12} /> {raw ? "Editor visuale" : "Modifica HTML"}
        </button>
      </div>
    </div>
  );
}
