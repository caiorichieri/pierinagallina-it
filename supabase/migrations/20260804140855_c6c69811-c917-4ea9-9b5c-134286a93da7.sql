CREATE TABLE public.page_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  post_slug text,
  post_title text,
  referrer text,
  device text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.page_visits TO anon;
GRANT INSERT ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_visits_public_insert ON public.page_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(path) BETWEEN 1 AND 300
    AND (post_slug IS NULL OR length(post_slug) <= 300)
    AND (post_title IS NULL OR length(post_title) <= 300)
    AND (referrer IS NULL OR length(referrer) <= 500)
    AND (device IS NULL OR length(device) <= 20)
    AND (session_id IS NULL OR length(session_id) <= 64)
  );

CREATE INDEX page_visits_created_at_idx ON public.page_visits (created_at DESC);
CREATE INDEX page_visits_path_idx ON public.page_visits (path);
CREATE INDEX page_visits_post_slug_idx ON public.page_visits (post_slug);