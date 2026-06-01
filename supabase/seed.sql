-- ============================================================
-- Seed Data for AI Data Center Operations Virtual Office
-- ============================================================

-- AI Agents
INSERT INTO ai_agents (id, name, type, status, description, avatar, department, tasks_completed, accuracy_rate, response_time) VALUES
  ('agent-noc',       'NOC Agent',              'noc',        'online', 'Monitors network alarms, correlates events, and triggers auto-remediation workflows',                       '🤖', 'NOC',         1247, 97.3, 0.8),
  ('agent-incident',  'Incident Agent',          'incident',   'busy',   'Triages incidents, assigns severity, routes to appropriate teams, and tracks SLA',                          '🚨', 'Operations',   892, 98.1, 1.2),
  ('agent-pm',        'PM Agent',                'pm',         'online', 'Schedules and optimizes preventive maintenance windows based on asset health data',                         '🔧', 'PM Team',      634, 95.8, 2.1),
  ('agent-cm',        'CM Agent',                'cm',         'busy',   'Diagnoses failures, recommends corrective actions, and manages repair workflows',                           '⚡', 'CM Team',      423, 94.2, 1.5),
  ('agent-capacity',  'Capacity Planning Agent', 'capacity',   'online', 'Analyzes growth trends, forecasts capacity needs, and recommends infrastructure scaling',                   '📊', 'Engineering',  312, 96.7, 3.4),
  ('agent-energy',    'Energy Optimization Agent','energy',    'online', 'Monitors PUE, optimizes cooling, and identifies energy efficiency opportunities',                           '💡', 'DC Ops',       567, 97.9, 1.8),
  ('agent-reporting', 'Reporting Agent',         'reporting',  'idle',   'Generates automated reports, dashboards, and executive summaries on demand',                               '📋', 'All',         1089, 99.1, 5.2),
  ('agent-finance',   'Finance Agent',           'finance',    'online', 'Tracks OPEX/CAPEX, cost optimization, budget forecasting, and financial reporting',                        '💰', 'Finance',      278, 98.7, 4.1),
  ('agent-automation','Automation Agent',        'automation', 'busy',   'Designs and executes runbooks, automates repetitive tasks, and manages workflows',                         '⚙️', 'Engineering', 2341, 99.4, 0.5),
  ('agent-exec',      'Executive Assistant',     'executive',  'online', 'Provides executive summaries, strategic insights, and decision support for leadership',                    '🎯', 'War Room',     189, 97.5, 2.8);

-- Assets
INSERT INTO assets (id, name, type, model, serial_number, location, department, status, health_score, purchase_date, warranty_expiry, metadata) VALUES
  ('UPS-A-01',   'UPS Unit A-01',        'UPS',            'Eaton 9PX 10kVA',         'SN-UPS-A01-2021',  'Zone A, Row 1',     'DC Ops', 'online',      96,  '2021-03-15', '2026-03-15', '{"load": 68, "battery_age_months": 36}'),
  ('UPS-A-02',   'UPS Unit A-02',        'UPS',            'Eaton 9PX 10kVA',         'SN-UPS-A02-2021',  'Zone A, Row 2',     'DC Ops', 'online',      94,  '2021-03-15', '2026-03-15', '{"load": 72, "battery_age_months": 36}'),
  ('UPS-A-03',   'UPS Unit A-03',        'UPS',            'Eaton 9PX 10kVA',         'SN-UPS-A03-2021',  'Zone A, Row 3',     'DC Ops', 'offline',     12,  '2021-03-15', '2026-03-15', '{"load": 0, "fault_code": "E-0x14"}'),
  ('UPS-B-01',   'UPS Unit B-01',        'UPS',            'APC Smart-UPS 10kVA',     'SN-UPS-B01-2022',  'Zone B, Row 1',     'DC Ops', 'online',      89,  '2022-01-10', '2027-01-10', '{"load": 65, "battery_age_months": 17}'),
  ('CRAC-A-01',  'CRAC Unit A-01',       'CRAC',           'Liebert DS 20kW',         'SN-CRAC-A01-2020', 'Zone A, End of Row','DC Ops', 'online',      92,  '2020-06-01', '2025-06-01', '{"inlet_temp": 21.2, "return_temp": 32.8}'),
  ('CRAC-B-02',  'CRAC Unit B-02',       'CRAC',           'Liebert DS 20kW',         'SN-CRAC-B02-2020', 'Zone B, End of Row','DC Ops', 'maintenance', 54,  '2020-06-01', '2025-06-01', '{"inlet_temp": 26.4, "return_temp": 35.2, "pressure_warning": true}'),
  ('GEN-01',     'Generator 01',         'Generator',      'Caterpillar C175',        'SN-GEN-01-2019',   'External - North',  'DC Ops', 'online',      88,  '2019-09-01', '2029-09-01', '{"fuel_level": 72, "hours_run": 2847}'),
  ('GEN-02',     'Generator 02',         'Generator',      'Caterpillar C175',        'SN-GEN-02-2019',   'External - South',  'DC Ops', 'online',      91,  '2019-09-01', '2029-09-01', '{"fuel_level": 86, "hours_run": 2631}'),
  ('SW-CORE-01', 'Core Switch 01',       'Network Switch', 'Cisco Nexus 9336C-FX2',  'SN-SW-CORE-01',    'MDF, Rack 01',      'NOC',    'online',      79,  '2022-01-15', '2027-01-15', '{"port_utilization": 68, "latency_ms": 12}'),
  ('SW-CORE-02', 'Core Switch 02',       'Network Switch', 'Cisco Nexus 9336C-FX2',  'SN-SW-CORE-02',    'MDF, Rack 02',      'NOC',    'online',      83,  '2022-01-15', '2027-01-15', '{"port_utilization": 54, "latency_ms": 8}');

