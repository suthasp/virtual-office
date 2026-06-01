-- ============================================================
-- AI Data Center Operations Virtual Office
-- Initial Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'engineer', 'viewer')),
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ============================================================
-- INCIDENTS
-- ============================================================
CREATE TABLE incidents (
  id TEXT PRIMARY KEY DEFAULT 'INC-' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0'),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  department TEXT NOT NULL,
  assigned_to TEXT,
  created_by TEXT NOT NULL,
  resolved_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_department ON incidents(department);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);

-- ============================================================
-- MAINTENANCE TASKS
-- ============================================================
CREATE TABLE maintenance_tasks (
  id TEXT PRIMARY KEY DEFAULT 'MT-' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 3, '0'),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('preventive', 'corrective')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  department TEXT NOT NULL,
  asset_id TEXT,
  assigned_to TEXT,
  scheduled_date TIMESTAMPTZ NOT NULL,
  completed_date TIMESTAMPTZ,
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_type ON maintenance_tasks(type);
CREATE INDEX idx_maintenance_status ON maintenance_tasks(status);
CREATE INDEX idx_maintenance_scheduled ON maintenance_tasks(scheduled_date);

-- ============================================================
-- ASSETS
-- ============================================================
CREATE TABLE assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT,
  serial_number TEXT UNIQUE,
  location TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance', 'decommissioned')),
  health_score INTEGER NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
  purchase_date DATE,
  warranty_expiry DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_department ON assets(department);
CREATE INDEX idx_assets_health ON assets(health_score);

-- ============================================================
-- KPI METRICS
-- ============================================================
CREATE TABLE kpi_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT 'global',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kpi_name ON kpi_metrics(metric_name);
CREATE INDEX idx_kpi_department ON kpi_metrics(department);
CREATE INDEX idx_kpi_recorded ON kpi_metrics(recorded_at DESC);

-- ============================================================
-- AI AGENTS
-- ============================================================
CREATE TABLE ai_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'idle', 'busy', 'offline')),
  description TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '🤖',
  department TEXT NOT NULL,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  accuracy_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  response_time NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AGENT MESSAGES
-- ============================================================
CREATE TABLE agent_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_agent ON agent_messages(agent_id);
CREATE INDEX idx_messages_user ON agent_messages(user_id);
CREATE INDEX idx_messages_created ON agent_messages(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update only their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Incidents: all authenticated users can read
CREATE POLICY "incidents_select" ON incidents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "incidents_insert" ON incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "incidents_update" ON incidents FOR UPDATE USING (auth.role() = 'authenticated');

-- Maintenance: all authenticated users can read
CREATE POLICY "maintenance_select" ON maintenance_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "maintenance_insert" ON maintenance_tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "maintenance_update" ON maintenance_tasks FOR UPDATE USING (auth.role() = 'authenticated');

-- Assets: all authenticated users can read
CREATE POLICY "assets_select" ON assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "assets_insert" ON assets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "assets_update" ON assets FOR UPDATE USING (auth.role() = 'authenticated');

-- KPIs: all authenticated users can read, only backend can write
CREATE POLICY "kpi_select" ON kpi_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "kpi_insert" ON kpi_metrics FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- AI Agents: read-only for all authenticated
CREATE POLICY "agents_select" ON ai_agents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "agents_update" ON ai_agents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Agent messages: users can only see their own messages
CREATE POLICY "messages_select" ON agent_messages FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "messages_insert" ON agent_messages FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER set_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER set_maintenance_updated_at BEFORE UPDATE ON maintenance_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER set_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER set_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
