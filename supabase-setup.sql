-- ═══════════════════════════════════════════════════════════════
-- Supabase Table: project_requests
-- Purpose: Stores all project proposals from portfolio visitors
-- 
-- HOW TO RUN:
-- 1. Go to https://supabase.com/dashboard → select your project
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file and click "Run"
-- ═══════════════════════════════════════════════════════════════

-- Create the project_requests table
CREATE TABLE IF NOT EXISTS project_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    project_type TEXT NOT NULL,
    budget TEXT NOT NULL,
    timeline TEXT NOT NULL,
    brief TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the anon key (your backend uses this)
DROP POLICY IF EXISTS "Allow insert from backend" ON project_requests;
CREATE POLICY "Allow insert from backend"
    ON project_requests FOR INSERT
    WITH CHECK (true);

-- Allow reads from the anon key (so you can view data from dashboard & API)
DROP POLICY IF EXISTS "Allow read from backend" ON project_requests;
CREATE POLICY "Allow read from backend"
    ON project_requests FOR SELECT
    USING (true);

-- ═══════════════════════════════════════════════════════════════
-- ✅ Done! Your table is ready.
-- You can view all proposals at:
-- Dashboard → Table Editor → project_requests
-- ═══════════════════════════════════════════════════════════════
