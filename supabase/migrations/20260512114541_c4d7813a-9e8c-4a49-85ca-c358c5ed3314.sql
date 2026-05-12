
-- creator_profile
CREATE TABLE public.creator_profile (
  user_id uuid PRIMARY KEY,
  niche text,
  business_type text,
  skill_level text NOT NULL DEFAULT 'beginner',
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.creator_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own creator_profile" ON public.creator_profile FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own creator_profile" ON public.creator_profile FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own creator_profile" ON public.creator_profile FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE TRIGGER trg_creator_profile_updated BEFORE UPDATE ON public.creator_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- creator_missions
CREATE TABLE public.creator_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mission_id text NOT NULL,
  status text NOT NULL DEFAULT 'claimed',
  xp integer NOT NULL DEFAULT 0,
  rewards jsonb NOT NULL DEFAULT '{}'::jsonb,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);
ALTER TABLE public.creator_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own creator_missions" ON public.creator_missions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own creator_missions" ON public.creator_missions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own creator_missions" ON public.creator_missions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- certificates
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id text NOT NULL,
  title text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  share_slug text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own certificates" ON public.certificates FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own certificates" ON public.certificates FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- public certificate fetch by slug (security definer)
CREATE OR REPLACE FUNCTION public.get_public_certificate(_slug text)
RETURNS TABLE (id uuid, track_id text, title text, score integer, issued_at timestamptz, display_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.track_id, c.title, c.score, c.issued_at,
         COALESCE(p.display_name, 'AISTUDIYO Creator') AS display_name
  FROM public.certificates c
  LEFT JOIN public.profiles p ON p.user_id = c.user_id
  WHERE c.share_slug = _slug
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_certificate(text) TO anon, authenticated;

-- community_posts
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'story',
  body text NOT NULL,
  image_url text,
  content_pack_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in reads community_posts" ON public.community_posts FOR SELECT TO authenticated
  USING (true);
CREATE POLICY "Users insert own community_posts" ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own community_posts" ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete own community_posts" ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

-- creator_xp view (security_invoker so it respects RLS)
CREATE OR REPLACE VIEW public.creator_xp WITH (security_invoker = true) AS
  SELECT user_id, COALESCE(SUM(xp), 0)::integer AS xp
  FROM public.creator_missions
  WHERE status = 'claimed'
  GROUP BY user_id;
