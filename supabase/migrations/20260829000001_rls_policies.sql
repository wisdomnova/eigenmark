-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE licensing_agreements ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT) for everyone, since this is a public rights ledger
CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access on assets" ON assets FOR SELECT USING (true);
CREATE POLICY "Allow public read access on licensing_agreements" ON licensing_agreements FOR SELECT USING (true);

-- Restrict write permissions (INSERT, UPDATE, DELETE) to admin/service role (bypassed automatically by server-side clients)
-- This blocks public anonymous inserts/updates through client-side REST interfaces.
