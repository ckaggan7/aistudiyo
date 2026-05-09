-- ============ WORKSPACES ============
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  credits INTEGER NOT NULL DEFAULT 50,
  storage_used_mb INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- helper
CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id uuid, _workspace_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = _workspace_id AND user_id = _user_id
  )
$$;

CREATE POLICY "Members read workspace" ON public.workspaces FOR SELECT TO authenticated
  USING (public.is_workspace_member(auth.uid(), id) OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users create workspace" ON public.workspaces FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner updates workspace" ON public.workspaces FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Owner or super deletes workspace" ON public.workspaces FOR DELETE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Members read members" ON public.workspace_members FOR SELECT TO authenticated
  USING (public.is_workspace_member(auth.uid(), workspace_id) OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Owner manages members insert" ON public.workspace_members FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
    OR auth.uid() = user_id  -- self-add at signup
  );
CREATE POLICY "Owner manages members update" ON public.workspace_members FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
  );
CREATE POLICY "Owner manages members delete" ON public.workspace_members FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
  );

CREATE TRIGGER workspaces_set_updated_at BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ AI INFRA ============
CREATE TABLE public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'healthy',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All read providers" ON public.ai_providers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin write providers ins" ON public.ai_providers FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admin write providers upd" ON public.ai_providers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admin write providers del" ON public.ai_providers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TABLE public.ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.ai_providers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  context_window INTEGER NOT NULL DEFAULT 8000,
  input_cost_per_1k NUMERIC(10,6) NOT NULL DEFAULT 0,
  output_cost_per_1k NUMERIC(10,6) NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All read models" ON public.ai_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin write models ins" ON public.ai_models FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admin write models upd" ON public.ai_models FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admin write models del" ON public.ai_models FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TABLE public.ai_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  model_slug TEXT NOT NULL,
  provider_slug TEXT,
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success',
  cost_usd NUMERIC(10,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_request_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_ai_logs_created ON public.ai_request_logs(created_at DESC);
CREATE INDEX idx_ai_logs_user ON public.ai_request_logs(user_id);
CREATE POLICY "User reads own ai logs" ON public.ai_request_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "User inserts own ai logs" ON public.ai_request_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- ============ ACTIVITY LOGS ============
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_activity_created ON public.activity_logs(created_at DESC);
CREATE POLICY "User reads own activity" ON public.activity_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "User inserts own activity" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- ============ FEATURE FLAGS ============
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  rollout_pct INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All read flags" ON public.feature_flags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin flags ins" ON public.feature_flags FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admin flags upd" ON public.feature_flags FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admin flags del" ON public.feature_flags FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER flags_set_updated_at BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Update signup trigger to also create personal workspace ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _ws_id UUID;
  _slug TEXT;
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, avatar_url)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  _slug := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 6);
  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (COALESCE(split_part(NEW.email, '@', 1), 'Personal') || '''s workspace', _slug, NEW.id)
  RETURNING id INTO _ws_id;
  INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES (_ws_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

-- ============ Seed AI providers + models ============
INSERT INTO public.ai_providers (slug, name) VALUES
  ('openai', 'OpenAI'),
  ('anthropic', 'Anthropic (Claude)'),
  ('google', 'Google (Gemini)'),
  ('xai', 'xAI (Grok)'),
  ('deepseek', 'DeepSeek')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.ai_models (provider_id, slug, name, context_window, input_cost_per_1k, output_cost_per_1k)
SELECT p.id, m.slug, m.name, m.ctx, m.ic, m.oc
FROM (VALUES
  ('openai', 'gpt-5', 'GPT-5', 200000, 0.005, 0.015),
  ('openai', 'gpt-5-mini', 'GPT-5 Mini', 128000, 0.0015, 0.006),
  ('openai', 'gpt-5-nano', 'GPT-5 Nano', 64000, 0.0005, 0.002),
  ('anthropic', 'claude-3.5-sonnet', 'Claude 3.5 Sonnet', 200000, 0.003, 0.015),
  ('google', 'gemini-3-flash', 'Gemini 3 Flash', 1000000, 0.0007, 0.0021),
  ('google', 'gemini-2.5-pro', 'Gemini 2.5 Pro', 2000000, 0.00125, 0.005),
  ('xai', 'grok-2', 'Grok 2', 131000, 0.002, 0.01),
  ('deepseek', 'deepseek-v3', 'DeepSeek V3', 128000, 0.00027, 0.0011)
) AS m(provider_slug, slug, name, ctx, ic, oc)
JOIN public.ai_providers p ON p.slug = m.provider_slug
ON CONFLICT (slug) DO NOTHING;

-- Seed feature flags
INSERT INTO public.feature_flags (key, description, enabled, rollout_pct) VALUES
  ('command_palette', 'Global Cmd+K command palette', true, 100),
  ('agents_v2', 'Agent builder v2', true, 100),
  ('image_studio', 'Image Studio', true, 100),
  ('analytics_realtime', 'Realtime analytics streaming', false, 0)
ON CONFLICT (key) DO NOTHING;