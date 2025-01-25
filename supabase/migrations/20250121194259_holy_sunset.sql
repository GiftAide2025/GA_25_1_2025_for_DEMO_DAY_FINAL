/*
  # Create Recipients Table and Policies

  1. New Tables
    - `AllRecipientData` - Stores recipient information for gift tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `relationship` (text)
      - `birthdate` (date)
      - `interests` (text array)
      - `notes` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Ensure authenticated users can only access their own data

  3. Performance
    - Add indexes for frequently queried columns
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS public.AllRecipientData CASCADE;

-- Create the table
CREATE TABLE public.AllRecipientData (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  relationship text NOT NULL,
  birthdate date NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_allrecipientdata_user_id ON public.AllRecipientData(user_id);
CREATE INDEX idx_allrecipientdata_birthdate ON public.AllRecipientData(birthdate);

-- Enable Row Level Security
ALTER TABLE public.AllRecipientData ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
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

-- Grant necessary permissions
GRANT ALL ON public.AllRecipientData TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;