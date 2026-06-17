import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { db, type Post } from "@/integrations/pierina/client";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug],
    queryFn: async (): Promise<Post> => {
      const { data, error } = await db
        .from("posts")
        .select("id,title,slug,excerpt,content,featured_image,published_at,created_at")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Post;
    },
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Pierina Gallina` },
          { name: "description", content: (loaderData.excerpt ?? "").replace(/<[^>]*>/g, "").slice(0, 160) },
          { property: "og:title", content: loaderData.title },
          ...(loaderData.featured_image ? [{ property: "og:image", content: loaderData.featured_image }] : []),
        ]
      : [{ title: "Articolo — Pierina Gallina" }],
  }),
  component: PostPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{(error as Error).message}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-16 text-center">
      <h1 className="font-serif text-3xl">Articolo non trovato</h1>
      <Link to="/blog" className="mt-6 inline-block text-sm text-primary hover:text-accent">
        Torna al blog
      </Link>
    </div>
  ),
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(postQuery(slug));

  return (
    <article className="bg-background">
      {p.featured_image && (
        <div className="relative h-[42vh] w-full overflow-hidden bg-primary">
          <img src={p.featured_image} alt={p.title} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      <header className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent">
          <ArrowLeft size={14} /> Tutti gli articoli
        </Link>
        {p.published_at && (
          <time className="mt-6 block font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {new Date(p.published_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
          </time>
        )}
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {p.title}
        </h1>
      </header>

      <div
        className="prose-pierina mx-auto max-w-3xl px-4 py-12 font-serif text-lg leading-relaxed text-foreground/90 sm:px-6"
        dangerouslySetInnerHTML={{ __html: p.content ?? "" }}
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent">
          <ArrowLeft size={14} /> Torna al blog
        </Link>
      </div>
    </article>
  );
}
