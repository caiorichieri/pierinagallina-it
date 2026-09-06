CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  post_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL
);
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON public.posts FOR SELECT TO anon, authenticated USING (published_at IS NOT NULL);

CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INT,
  price NUMERIC(10, 2),
  description TEXT,
  buy_url TEXT,
  youtube_id TEXT,
  type TEXT,
  cover_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.books TO anon, authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "books_public_read" ON public.books FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_friulian TEXT,
  content_italian TEXT,
  written_at DATE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.poems TO anon, authenticated;
GRANT ALL ON public.poems TO service_role;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "poems_public_read" ON public.poems FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.fiabe_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fiabe_collections TO anon, authenticated;
GRANT ALL ON public.fiabe_collections TO service_role;
ALTER TABLE public.fiabe_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fiabe_collections_public_read" ON public.fiabe_collections FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.fiabe_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.fiabe_collections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  mp3_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fiabe_tracks TO anon, authenticated;
GRANT ALL ON public.fiabe_tracks TO service_role;
ALTER TABLE public.fiabe_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fiabe_tracks_public_read" ON public.fiabe_tracks FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.content_gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_gallery_photos TO anon, authenticated;
GRANT ALL ON public.content_gallery_photos TO service_role;
ALTER TABLE public.content_gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_gallery_photos_public_read" ON public.content_gallery_photos FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter_subscribers_admin_manage" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));