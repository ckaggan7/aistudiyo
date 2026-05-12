
-- Extend brand_profile
ALTER TABLE public.brand_profile
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS memory jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS score jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS scan_summary jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Tighten brand_profile RLS (was fully public)
DROP POLICY IF EXISTS "public delete brand_profile" ON public.brand_profile;
DROP POLICY IF EXISTS "public insert brand_profile" ON public.brand_profile;
DROP POLICY IF EXISTS "public read brand_profile" ON public.brand_profile;
DROP POLICY IF EXISTS "public update brand_profile" ON public.brand_profile;

CREATE POLICY "Users read own brand_profile" ON public.brand_profile
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users insert own brand_profile" ON public.brand_profile
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users update own brand_profile" ON public.brand_profile
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users delete own brand_profile" ON public.brand_profile
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role));

-- brand_assets
CREATE TABLE IF NOT EXISTS public.brand_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  brand_id uuid REFERENCES public.brand_profile(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'document',
  name text,
  url text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own brand_assets" ON public.brand_assets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users insert own brand_assets" ON public.brand_assets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own brand_assets" ON public.brand_assets
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own brand_assets" ON public.brand_assets
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "brand-assets public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'brand-assets');

CREATE POLICY "brand-assets owner upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "brand-assets owner update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "brand-assets owner delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
