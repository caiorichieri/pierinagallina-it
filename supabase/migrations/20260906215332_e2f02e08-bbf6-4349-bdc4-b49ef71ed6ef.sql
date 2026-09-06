CREATE OR REPLACE FUNCTION public.import_posts_json(posts_json JSONB)
RETURNS TABLE(inserted INT, updated INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post JSONB;
  cat_id UUID;
  ins_count INT := 0;
  upd_count INT := 0;
BEGIN
  FOR post IN SELECT * FROM jsonb_array_elements(posts_json)
  LOOP
    -- Ensure category exists
    INSERT INTO public.categories (name, slug)
    VALUES (
      COALESCE(NULLIF(post->>'category', ''), 'Archivio'),
      COALESCE(NULLIF(lower(regexp_replace(nullif(post->>'category', ''), '[^a-zA-Z0-9]+', '-', 'g')), ''), 'archivio')
    )
    ON CONFLICT (slug) DO NOTHING;

    SELECT id INTO cat_id FROM public.categories
    WHERE slug = COALESCE(NULLIF(lower(regexp_replace(nullif(post->>'category', ''), '[^a-zA-Z0-9]+', '-', 'g')), ''), 'archivio');

    -- Insert or update post
    INSERT INTO public.posts (title, slug, excerpt, content, featured_image, published_at, category_id)
    VALUES (
      post->>'title',
      post->>'slug',
      LEFT(post->>'content', 500),
      post->>'content',
      NULLIF(post->>'featured_image', ''),
      COALESCE((post->>'date')::timestamptz, now()),
      cat_id
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      featured_image = EXCLUDED.featured_image,
      published_at = EXCLUDED.published_at,
      category_id = EXCLUDED.category_id
    WHERE posts.published_at IS NULL OR EXCLUDED.published_at > posts.published_at;

    IF FOUND THEN
      ins_count := ins_count + 1;
    ELSE
      upd_count := upd_count + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT ins_count, upd_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.import_posts_json(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.import_posts_json(JSONB) TO service_role;