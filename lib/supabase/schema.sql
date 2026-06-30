-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ticker text NOT NULL UNIQUE,
  sector text,
  industry text,
  created_at timestamptz DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  ticker text NOT NULL,
  company_name text NOT NULL,
  recommendation text NOT NULL CHECK (recommendation IN ('INVEST', 'PASS')),
  score integer NOT NULL,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Agent logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  status text NOT NULL,
  output jsonb,
  duration_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_ticker ON reports(ticker);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_report_id ON agent_logs(report_id);

-- Enable RLS (optional — remove if not using auth)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for this assignment)
CREATE POLICY "Public read" ON reports FOR SELECT USING (true);
CREATE POLICY "Public insert" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON companies FOR SELECT USING (true);
CREATE POLICY "Public insert" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON agent_logs FOR SELECT USING (true);
CREATE POLICY "Public insert" ON agent_logs FOR INSERT WITH CHECK (true);
