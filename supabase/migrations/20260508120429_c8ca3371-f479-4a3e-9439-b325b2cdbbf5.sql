
-- scheduled_posts
CREATE TABLE public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  campaign_id uuid,
  title text NOT NULL,
  caption text,
  image_url text,
  platform text NOT NULL DEFAULT 'instagram',
  scheduled_for timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read scheduled_posts" ON public.scheduled_posts FOR SELECT USING (true);
CREATE POLICY "public insert scheduled_posts" ON public.scheduled_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "public update scheduled_posts" ON public.scheduled_posts FOR UPDATE USING (true);
CREATE POLICY "public delete scheduled_posts" ON public.scheduled_posts FOR DELETE USING (true);

-- brand_profile (single row pattern, but keyed by id for flexibility)
CREATE TABLE public.brand_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL DEFAULT 'My Brand',
  tagline text,
  voice text,
  audience text,
  palette jsonb DEFAULT '[]'::jsonb,
  font_pair text,
  logo_url text,
  style_prompt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.brand_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read brand_profile" ON public.brand_profile FOR SELECT USING (true);
CREATE POLICY "public insert brand_profile" ON public.brand_profile FOR INSERT WITH CHECK (true);
CREATE POLICY "public update brand_profile" ON public.brand_profile FOR UPDATE USING (true);
CREATE POLICY "public delete brand_profile" ON public.brand_profile FOR DELETE USING (true);

-- campaigns
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  goal text,
  kpi text,
  color text DEFAULT '#8b5cf6',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "public insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "public update campaigns" ON public.campaigns FOR UPDATE USING (true);
CREATE POLICY "public delete campaigns" ON public.campaigns FOR DELETE USING (true);

-- content_pillars
CREATE TABLE public.content_pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  description text,
  cadence text DEFAULT 'weekly',
  color text DEFAULT '#06b6d4',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read content_pillars" ON public.content_pillars FOR SELECT USING (true);
CREATE POLICY "public insert content_pillars" ON public.content_pillars FOR INSERT WITH CHECK (true);
CREATE POLICY "public update content_pillars" ON public.content_pillars FOR UPDATE USING (true);
CREATE POLICY "public delete content_pillars" ON public.content_pillars FOR DELETE USING (true);

-- voice_presets
CREATE TABLE public.voice_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  tone text,
  sample text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.voice_presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read voice_presets" ON public.voice_presets FOR SELECT USING (true);
CREATE POLICY "public insert voice_presets" ON public.voice_presets FOR INSERT WITH CHECK (true);
CREATE POLICY "public update voice_presets" ON public.voice_presets FOR UPDATE USING (true);
CREATE POLICY "public delete voice_presets" ON public.voice_presets FOR DELETE USING (true);

-- agents
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'publisher',
  goal text,
  system_prompt text,
  schedule_cron text,
  tools jsonb DEFAULT '[]'::jsonb,
  enabled boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "public insert agents" ON public.agents FOR INSERT WITH CHECK (true);
CREATE POLICY "public update agents" ON public.agents FOR UPDATE USING (true);
CREATE POLICY "public delete agents" ON public.agents FOR DELETE USING (true);

-- agent_runs
CREATE TABLE public.agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  logs jsonb DEFAULT '[]'::jsonb,
  output text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read agent_runs" ON public.agent_runs FOR SELECT USING (true);
CREATE POLICY "public insert agent_runs" ON public.agent_runs FOR INSERT WITH CHECK (true);
CREATE POLICY "public update agent_runs" ON public.agent_runs FOR UPDATE USING (true);
CREATE POLICY "public delete agent_runs" ON public.agent_runs FOR DELETE USING (true);

-- meta_connections
CREATE TABLE public.meta_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  provider text NOT NULL DEFAULT 'instagram',
  page_id text,
  ig_user_id text,
  access_token text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.meta_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read meta_connections" ON public.meta_connections FOR SELECT USING (true);
CREATE POLICY "public insert meta_connections" ON public.meta_connections FOR INSERT WITH CHECK (true);
CREATE POLICY "public update meta_connections" ON public.meta_connections FOR UPDATE USING (true);
CREATE POLICY "public delete meta_connections" ON public.meta_connections FOR DELETE USING (true);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_scheduled_posts_updated BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_brand_profile_updated BEFORE UPDATE ON public.brand_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_agents_updated BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
