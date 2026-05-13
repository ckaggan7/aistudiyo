
-- Storage: replace permissive public SELECT policies with owner-folder-scoped ones
DROP POLICY IF EXISTS "Public read generations bucket" ON storage.objects;
DROP POLICY IF EXISTS "brand-assets public read" ON storage.objects;
DROP POLICY IF EXISTS "Public upload generations bucket" ON storage.objects;

CREATE POLICY "generations owner list"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'generations' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "generations owner upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'generations' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "generations owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'generations' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "brand-assets owner list"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'brand-assets' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Revoke EXECUTE on internal SECURITY DEFINER helpers from anon/public.
-- Keep has_role and is_workspace_member EXECUTE for authenticated (used in RLS policies).
-- Keep get_public_certificate EXECUTE for anon (intended public share).
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.adjust_user_credits(uuid, integer, text) FROM anon, public;
