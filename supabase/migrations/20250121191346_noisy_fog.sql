/*
  # Create Recipients Table

  1. New Tables
    - `AllRecipientData`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `relationship` (text)
      - `birthdate` (date)
      - `interests` (text[])
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for user data management
*/

-- Create recipients table
CREATE TABLE IF NOT EXISTS AllRecipientData (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL,
  birthdate date NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE AllRecipientData ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own recipients" ON AllRecipientData
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own recipients" ON AllRecipientData
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own recipients" ON AllRecipientData
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own data
CREATE POLICY "Users can delete own recipients" ON AllRecipientData
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);