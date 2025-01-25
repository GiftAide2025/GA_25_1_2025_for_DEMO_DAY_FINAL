/*
  # Fix Recipients Table and Policies

  1. Changes
    - Drop and recreate table if needed
    - Safely create policies
    - Add indexes for performance

  2. Security
    - Enable RLS
    - Add policies for all CRUD operations
*/

-- First, check if we need to recreate the table
DO $$ 
BEGIN
  -- Drop the table if it exists but has wrong structure
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'allrecipientdata'
  ) THEN
    DROP TABLE public.AllRecipientData;
  END IF;
END $$;

-- Create the table with proper structure
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_allrecipientdata_user_id ON public.AllRecipientData(user_id);
CREATE INDEX IF NOT EXISTS idx_allrecipientdata_birthdate ON public.AllRecipientData(birthdate);

-- Enable RLS
ALTER TABLE public.AllRecipientData ENABLE ROW LEVEL SECURITY;

-- Safely create or update policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can insert own recipients" ON public.AllRecipientData;
  DROP POLICY IF EXISTS "Users can read own recipients" ON public.AllRecipientData;
  DROP POLICY IF EXISTS "Users can update own recipients" ON public.AllRecipientData;
  DROP POLICY IF EXISTS "Users can delete own recipients" ON public.AllRecipientData;

  -- Create new policies
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
END $$;