-- Incidents
INSERT INTO incidents (id, title, description, severity, status, department, assigned_to, created_by, tags) VALUES
  ('INC-001', 'Critical UPS Failure - Row A',     'UPS unit A-03 has failed causing loss of redundancy in Row A.',            'critical', 'in-progress', 'DC Ops',  'John Smith',   'NOC Agent',       ARRAY['UPS', 'Power', 'Critical']),
  ('INC-002', 'Network Latency Spike',             'Core switch SW-CORE-01 experiencing 400ms latency spikes.',               'high',     'open',        'NOC',     NULL,           'NOC Agent',       ARRAY['Network', 'Latency']),
  ('INC-003', 'CRAC Unit Fault - Zone B',         'CRAC-B-02 showing refrigerant pressure warning.',                         'high',     'in-progress', 'CM Team', 'Mike Johnson', 'Energy Agent',    ARRAY['Cooling', 'CRAC']),
  ('INC-004', 'Disk Array Degraded - SAN-02',     'SAN-02 disk array showing 2 failed drives. RAID rebuild in progress.',    'medium',   'in-progress', 'DC Ops',  'Sarah Lee',    'NOC Agent',       ARRAY['Storage', 'SAN']),
  ('INC-005', 'Generator Test Failure',            'Monthly generator test failed for GEN-01.',                               'medium',   'open',        'PM Team', NULL,           'PM Agent',        ARRAY['Generator', 'Power']);

-- Maintenance Tasks
INSERT INTO maintenance_tasks (id, title, description, type, status, department, asset_id, assigned_to, scheduled_date, priority) VALUES
  ('MT-001', 'UPS Battery Replacement Zone A', 'Scheduled replacement of UPS batteries in Zone A.',              'preventive', 'scheduled',   'PM Team', 'UPS-A-01', 'PM Team Alpha', NOW() + INTERVAL '4 days', 1),
  ('MT-002', 'CRAC Unit Annual Service',        'Annual comprehensive service of all CRAC units.',                'preventive', 'in-progress', 'PM Team', 'CRAC-A-01','PM Team Beta',  NOW(),                      2),
  ('MT-003', 'Emergency UPS Repair A-03',       'Emergency repair of failed UPS unit A-03. Bypass activated.',  'corrective', 'in-progress', 'CM Team', 'UPS-A-03', 'CM Team Alpha', NOW(),                      1),
  ('MT-004', 'Generator Monthly Load Test',     'Monthly load testing of all generators.',                       'preventive', 'completed',   'PM Team', 'GEN-01',   'PM Team Gamma', NOW() - INTERVAL '2 days', 2);

-- KPI Metrics (last 6 months, monthly snapshots)
INSERT INTO kpi_metrics (metric_name, metric_value, unit, department, recorded_at) VALUES
  ('pue',                1.48, '',     'global', NOW() - INTERVAL '5 months'),
  ('pue',                1.46, '',     'global', NOW() - INTERVAL '4 months'),
  ('pue',                1.45, '',     'global', NOW() - INTERVAL '3 months'),
  ('pue',                1.44, '',     'global', NOW() - INTERVAL '2 months'),
  ('pue',                1.43, '',     'global', NOW() - INTERVAL '1 month'),
  ('pue',                1.42, '',     'global', NOW()),
  ('energy_kwh',         2680, 'kWh',  'global', NOW() - INTERVAL '5 months'),
  ('energy_kwh',         2720, 'kWh',  'global', NOW() - INTERVAL '4 months'),
  ('energy_kwh',         2650, 'kWh',  'global', NOW() - INTERVAL '3 months'),
  ('energy_kwh',         2790, 'kWh',  'global', NOW() - INTERVAL '2 months'),
  ('energy_kwh',         2810, 'kWh',  'global', NOW() - INTERVAL '1 month'),
  ('energy_kwh',         2847, 'kWh',  'global', NOW()),
  ('sla_compliance',    98.4,  '%',    'global', NOW() - INTERVAL '5 months'),
  ('sla_compliance',    98.9,  '%',    'global', NOW() - INTERVAL '4 months'),
  ('sla_compliance',    99.1,  '%',    'global', NOW() - INTERVAL '3 months'),
  ('sla_compliance',    99.0,  '%',    'global', NOW() - INTERVAL '2 months'),
  ('sla_compliance',    99.3,  '%',    'global', NOW() - INTERVAL '1 month'),
  ('sla_compliance',    99.2,  '%',    'global', NOW()),
  ('incidents_count',   24,    'count','global', NOW() - INTERVAL '5 months'),
  ('incidents_count',   18,    'count','global', NOW() - INTERVAL '4 months'),
  ('incidents_count',   22,    'count','global', NOW() - INTERVAL '3 months'),
  ('incidents_count',   15,    'count','global', NOW() - INTERVAL '2 months'),
  ('incidents_count',   19,    'count','global', NOW() - INTERVAL '1 month'),
  ('incidents_count',   12,    'count','global', NOW());
