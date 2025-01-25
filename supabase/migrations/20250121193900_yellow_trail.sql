/*
  # Create Recipients Table with Safe Policy Creation

  1. New Tables
    - `AllRecipientData` (if not exists)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `relationship` (text) 
      - `birthdate` (date)
      - `interests` (text array)
      - `notes` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on table
    - Safely create policies for authenticated users
*/

-- Create recipients table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.AllRecipientData (
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

-- Safely create policies using DO blocks
DO $$ 
BEGIN
  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'allrecipientdata' 
    AND policyname = 'Users can insert own recipients'
  ) THEN
    CREATE POLICY "Users can insert own recipients" ON public.AllRecipientData
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'allrecipientdata' 
    AND policyname = 'Users can read own recipients'
  ) THEN
    CREATE POLICY "Users can read own recipients" ON public.AllRecipientData
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'allrecipientdata' 
    AND policyname = 'Users can update own recipients'
  ) THEN
    CREATE POLICY "Users can update own recipients" ON public.AllRecipientData
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'allrecipientdata' 
    AND policyname = 'Users can delete own recipients'
  ) THEN
    CREATE POLICY "Users can delete own recipients" ON public.AllRecipientData
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;