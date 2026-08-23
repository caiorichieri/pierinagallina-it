REVOKE SELECT ON public.post_comments FROM anon, authenticated;
GRANT SELECT (id, post_slug, post_title, author_name, body, approved, created_at) ON public.post_comments TO anon, authenticated;
GRANT INSERT ON public.post_comments TO anon, authenticated;
GRANT ALL ON public.post_comments TO service_role;