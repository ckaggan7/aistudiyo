
-- ============ meta_connections ============
DROP POLICY IF EXISTS "public delete meta_connections" ON public.meta_connections;
DROP POLICY IF EXISTS "public insert meta_connections" ON public.meta_connections;
DROP POLICY IF EXISTS "public read meta_connections" ON public.meta_connections;
DROP POLICY IF EXISTS "public update meta_connections" ON public.meta_connections;

CREATE POLICY "Users read own meta_connections" ON public.meta_connections
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own meta_connections" ON public.meta_connections
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own meta_connections" ON public.meta_connections
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own meta_connections" ON public.meta_connections
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ agents ============
DROP POLICY IF EXISTS "public delete agents" ON public.agents;
DROP POLICY IF EXISTS "public insert agents" ON public.agents;
DROP POLICY IF EXISTS "public read agents" ON public.agents;
DROP POLICY IF EXISTS "public update agents" ON public.agents;

CREATE POLICY "Users read own agents" ON public.agents
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own agents" ON public.agents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own agents" ON public.agents
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own agents" ON public.agents
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ agent_runs (scoped via agents) ============
DROP POLICY IF EXISTS "public delete agent_runs" ON public.agent_runs;
DROP POLICY IF EXISTS "public insert agent_runs" ON public.agent_runs;
DROP POLICY IF EXISTS "public read agent_runs" ON public.agent_runs;
DROP POLICY IF EXISTS "public update agent_runs" ON public.agent_runs;

CREATE POLICY "Users read own agent_runs" ON public.agent_runs
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_runs.agent_id AND (a.user_id = auth.uid() OR has_role(auth.uid(), 'super_admin')))
  );
CREATE POLICY "Users insert own agent_runs" ON public.agent_runs
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_runs.agent_id AND a.user_id = auth.uid())
  );
CREATE POLICY "Users update own agent_runs" ON public.agent_runs
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_runs.agent_id AND a.user_id = auth.uid())
  );
CREATE POLICY "Users delete own agent_runs" ON public.agent_runs
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_runs.agent_id AND a.user_id = auth.uid())
  );

-- ============ agent_reports ============
DROP POLICY IF EXISTS "public delete agent_reports" ON public.agent_reports;
DROP POLICY IF EXISTS "public insert agent_reports" ON public.agent_reports;
DROP POLICY IF EXISTS "public read agent_reports" ON public.agent_reports;
DROP POLICY IF EXISTS "public update agent_reports" ON public.agent_reports;

CREATE POLICY "Users read own agent_reports" ON public.agent_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own agent_reports" ON public.agent_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own agent_reports" ON public.agent_reports
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own agent_reports" ON public.agent_reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ scheduled_posts ============
DROP POLICY IF EXISTS "public delete scheduled_posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "public insert scheduled_posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "public read scheduled_posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "public update scheduled_posts" ON public.scheduled_posts;

CREATE POLICY "Users read own scheduled_posts" ON public.scheduled_posts
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own scheduled_posts" ON public.scheduled_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own scheduled_posts" ON public.scheduled_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own scheduled_posts" ON public.scheduled_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ campaigns ============
DROP POLICY IF EXISTS "public delete campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "public insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "public read campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "public update campaigns" ON public.campaigns;

CREATE POLICY "Users read own campaigns" ON public.campaigns
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own campaigns" ON public.campaigns
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own campaigns" ON public.campaigns
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own campaigns" ON public.campaigns
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ content_pillars ============
DROP POLICY IF EXISTS "public delete content_pillars" ON public.content_pillars;
DROP POLICY IF EXISTS "public insert content_pillars" ON public.content_pillars;
DROP POLICY IF EXISTS "public read content_pillars" ON public.content_pillars;
DROP POLICY IF EXISTS "public update content_pillars" ON public.content_pillars;

CREATE POLICY "Users read own content_pillars" ON public.content_pillars
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own content_pillars" ON public.content_pillars
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own content_pillars" ON public.content_pillars
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own content_pillars" ON public.content_pillars
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ voice_presets ============
DROP POLICY IF EXISTS "public delete voice_presets" ON public.voice_presets;
DROP POLICY IF EXISTS "public insert voice_presets" ON public.voice_presets;
DROP POLICY IF EXISTS "public read voice_presets" ON public.voice_presets;
DROP POLICY IF EXISTS "public update voice_presets" ON public.voice_presets;

CREATE POLICY "Users read own voice_presets" ON public.voice_presets
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own voice_presets" ON public.voice_presets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own voice_presets" ON public.voice_presets
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own voice_presets" ON public.voice_presets
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ generations ============
DROP POLICY IF EXISTS "Anyone can delete generations" ON public.generations;
DROP POLICY IF EXISTS "Anyone can insert generations" ON public.generations;
DROP POLICY IF EXISTS "Anyone can view generations" ON public.generations;

CREATE POLICY "Users read own generations" ON public.generations
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users insert own generations" ON public.generations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own generations" ON public.generations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ profiles: only own row readable ============
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

-- ============ brand_profile: remove user_id IS NULL loophole ============
DROP POLICY IF EXISTS "Users insert own brand_profile" ON public.brand_profile;
DROP POLICY IF EXISTS "Users read own brand_profile" ON public.brand_profile;
DROP POLICY IF EXISTS "Users update own brand_profile" ON public.brand_profile;
DROP POLICY IF EXISTS "Users delete own brand_profile" ON public.brand_profile;

CREATE POLICY "Users insert own brand_profile" ON public.brand_profile
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own brand_profile" ON public.brand_profile
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users update own brand_profile" ON public.brand_profile
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users delete own brand_profile" ON public.brand_profile
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

-- Clean up orphan rows so they're not exposed
DELETE FROM public.brand_profile WHERE user_id IS NULL;
ALTER TABLE public.brand_profile ALTER COLUMN user_id SET NOT NULL;

-- ============ workspace_members: remove self-insert ============
DROP POLICY IF EXISTS "Owner manages members insert" ON public.workspace_members;
CREATE POLICY "Owner manages members insert" ON public.workspace_members
  FOR INSERT TO authenticated WITH CHECK (
    has_role(auth.uid(), 'super_admin') OR
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_members.workspace_id AND w.owner_id = auth.uid())
  );

-- ============ credit_transactions: server-side only inserts ============
DROP POLICY IF EXISTS "Users insert own credit_transactions" ON public.credit_transactions;
CREATE POLICY "Super admins insert credit_transactions" ON public.credit_transactions
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- ============ wallet: server-side only inserts ============
DROP POLICY IF EXISTS "Users insert own wallet" ON public.wallet;
CREATE POLICY "Super admins insert wallet" ON public.wallet
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- ============ user_roles: remove bootstrap escalation ============
DROP POLICY IF EXISTS "Bootstrap first super admin" ON public.user_roles;

-- ============ Revoke public execute on privileged SECURITY DEFINER ============
REVOKE EXECUTE ON FUNCTION public.adjust_user_credits(uuid, integer, text) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.adjust_user_credits(uuid, integer, text) TO authenticated;
-- get_public_certificate is intentionally public for /c/:slug pages — keep accessible
