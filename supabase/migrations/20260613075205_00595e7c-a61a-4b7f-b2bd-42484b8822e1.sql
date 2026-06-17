
CREATE TABLE public.gallery_albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_it TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  description_it TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_albums TO anon, authenticated;
GRANT ALL ON public.gallery_albums TO service_role;

ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "albums_public_read" ON public.gallery_albums
  FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.gallery_photos
  ADD COLUMN album_id UUID REFERENCES public.gallery_albums(id) ON DELETE SET NULL;

CREATE INDEX idx_gallery_photos_album_id ON public.gallery_photos(album_id);
