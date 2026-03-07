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
CREATE TABLE IF NOT EXISTS rayo_ai.profiles (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- accounts
CREATE TABLE IF NOT EXISTS rayo_ai.accounts (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('checking', 'savings')),
  balance    numeric(15,2) NOT NULL DEFAULT 0,
  currency   text NOT NULL DEFAULT 'NGN',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- transactions
CREATE TABLE IF NOT EXISTS rayo_ai.transactions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id  uuid NOT NULL REFERENCES rayo_ai.accounts(id) ON DELETE CASCADE,
  amount      numeric(15,2) NOT NULL CHECK (amount > 0),
  category    text NOT NULL DEFAULT 'Other',
  description text,
  type        text NOT NULL CHECK (type IN ('credit', 'debit')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- savings
CREATE TABLE IF NOT EXISTS rayo_ai.savings (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_saved_amount numeric(15,2) NOT NULL DEFAULT 0,
  target_amount     numeric(15,2),
  label             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ai_insights
CREATE TABLE IF NOT EXISTS rayo_ai.ai_insights (
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

CREATE INDEX IF NOT EXISTS idx_accounts_user_id       ON rayo_ai.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id   ON rayo_ai.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account   ON rayo_ai.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created   ON rayo_ai.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id    ON rayo_ai.ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_read       ON rayo_ai.ai_insights(user_id, read);

-- ============================================================
--  AUTO-UPDATE updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION rayo_ai.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON rayo_ai.profiles
  FOR EACH ROW EXECUTE FUNCTION rayo_ai.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON rayo_ai.accounts
  FOR EACH ROW EXECUTE FUNCTION rayo_ai.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_savings_updated_at
  BEFORE UPDATE ON rayo_ai.savings
  FOR EACH ROW EXECUTE FUNCTION rayo_ai.handle_updated_at();

-- ============================================================
--  AUTO-CREATE PROFILE + ACCOUNTS ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION rayo_ai.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO rayo_ai.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default checking account
  INSERT INTO rayo_ai.accounts (user_id, type, balance)
  VALUES (NEW.id, 'checking', 0);

  -- Create default savings account
  INSERT INTO rayo_ai.accounts (user_id, type, balance)
  VALUES (NEW.id, 'savings', 0);

  -- Create savings record
  INSERT INTO rayo_ai.savings (user_id, auto_saved_amount, target_amount, label)
  VALUES (NEW.id, 0, 50000, 'Smart Stash')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION rayo_ai.handle_new_user();

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE rayo_ai.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE rayo_ai.accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE rayo_ai.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rayo_ai.savings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE rayo_ai.ai_insights  ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────────────

CREATE POLICY "profiles: users can view own"
  ON rayo_ai.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profiles: users can insert own"
  ON rayo_ai.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles: users can update own"
  ON rayo_ai.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles: users can delete own"
  ON rayo_ai.profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ── accounts ──────────────────────────────────────────────

CREATE POLICY "accounts: users can view own"
  ON rayo_ai.accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "accounts: users can insert own"
  ON rayo_ai.accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts: users can update own"
  ON rayo_ai.accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts: users can delete own"
  ON rayo_ai.accounts FOR DELETE
  USING (auth.uid() = user_id);

-- ── transactions ──────────────────────────────────────────

CREATE POLICY "transactions: users can view own"
  ON rayo_ai.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "transactions: users can insert own"
  ON rayo_ai.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Transactions are immutable — no UPDATE/DELETE policies

-- ── savings ───────────────────────────────────────────────

CREATE POLICY "savings: users can view own"
  ON rayo_ai.savings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "savings: users can insert own"
  ON rayo_ai.savings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "savings: users can update own"
  ON rayo_ai.savings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── ai_insights ───────────────────────────────────────────

CREATE POLICY "insights: users can view own"
  ON rayo_ai.ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insights: users can insert own"
  ON rayo_ai.ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "insights: users can update own (mark read)"
  ON rayo_ai.ai_insights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- Create the waitlist table
CREATE TABLE IF NOT EXISTS rayo_ai.waitlist (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name  text NOT NULL,
  email      text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE rayo_ai.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone (unauthenticated) to insert
CREATE POLICY "waitlist: anyone can join"
  ON rayo_ai.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
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
  SELECT id INTO v_checking FROM rayo_ai.accounts
    WHERE user_id = v_user_id AND type = 'checking' LIMIT 1;
  SELECT id INTO v_savings FROM rayo_ai.accounts
    WHERE user_id = v_user_id AND type = 'savings' LIMIT 1;

  -- Seed balances
  UPDATE rayo_ai.accounts SET balance = 127500 WHERE id = v_checking;
  UPDATE rayo_ai.accounts SET balance = 32400  WHERE id = v_savings;
  UPDATE rayo_ai.savings SET auto_saved_amount = 32400 WHERE user_id = v_user_id;

  -- Seed transactions
  INSERT INTO rayo_ai.transactions (user_id, account_id, amount, category, description, type) VALUES
    (v_user_id, v_checking, 150000, 'Salary',        'Monthly salary — Acme Ltd',     'credit'),
    (v_user_id, v_checking,   3500, 'Food',           'Suya spot — Wuse Market',       'debit'),
    (v_user_id, v_checking,   2000, 'Transport',      'Bolt ride — Lekki to VI',       'debit'),
    (v_user_id, v_checking,   5000, 'Entertainment',  'Netflix subscription',          'debit'),
    (v_user_id, v_checking,   1250, 'Savings',        'Smart Stash auto-save',         'debit'),
    (v_user_id, v_savings,    1250, 'Savings',        'Smart Stash transfer in',       'credit'),
    (v_user_id, v_checking,   8000, 'Utilities',      'DSTV + Electricity',            'debit'),
    (v_user_id, v_checking,  12000, 'Food',           'Grocery run — Shoprite',        'debit');

  -- Seed AI insights
  INSERT INTO rayo_ai.ai_insights (user_id, message, type) VALUES
    (v_user_id, 'You spend 28% more on food on weekends. Want me to set a weekend food budget?', 'tip'),
    (v_user_id, 'Great job! You''ve saved ₦32,400 this month — that''s a personal record! 🎉', 'achievement'),
    (v_user_id, 'Your Netflix subscription renews in 3 days (₦5,000). You have enough to cover it.', 'alert');

END $$;
*/
