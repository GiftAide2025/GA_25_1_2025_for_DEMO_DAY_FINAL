/*
  # Create Recipients Table and Policies

  1. New Tables
    - `AllRecipientData`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `relationship` (text)
      - `birthdate` (date)
      - `interests` (text array)
      - `notes` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Create policies for CRUD operations
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.AllRecipientData;

-- Create recipients table
CREATE TABLE public.AllRecipientData (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  birthdate date NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.AllRecipientData ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own recipients" ON public.AllRecipientData
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own recipients" ON public.AllRecipientData
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recipients" ON public.AllRecipientData
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipients" ON public.AllRecipientData
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);