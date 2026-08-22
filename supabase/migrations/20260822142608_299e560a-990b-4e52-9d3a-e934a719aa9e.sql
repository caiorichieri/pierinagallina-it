CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,
  post_title text,
  author_name text NOT NULL,
  author_email text,
  body text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX post_comments_slug_idx ON public.post_comments (post_slug, created_at DESC);

GRANT SELECT, INSERT ON public.post_comments TO anon;
GRANT SELECT, INSERT ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY post_comments_public_read ON public.post_comments
  FOR SELECT TO anon, authenticated
  USING (approved = true);

CREATE POLICY post_comments_public_insert ON public.post_comments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    approved = false
    AND length(author_name) BETWEEN 2 AND 80
    AND length(body) BETWEEN 2 AND 2000
    AND length(post_slug) BETWEEN 1 AND 300
    AND (post_title IS NULL OR length(post_title) <= 300)
    AND (author_email IS NULL OR length(author_email) <= 255)
  );

CREATE VIEW public.post_comments_public
  WITH (security_invoker = true) AS
  SELECT id, post_slug, author_name, body, created_at
  FROM public.post_comments
  WHERE approved = true;

GRANT SELECT ON public.post_comments_public TO anon, authenticated;