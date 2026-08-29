-- Alter assets table to add media_url column
ALTER TABLE assets ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Create the public assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Row Level Security (RLS) Policies for the assets bucket
-- 1. Allow public select access to assets bucket files
CREATE POLICY "Allow public select access to assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

-- 2. Allow public insert access to assets bucket files
CREATE POLICY "Allow public insert access to assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets');
