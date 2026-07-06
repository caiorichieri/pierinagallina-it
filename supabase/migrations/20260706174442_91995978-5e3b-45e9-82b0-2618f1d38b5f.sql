
-- Contact messages: explicit policies
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

DROP POLICY IF EXISTS "contact_messages_insert_public" ON public.contact_messages;
CREATE POLICY "contact_messages_insert_public" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 5 AND 4000
    AND (subject IS NULL OR length(subject) <= 200)
  );

DROP POLICY IF EXISTS "contact_messages_admin_select" ON public.contact_messages;
CREATE POLICY "contact_messages_admin_select" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "contact_messages_admin_delete" ON public.contact_messages;
CREATE POLICY "contact_messages_admin_delete" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Restrict has_role: only callable by authenticated, only for self
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
    AND _user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
$$;
