/*
  # Create x01 game tables

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `game_type` (text) - e.g., 'x01'
      - `variant` (integer) - e.g., 501
      - `total_legs` (integer)
      - `total_sets` (integer)
      - `current_round` (integer)
      - `created_by` (uuid)
      - `winner_id` (uuid)
      - `status` (text)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

    - `game_participants`
      - `id` (uuid, primary key)
      - `game_id` (uuid)
      - `player_id` (uuid)
      - `score` (integer)
      - `darts_thrown` (integer)
      - `is_active` (boolean)
      - `won` (boolean)
      - `created_at` (timestamptz)
      - `checkout_percentage` (numeric)
      - `final_position` (integer)
      - `checkout_attempts` (integer)
      - `checkout_successes` (integer)
      - `darts_in_leg` (integer)
      - `total_score_in_leg` (integer)
      - `variant` (integer)
      - `total_score_thrown` (integer)
      - `starting_score` (integer)
      - `current_score` (integer)
      - `turn_scores` (integer[])
      - `legs_won` (integer)
      - `sets_won` (integer)
      - `leg_average` (numeric)
      - `game_average` (numeric)
      - `darts_thrown_in_leg` (integer)
      - `highest_checkout` (integer)
      - `one_eighties` (integer)
      - `sixty_plus` (integer)
      - `eighty_plus` (integer)
      - `ton_plus` (integer)
      - `ton_forty_plus` (integer)
      - `first_nine` (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type text NOT NULL,
  variant integer NOT NULL DEFAULT 501,
  total_legs integer NOT NULL DEFAULT 1,
  total_sets integer NOT NULL DEFAULT 1,
  current_round integer DEFAULT 1,
  created_by uuid REFERENCES profiles(id),
  winner_id uuid REFERENCES players(id),
  status text NOT NULL DEFAULT 'in_progress',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT games_status_check CHECK (status IN ('in_progress', 'completed', 'cancelled'))
);

-- Enable RLS on games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create game participants table
CREATE TABLE IF NOT EXISTS game_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id),
  score integer DEFAULT 0,
  darts_thrown integer DEFAULT 0,
  is_active boolean DEFAULT true,
  won boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  checkout_percentage numeric DEFAULT 0,
  final_position integer,
  checkout_attempts integer DEFAULT 0,
  checkout_successes integer DEFAULT 0,
  darts_in_leg integer DEFAULT 0,
  total_score_in_leg integer DEFAULT 0,
  variant integer DEFAULT 501,
  total_score_thrown integer DEFAULT 0,
  starting_score integer DEFAULT 501,
  current_score integer DEFAULT 501,
  turn_scores integer[] DEFAULT ARRAY[]::integer[],
  legs_won integer DEFAULT 0,
  sets_won integer DEFAULT 0,
  leg_average numeric DEFAULT 0,
  game_average numeric DEFAULT 0,
  darts_thrown_in_leg integer DEFAULT 0,
  highest_checkout integer DEFAULT 0,
  one_eighties integer DEFAULT 0,
  sixty_plus integer DEFAULT 0,
  eighty_plus integer DEFAULT 0,
  ton_plus integer DEFAULT 0,
  ton_forty_plus integer DEFAULT 0,
  first_nine numeric DEFAULT 0,
  UNIQUE(game_id, player_id)
);

-- Enable RLS on game_participants
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for games
CREATE POLICY "Anyone can view completed games"
  ON games
  FOR SELECT
  USING (status = 'completed');

CREATE POLICY "Creator can manage their games"
  ON games
  FOR ALL
  USING (uid() = created_by)
  WITH CHECK (uid() = created_by);

-- Create RLS policies for game_participants
CREATE POLICY "Anyone can view game participants"
  ON game_participants
  FOR SELECT
  USING (true);

CREATE POLICY "Creator can manage game participants"
  ON game_participants
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM games
    WHERE games.id = game_participants.game_id
    AND games.created_by = uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM games
    WHERE games.id = game_participants.game_id
    AND games.created_by = uid()
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_game_participants_game_id ON game_participants(game_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_player_id ON game_participants(player_id);

-- Create unique index to ensure a player can only be active in one game at a time
CREATE UNIQUE INDEX IF NOT EXISTS one_active_game_per_player ON game_participants(player_id) WHERE (is_active = true);