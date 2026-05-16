-- Prevent users from directly editing wallet balances or moving wallet rows between accounts.
-- Credit balance changes should happen through SECURITY DEFINER functions that perform
-- explicit authorization checks, or through trusted backend service-role functions.
DROP POLICY IF EXISTS "Users update own wallet" ON public.wallet;
DROP POLICY IF EXISTS "Super admins update wallet" ON public.wallet;

-- Add an owner-scoped UPDATE policy for generated files in storage.
-- The WITH CHECK clause prevents users from moving files into another user's folder.
DROP POLICY IF EXISTS "generations owner update" ON storage.objects;
CREATE POLICY "generations owner update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'generations'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'generations'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );