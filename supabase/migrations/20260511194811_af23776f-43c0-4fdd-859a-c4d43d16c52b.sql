CREATE TABLE public.content_packs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  platform text NOT NULL DEFAULT 'instagram',
  content_type text NOT NULL DEFAULT 'post',
  pack_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  scores_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.content_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own content_packs" ON public.content_packs
  FOR SELECT TO authenticated
  USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users insert own content_packs" ON public.content_packs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own content_packs" ON public.content_packs
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own content_packs" ON public.content_packs
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER content_packs_set_updated_at
  BEFORE UPDATE ON public.content_packs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX content_packs_user_created_idx ON public.content_packs(user_id, created_at DESC);