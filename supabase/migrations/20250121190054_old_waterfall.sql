/*
  # Authentication Setup

  1. Security
    - Enable RLS on auth.users
    - Add policies for user management
    
  2. Changes
    - Add profile management policies
    - Set up secure authentication rules
*/

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);