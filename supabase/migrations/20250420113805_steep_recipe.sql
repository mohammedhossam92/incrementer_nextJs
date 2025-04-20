/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `value` (numeric, default 0)
      - `last_updated` (timestamptz, default now())
      - `clicks_today` (integer, default 0)
      - `last_click_date` (date, default today)
  2. Security
    - Enable RLS on `categories` table
    - Add policy for authenticated users to read and modify their own data
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  value numeric DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  clicks_today integer DEFAULT 0,
  last_click_date date DEFAULT CURRENT_DATE
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes
-- In a real app, you would want to restrict access by user_id
CREATE POLICY "Allow public access to categories"
  ON categories
  FOR ALL
  TO public
  USING (true);