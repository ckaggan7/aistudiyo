
-- 1. Add columns to credit_transactions
ALTER TABLE public.credit_transactions
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'debit',
  ADD COLUMN IF NOT EXISTS actor_id uuid;

-- 2. Tighten wallet RLS
DROP POLICY IF EXISTS "public insert wallet" ON public.wallet;
DROP POLICY IF EXISTS "public read wallet" ON public.wallet;
DROP POLICY IF EXISTS "public update wallet" ON public.wallet;

CREATE POLICY "Users read own wallet" ON public.wallet
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users insert own wallet" ON public.wallet
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own wallet" ON public.wallet
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- 3. Tighten credit_transactions RLS
DROP POLICY IF EXISTS "public insert credit_transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "public read credit_transactions" ON public.credit_transactions;

CREATE POLICY "Users read own credit_transactions" ON public.credit_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users insert own credit_transactions" ON public.credit_transactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- 4. Update handle_new_user to also create wallet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  -- Wallet with 50 starter credits
  INSERT INTO public.wallet (user_id, balance) VALUES (NEW.id, 50);
  INSERT INTO public.credit_transactions (user_id, amount, reason, type)
    VALUES (NEW.id, 50, 'Welcome bonus', 'credit');

  RETURN NEW;
END;
$function$;

-- 5. Backfill wallets for existing users
INSERT INTO public.wallet (user_id, balance)
SELECT p.user_id, 50
FROM public.profiles p
LEFT JOIN public.wallet w ON w.user_id = p.user_id
WHERE w.id IS NULL;

-- 6. Admin-only credit adjustment function
CREATE OR REPLACE FUNCTION public.adjust_user_credits(_user_id uuid, _delta int, _reason text)
RETURNS public.wallet
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _wallet public.wallet;
  _actor uuid := auth.uid();
BEGIN
  IF NOT public.has_role(_actor, 'super_admin') THEN
    RAISE EXCEPTION 'Only super admins can adjust credits';
  END IF;

  -- Ensure wallet exists
  INSERT INTO public.wallet (user_id, balance)
  VALUES (_user_id, 0)
  ON CONFLICT DO NOTHING;

  UPDATE public.wallet
    SET balance = GREATEST(0, balance + _delta), updated_at = now()
    WHERE user_id = _user_id
    RETURNING * INTO _wallet;

  INSERT INTO public.credit_transactions (user_id, amount, reason, type, actor_id)
  VALUES (_user_id, _delta, COALESCE(_reason, 'Admin adjustment'), 'adjustment', _actor);

  RETURN _wallet;
END;
$$;
