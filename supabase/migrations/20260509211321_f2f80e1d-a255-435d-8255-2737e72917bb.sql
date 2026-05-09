CREATE POLICY "Bootstrap first super admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role = 'super_admin'::app_role
  AND user_id = auth.uid()
  AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin'::app_role)
);