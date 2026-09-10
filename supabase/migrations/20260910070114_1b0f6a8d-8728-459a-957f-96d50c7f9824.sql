INSERT INTO public.user_roles (user_id, role)
VALUES ('2811cf21-c53a-4c10-bd42-3d4213c36215', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;