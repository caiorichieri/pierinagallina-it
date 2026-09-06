REVOKE EXECUTE ON FUNCTION public.import_posts_json(JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.import_posts_json(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.import_posts_json(JSONB) TO service_role;