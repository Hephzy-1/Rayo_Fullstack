-- ============================================================
--  Rayo AI — Supabase PostgreSQL Schema
--  Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
--  TABLES
-- ============================================================

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- accounts
CREATE TABLE IF NOT EXISTS public.accounts (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('checking', 'savings')),
  balance    numeric(15,2) NOT NULL DEFAULT 0,
  currency   text NOT NULL DEFAULT 'NGN',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id  uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount      numeric(15,2) NOT NULL CHECK (amount > 0),
  category    text NOT NULL DEFAULT 'Other',
  description text,
  type        text NOT NULL CHECK (type IN ('credit', 'debit')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- savings
CREATE TABLE IF NOT EXISTS public.savings (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_saved_amount numeric(15,2) NOT NULL DEFAULT 0,
  target_amount     numeric(15,2),
  label             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ai_insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message    text NOT NULL,
  type       text NOT NULL CHECK (type IN ('tip', 'alert', 'achievement')),
  read       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
--  INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_accounts_user_id       ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id   ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account   ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created   ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id    ON public.ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_read       ON public.ai_insights(user_id, read);

-- ============================================================
--  AUTO-UPDATE updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_savings_updated_at
  BEFORE UPDATE ON public.savings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
--  AUTO-CREATE PROFILE + ACCOUNTS ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default checking account
  INSERT INTO public.accounts (user_id, type, balance)
  VALUES (NEW.id, 'checking', 0);

  -- Create default savings account
  INSERT INTO public.accounts (user_id, type, balance)
  VALUES (NEW.id, 'savings', 0);

  -- Create savings record
  INSERT INTO public.savings (user_id, auto_saved_amount, target_amount, label)
  VALUES (NEW.id, 0, 50000, 'Smart Stash')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights  ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────────────

CREATE POLICY "profiles: users can view own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profiles: users can insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles: users can update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles: users can delete own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ── accounts ──────────────────────────────────────────────

CREATE POLICY "accounts: users can view own"
  ON public.accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "accounts: users can insert own"
  ON public.accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts: users can update own"
  ON public.accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts: users can delete own"
  ON public.accounts FOR DELETE
  USING (auth.uid() = user_id);

-- ── transactions ──────────────────────────────────────────

CREATE POLICY "transactions: users can view own"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "transactions: users can insert own"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Transactions are immutable — no UPDATE/DELETE policies

-- ── savings ───────────────────────────────────────────────

CREATE POLICY "savings: users can view own"
  ON public.savings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "savings: users can insert own"
  ON public.savings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "savings: users can update own"
  ON public.savings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── ai_insights ───────────────────────────────────────────

CREATE POLICY "insights: users can view own"
  ON public.ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insights: users can insert own"
  ON public.ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "insights: users can update own (mark read)"
  ON public.ai_insights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
--  SEED DATA (for testing — replace USER_UUID with a real id)
-- ============================================================

-- Uncomment and replace USER_UUID after creating a test account:

/*
DO $$
DECLARE
  v_user_id    uuid := 'USER_UUID';
  v_checking   uuid;
  v_savings    uuid;
BEGIN
  -- Get account IDs
  SELECT id INTO v_checking FROM public.accounts
    WHERE user_id = v_user_id AND type = 'checking' LIMIT 1;
  SELECT id INTO v_savings FROM public.accounts
    WHERE user_id = v_user_id AND type = 'savings' LIMIT 1;

  -- Seed balances
  UPDATE public.accounts SET balance = 127500 WHERE id = v_checking;
  UPDATE public.accounts SET balance = 32400  WHERE id = v_savings;
  UPDATE public.savings SET auto_saved_amount = 32400 WHERE user_id = v_user_id;

  -- Seed transactions
  INSERT INTO public.transactions (user_id, account_id, amount, category, description, type) VALUES
    (v_user_id, v_checking, 150000, 'Salary',        'Monthly salary — Acme Ltd',     'credit'),
    (v_user_id, v_checking,   3500, 'Food',           'Suya spot — Wuse Market',       'debit'),
    (v_user_id, v_checking,   2000, 'Transport',      'Bolt ride — Lekki to VI',       'debit'),
    (v_user_id, v_checking,   5000, 'Entertainment',  'Netflix subscription',          'debit'),
    (v_user_id, v_checking,   1250, 'Savings',        'Smart Stash auto-save',         'debit'),
    (v_user_id, v_savings,    1250, 'Savings',        'Smart Stash transfer in',       'credit'),
    (v_user_id, v_checking,   8000, 'Utilities',      'DSTV + Electricity',            'debit'),
    (v_user_id, v_checking,  12000, 'Food',           'Grocery run — Shoprite',        'debit');

  -- Seed AI insights
  INSERT INTO public.ai_insights (user_id, message, type) VALUES
    (v_user_id, 'You spend 28% more on food on weekends. Want me to set a weekend food budget?', 'tip'),
    (v_user_id, 'Great job! You''ve saved ₦32,400 this month — that''s a personal record! 🎉', 'achievement'),
    (v_user_id, 'Your Netflix subscription renews in 3 days (₦5,000). You have enough to cover it.', 'alert');

END $$;
*/
