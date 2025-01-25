/*
  # Fix Recipients Table Structure

  1. Changes
    - Drop and recreate table with proper structure
    - Add proper constraints and indexes
    - Set up RLS policies
    - Grant permissions

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Restrict access to authenticated users
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS public.AllRecipientData CASCADE;

-- Create the table with proper structure
CREATE TABLE public.AllRecipientData (
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
CREATE INDEX idx_allrecipientdata_user_id ON public.AllRecipientData(user_id);
CREATE INDEX idx_allrecipientdata_birthdate ON public.AllRecipientData(birthdate);

-- Enable Row Level Security
ALTER TABLE public.AllRecipientData ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Users can insert own recipients"
  ON public.AllRecipientData
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own recipients"
  ON public.AllRecipientData
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recipients"
  ON public.AllRecipientData
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipients"
  ON public.AllRecipientData
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.AllRecipientData TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;