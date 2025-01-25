/*
  # Enable Google OAuth Provider
  
  1. Changes
    - Enable Google OAuth provider for authentication
    - Add email configuration for Google SMTP
*/

-- Enable the Google OAuth provider
CREATE OR REPLACE FUNCTION auth.enable_google() RETURNS void AS $$
BEGIN
  INSERT INTO auth.providers (provider_id, provider_display_name)
  VALUES ('google', 'Google')
  ON CONFLICT (provider_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

SELECT auth.enable_google();

-- Configure email settings
UPDATE auth.config
SET email_template = jsonb_set(
  email_template,
  '{provider}',
  '"gmail"'::jsonb
);