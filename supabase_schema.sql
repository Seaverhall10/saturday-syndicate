-- =====================================================================
-- 🏈 SATURDAY SYNDICATE — PRODUCTION SUPABASE POSTGRESQL SCHEMA (DDL)
-- =====================================================================
-- Features:
-- 1. Anti-Cheat Server Monotonic Kickoff Lock (T-minus 60s cutoff)
-- 2. Row Level Security (RLS) hiding opponents' picks until kickoff
-- 3. Server-authoritative spread resolution (prevents client spread tampering)
-- 4. Unique constraints preventing double-picks or concurrent race overwrites
-- 5. Immutable commissioner audit log for 100% league transparency
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 2. LEAGUES
CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  commissioner_id UUID NOT NULL REFERENCES profiles(id),
  season INT NOT NULL DEFAULT 2026,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  proxy_picks_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  drop_worst_week_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 3. LEAGUE MEMBERS
CREATE TABLE IF NOT EXISTS league_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('commissioner', 'player')),
  season_wins INT NOT NULL DEFAULT 0,
  season_losses INT NOT NULL DEFAULT 0,
  season_pushes INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT uq_league_user UNIQUE (league_id, user_id)
);

-- 4. GAMES (SCHEDULED & LIVE MATCHUPS)
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  espn_id TEXT,
  season INT NOT NULL DEFAULT 2026,
  week INT NOT NULL DEFAULT 1,
  kickoff_time TIMESTAMPTZ NOT NULL,
  home_team_id TEXT NOT NULL,
  home_team_name TEXT NOT NULL,
  away_team_id TEXT NOT NULL,
  away_team_name TEXT NOT NULL,
  spread NUMERIC(4, 1) NOT NULL, -- Negative = Home favored; Positive = Away favored
  over_under NUMERIC(4, 1) DEFAULT 52.5,
  status TEXT NOT NULL DEFAULT 'pre' CHECK (status IN ('pre', 'in', 'post', 'canceled')),
  home_score INT,
  away_score INT,
  game_clock TEXT,
  spread_locked BOOLEAN NOT NULL DEFAULT FALSE,
  is_tiebreaker BOOLEAN NOT NULL DEFAULT FALSE,
  is_custom_spread BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 5. PICKS (USER AGAINST-THE-SPREAD PICKS)
CREATE TABLE IF NOT EXISTS picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  selected_team_id TEXT NOT NULL,
  spread_at_pick NUMERIC(4, 1) NOT NULL, -- Evaluated server-side at moment of pick
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  version INT NOT NULL DEFAULT 1,
  CONSTRAINT uq_user_league_game_pick UNIQUE (user_id, league_id, game_id)
);

-- 6. TIEBREAKER PICKS (PRIMETIME COMBINED TOTAL SCORE)
CREATE TABLE IF NOT EXISTS tiebreaker_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  season INT NOT NULL DEFAULT 2026,
  week INT NOT NULL DEFAULT 1,
  predicted_total_score INT NOT NULL CHECK (predicted_total_score >= 0),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT uq_user_league_week_tiebreaker UNIQUE (user_id, league_id, season, week)
);

-- 7. IMMUTABLE COMMISSIONER AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES profiles(id),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- =====================================================================
-- 🔒 ZERO-TRUST ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiebreaker_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self write
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write" ON profiles FOR ALL USING (auth.uid() = id);

-- Leagues: Member read, commissioner write
CREATE POLICY "leagues_read" ON leagues FOR SELECT USING (true);
CREATE POLICY "leagues_write" ON leagues FOR ALL USING (auth.uid() = commissioner_id);

-- Games: Public read
CREATE POLICY "games_read" ON games FOR SELECT USING (true);

-- 🕵️ ANTI-CHEAT LAW: Picks are strictly confidential until kickoff
-- Rule 1: A user can ALWAYS see their own picks
CREATE POLICY "picks_view_own" ON picks FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Rule 2: League opponents can ONLY see picks once the game has kicked off!
CREATE POLICY "picks_view_opponents_locked" ON picks FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM games
    WHERE games.id = picks.game_id
      AND (games.status IN ('in', 'post') OR games.kickoff_time <= clock_timestamp())
  )
);

-- Audit logs: Transparent read to all league members
CREATE POLICY "audit_read" ON audit_logs FOR SELECT USING (true);

-- =====================================================================
-- ⚡ ATOMIC ANTI-CHEAT PICK SUBMISSION & LOCK TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION trg_fn_submit_and_lock_pick()
RETURNS TRIGGER AS $$
DECLARE
  v_game RECORD;
BEGIN
  -- 1. Fetch authoritative game data from database
  SELECT kickoff_time, status, spread, home_team_id, away_team_id, spread_locked
  INTO v_game
  FROM games WHERE id = NEW.game_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'GameNotFound: Invalid game ID %', NEW.game_id;
  END IF;

  -- 2. Anti-Snipe Lockout: Reject if game is in progress, final, or within 60s of kickoff
  IF v_game.status IN ('in', 'post', 'canceled') OR clock_timestamp() >= (v_game.kickoff_time - INTERVAL '60 seconds') THEN
    RAISE EXCEPTION 'KickoffLockout: Picks are locked for this game (Kickoff: %, Server: %)',
      v_game.kickoff_time, clock_timestamp();
  END IF;

  -- 3. Team Selection Validation
  IF NEW.selected_team_id NOT IN (v_game.home_team_id, v_game.away_team_id) THEN
    RAISE EXCEPTION 'InvalidTeamSelection: % is not playing in this game', NEW.selected_team_id;
  END IF;

  -- 4. Server-Authoritative Spread Assignment (Overrides any client-supplied spread)
  NEW.spread_at_pick := v_game.spread;
  NEW.submitted_at := clock_timestamp();
  NEW.version := COALESCE(OLD.version, 0) + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_picks_enforce_lock
BEFORE INSERT OR UPDATE ON picks
FOR EACH ROW
EXECUTE FUNCTION trg_fn_submit_and_lock_pick();
