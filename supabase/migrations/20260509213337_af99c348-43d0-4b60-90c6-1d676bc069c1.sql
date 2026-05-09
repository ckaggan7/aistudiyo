
-- WORKFLOWS
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  graph JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | active | paused
  schedule_cron TEXT,
  is_template BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  run_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflows_user ON public.workflows(user_id);
CREATE INDEX idx_workflows_status ON public.workflows(status);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own or template workflows"
  ON public.workflows FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_template = true OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users insert own workflows"
  ON public.workflows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own workflows"
  ON public.workflows FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users delete own workflows"
  ON public.workflows FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- WORKFLOW RUNS
CREATE TABLE public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- queued | running | success | failed | cancelled
  trigger_source TEXT NOT NULL DEFAULT 'manual', -- manual | schedule | webhook
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB,
  error TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_runs_workflow ON public.workflow_runs(workflow_id, created_at DESC);
CREATE INDEX idx_runs_user ON public.workflow_runs(user_id, created_at DESC);
CREATE INDEX idx_runs_status ON public.workflow_runs(status);

ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own runs"
  ON public.workflow_runs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users insert own runs"
  ON public.workflow_runs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own runs"
  ON public.workflow_runs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'));

-- WORKFLOW RUN STEPS
CREATE TABLE public.workflow_run_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  node_type TEXT NOT NULL,
  node_label TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | running | success | failed | skipped
  input JSONB,
  output JSONB,
  error TEXT,
  duration_ms INTEGER,
  step_index INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_steps_run ON public.workflow_run_steps(run_id, step_index);

ALTER TABLE public.workflow_run_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own run steps"
  ON public.workflow_run_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workflow_runs r
      WHERE r.id = workflow_run_steps.run_id
        AND (r.user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'))
    )
  );

CREATE POLICY "Service inserts run steps"
  ON public.workflow_run_steps FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workflow_runs r
      WHERE r.id = workflow_run_steps.run_id
        AND r.user_id = auth.uid()
    )
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_run_steps;
