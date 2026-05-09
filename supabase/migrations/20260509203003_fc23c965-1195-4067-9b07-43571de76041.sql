
-- Wallet
CREATE TABLE public.wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  balance integer NOT NULL DEFAULT 50,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read wallet" ON public.wallet FOR SELECT USING (true);
CREATE POLICY "public insert wallet" ON public.wallet FOR INSERT WITH CHECK (true);
CREATE POLICY "public update wallet" ON public.wallet FOR UPDATE USING (true);
CREATE TRIGGER wallet_set_updated_at BEFORE UPDATE ON public.wallet FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Credit transactions
CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  agent_id uuid,
  run_id uuid,
  amount integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read credit_transactions" ON public.credit_transactions FOR SELECT USING (true);
CREATE POLICY "public insert credit_transactions" ON public.credit_transactions FOR INSERT WITH CHECK (true);

-- Agent reports
CREATE TABLE public.agent_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  agent_id uuid,
  run_id uuid,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'plan',
  content_md text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read agent_reports" ON public.agent_reports FOR SELECT USING (true);
CREATE POLICY "public insert agent_reports" ON public.agent_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "public update agent_reports" ON public.agent_reports FOR UPDATE USING (true);
CREATE POLICY "public delete agent_reports" ON public.agent_reports FOR DELETE USING (true);

-- Scheduled posts approval status
ALTER TABLE public.scheduled_posts ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved';
