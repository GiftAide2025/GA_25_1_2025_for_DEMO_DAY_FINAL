/*
  # Fix Recipients Table Structure

  1. Changes
    - Create table with proper structure
    - Add indexes for performance
    - Set up RLS policies
    - Grant permissions

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Restrict access to authenticated users
*/

-- Create the table with proper structure
CREATE TABLE IF NOT EXISTS public.recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  birthdate date NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_recipients_user_id ON public.recipients(user_id);
CREATE INDEX idx_recipients_birthdate ON public.recipients(birthdate);

-- Enable Row Level Security
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Users can insert own recipients"
  ON public.recipients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own recipients"
  ON public.recipients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recipients"
  ON public.recipients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipients"
  ON public.recipients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.recipients TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;