-- This SQL script creates the necessary tables for authentication and game progress
-- Run this in your Supabase SQL editor to set up the database schema

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  is_parent BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Game progress table
CREATE TABLE IF NOT EXISTS game_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed_words TEXT[] NOT NULL DEFAULT '{}',
  accuracy JSONB NOT NULL DEFAULT '{}',
  level INTEGER NOT NULL DEFAULT 1,
  badges TEXT[] NOT NULL DEFAULT '{}',
  last_played TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Parent-child relationships
CREATE TABLE IF NOT EXISTS parent_child_relationships (
  id SERIAL PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(parent_id, child_id)
);

-- Custom challenges
CREATE TABLE IF NOT EXISTS custom_challenges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  word_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Challenge assignments
CREATE TABLE IF NOT EXISTS challenge_assignments (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER NOT NULL REFERENCES custom_challenges(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(challenge_id, assigned_to)
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_assignments ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Parents can view profiles of their children"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships
      WHERE parent_id = auth.uid() AND child_id = user_profiles.id
    )
  );

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Game progress policies
CREATE POLICY "Users can view their own progress"
  ON game_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can view progress of their children"
  ON game_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_relationships
      WHERE parent_id = auth.uid() AND child_id = game_progress.user_id
    )
  );

CREATE POLICY "Users can update their own progress"
  ON game_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON game_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Parent-child relationship policies
CREATE POLICY "Parents can view their child relationships"
  ON parent_child_relationships FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create child relationships"
  ON parent_child_relationships FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can delete child relationships"
  ON parent_child_relationships FOR DELETE
  USING (auth.uid() = parent_id);

-- Custom challenges policies
CREATE POLICY "Users can view challenges created by them"
  ON custom_challenges FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view challenges assigned to them"
  ON custom_challenges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenge_assignments
      WHERE challenge_id = custom_challenges.id AND assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can create their own challenges"
  ON custom_challenges FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own challenges"
  ON custom_challenges FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own challenges"
  ON custom_challenges FOR DELETE
  USING (auth.uid() = created_by);

-- Challenge assignments policies
CREATE POLICY "Users can view their assignments"
  ON challenge_assignments FOR SELECT
  USING (auth.uid() = assigned_to);

CREATE POLICY "Challenge creators can view assignments"
  ON challenge_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_challenges
      WHERE id = challenge_assignments.challenge_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Challenge creators can create assignments"
  ON challenge_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_challenges
      WHERE id = challenge_assignments.challenge_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own assignments"
  ON challenge_assignments FOR UPDATE
  USING (auth.uid() = assigned_to);

-- Create functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_game_progress_updated_at
  BEFORE UPDATE ON game_progress
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();
