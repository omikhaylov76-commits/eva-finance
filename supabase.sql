-- ============================================
-- EVA Finance — Supabase schema
-- Применить в SQL Editor нового Supabase проекта
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS transactions (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('income','expense')),
  amount numeric(12,2) NOT NULL,
  cat text,
  emoji text,
  "desc" text,
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tx_user_date ON transactions (user_id, date DESC);

CREATE TABLE IF NOT EXISTS goals (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  emoji text,
  target numeric(12,2) NOT NULL,
  saved numeric(12,2) NOT NULL DEFAULT 0,
  "createdAt" timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals (user_id);

CREATE TABLE IF NOT EXISTS category_limits (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  category text NOT NULL,
  amount numeric(12,2) NOT NULL,
  emoji text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lim_user ON category_limits (user_id);

ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_limits  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon all transactions" ON transactions;
CREATE POLICY "anon all transactions" ON transactions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all goals" ON goals;
CREATE POLICY "anon all goals" ON goals FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all limits" ON category_limits;
CREATE POLICY "anon all limits" ON category_limits FOR ALL TO anon USING (true) WITH CHECK (true);
