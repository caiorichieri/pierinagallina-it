CREATE POLICY "page_visits_admin_select" ON public.page_visits FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
GRANT SELECT ON public.page_visits TO authenticated;