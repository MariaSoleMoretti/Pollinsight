-- Locations: geographic addresses where hives are placed
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL UNIQUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Environmental readings per location (shared by all hives at same address)
CREATE TABLE env_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  temp DECIMAL(5, 2) NOT NULL,
  humidity DECIMAL(5, 2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Hives: individual bee colonies
CREATE TABLE hives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  health_score INTEGER DEFAULT 0,
  varroa_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Devices/Gateways: sensors attached to hives
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  battery INTEGER DEFAULT 100,
  solar_charging BOOLEAN DEFAULT false,
  signal TEXT DEFAULT 'LTE-M',
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bee activity readings per device/hive
CREATE TABLE activity_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  bees_in INTEGER DEFAULT 0,
  bees_out INTEGER DEFAULT 0,
  total_activity INTEGER GENERATED ALWAYS AS (bees_in + bees_out) STORED,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Hourly aggregated activity (for charts)
CREATE TABLE hourly_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  hour TIMESTAMP NOT NULL,
  total_bees INTEGER DEFAULT 0,
  UNIQUE (hive_id, hour)
);

-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE env_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hourly_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies: authenticated users can read/write their own data
CREATE POLICY "locations_select" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "locations_insert" ON locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "locations_update" ON locations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "locations_delete" ON locations FOR DELETE TO authenticated USING (true);

CREATE POLICY "env_readings_select" ON env_readings FOR SELECT TO authenticated USING (true);
CREATE POLICY "env_readings_insert" ON env_readings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "hives_select" ON hives FOR SELECT TO authenticated USING (true);
CREATE POLICY "hives_insert" ON hives FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "hives_update" ON hives FOR UPDATE TO authenticated USING (true);
CREATE POLICY "hives_delete" ON hives FOR DELETE TO authenticated USING (true);

CREATE POLICY "devices_select" ON devices FOR SELECT TO authenticated USING (true);
CREATE POLICY "devices_insert" ON devices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "devices_update" ON devices FOR UPDATE TO authenticated USING (true);

CREATE POLICY "activity_readings_select" ON activity_readings FOR SELECT TO authenticated USING (true);
CREATE POLICY "activity_readings_insert" ON activity_readings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "hourly_activity_select" ON hourly_activity FOR SELECT TO authenticated USING (true);
CREATE POLICY "hourly_activity_insert" ON hourly_activity FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "hourly_activity_update" ON hourly_activity FOR UPDATE TO authenticated USING (true);

-- Indexes for common queries
CREATE INDEX idx_hives_location ON hives(location_id);
CREATE INDEX idx_devices_hive ON devices(hive_id);
CREATE INDEX idx_hourly_activity_hive_hour ON hourly_activity(hive_id, hour DESC);
CREATE INDEX idx_env_readings_location_time ON env_readings(location_id, recorded_at DESC);
