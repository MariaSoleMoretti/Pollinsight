// Types for multi-hive/location architecture
export interface Device {
  id: string;
  name: string;
  battery: number;
  solar_charging: boolean;
  signal: string;
  last_seen_at: string;
}

export interface Hive {
  id: string;
  name: string;
  health_score: number;
  varroa_detected: boolean;
  device: Device;
  hourly_activity: number[];
  hourly_activity_yesterday: number[];
}

export interface EnvData {
  temp: number;
  humidity: number;
  hourly_temp: number[];
  hourly_humidity: number[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  env_data: EnvData;
  hives: Hive[];
}

// Generate hourly activity with realistic bee patterns
function generateHourlyActivity(peak: number = 1000, variance: number = 0.2): number[] {
  const base: number[] = [
    0, 0, 0, 5, 30, 150, 400, 750, 950, peak, peak * 0.85, peak * 0.55,
    peak * 0.4, peak * 0.25, peak * 0.15, peak * 0.08, peak * 0.03, peak * 0.01, 0, 0, 0, 0, 0, 0,
  ];
  return base.map(v => Math.max(0, Math.round(v + v * variance * (Math.random() - 0.5))));
}

// Mock data with multiple locations and hives
export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Apiario Principale',
    address: 'Via Roma, 32',
    latitude: 45.4642,
    longitude: 9.1900,
    env_data: {
      temp: 25.3,
      humidity: 48,
      hourly_temp: [18.2, 17.8, 17.5, 17.4, 17.6, 18.1, 19.3, 20.8, 22.1, 23.4, 24.5, 25.2, 25.8, 25.6, 25.0, 24.5, 23.8, 23.0, 22.2, 21.5, 20.8, 20.2, 19.6, 19.0],
      hourly_humidity: [55, 56, 57, 58, 57, 55, 52, 50, 48, 46, 44, 42, 41, 40, 41, 42, 43, 44, 46, 48, 50, 52, 53, 54],
    },
    hives: [
      {
        id: 'hive-1',
        name: 'Alveare A',
        health_score: 94,
        varroa_detected: false,
        device: {
          id: 'dev-1',
          name: 'Gateway-01',
          battery: 92,
          solar_charging: true,
          signal: 'LTE-M',
          last_seen_at: new Date().toISOString(),
        },
        hourly_activity: generateHourlyActivity(1200, 0.15),
        hourly_activity_yesterday: generateHourlyActivity(1100, 0.18),
      },
      {
        id: 'hive-2',
        name: 'Alveare B',
        health_score: 88,
        varroa_detected: true,
        device: {
          id: 'dev-2',
          name: 'Gateway-02',
          battery: 78,
          solar_charging: true,
          signal: 'LTE-M',
          last_seen_at: new Date().toISOString(),
        },
        hourly_activity: generateHourlyActivity(950, 0.22),
        hourly_activity_yesterday: generateHourlyActivity(900, 0.2),
      },
      {
        id: 'hive-3',
        name: 'Alveare C',
        health_score: 91,
        varroa_detected: false,
        device: {
          id: 'dev-3',
          name: 'Gateway-03',
          battery: 65,
          solar_charging: false,
          signal: 'NB-IoT',
          last_seen_at: new Date(Date.now() - 300000).toISOString(),
        },
        hourly_activity: generateHourlyActivity(1100, 0.12),
        hourly_activity_yesterday: generateHourlyActivity(1050, 0.14),
      },
    ],
  },
  {
    id: 'loc-2',
    name: 'Apiario Collina',
    address: 'Via Montagna, 15',
    latitude: 45.4821,
    longitude: 9.2156,
    env_data: {
      temp: 22.1,
      humidity: 62,
      hourly_temp: [15.2, 14.9, 14.6, 14.4, 14.8, 15.5, 16.8, 18.2, 19.5, 20.8, 21.5, 22.0, 22.5, 22.8, 22.5, 22.0, 21.2, 20.5, 19.8, 19.2, 18.5, 18.0, 17.5, 17.0],
      hourly_humidity: [68, 69, 70, 71, 70, 68, 65, 63, 61, 59, 58, 57, 56, 55, 56, 57, 58, 60, 62, 64, 65, 66, 67, 68],
    },
    hives: [
      {
        id: 'hive-4',
        name: 'Alveare D',
        health_score: 96,
        varroa_detected: false,
        device: {
          id: 'dev-4',
          name: 'Gateway-04',
          battery: 95,
          solar_charging: true,
          signal: 'LTE-M',
          last_seen_at: new Date().toISOString(),
        },
        hourly_activity: generateHourlyActivity(1400, 0.1),
        hourly_activity_yesterday: generateHourlyActivity(1350, 0.12),
      },
      {
        id: 'hive-5',
        name: 'Alveare E',
        health_score: 82,
        varroa_detected: true,
        device: {
          id: 'dev-5',
          name: 'Gateway-05',
          battery: 45,
          solar_charging: false,
          signal: 'LTE-M',
          last_seen_at: new Date(Date.now() - 600000).toISOString(),
        },
        hourly_activity: generateHourlyActivity(700, 0.25),
        hourly_activity_yesterday: generateHourlyActivity(750, 0.22),
      },
    ],
  },
  {
    id: 'loc-3',
    name: 'Apiario Fattoria',
    address: 'Strada Provinciale, 8',
    latitude: 45.3987,
    longitude: 9.1543,
    env_data: {
      temp: 26.8,
      humidity: 38,
      hourly_temp: [19.5, 19.0, 18.7, 18.5, 18.8, 19.5, 21.0, 22.8, 24.2, 25.5, 26.2, 26.8, 27.2, 27.0, 26.5, 25.8, 25.0, 24.2, 23.5, 22.8, 22.2, 21.5, 20.8, 20.2],
      hourly_humidity: [45, 46, 47, 48, 47, 45, 43, 41, 39, 38, 37, 36, 35, 35, 36, 37, 38, 40, 42, 43, 44, 45, 46, 47],
    },
    hives: [
      {
        id: 'hive-6',
        name: 'Alveare F',
        health_score: 90,
        varroa_detected: false,
        device: {
          id: 'dev-6',
          name: 'Gateway-06',
          battery: 88,
          solar_charging: true,
          signal: 'NB-IoT',
          last_seen_at: new Date().toISOString(),
        },
        hourly_activity: generateHourlyActivity(1300, 0.18),
        hourly_activity_yesterday: generateHourlyActivity(1250, 0.16),
      },
    ],
  },
];

// Helper: aggregate activity across all hives at a location
export function aggregateActivity(hives: Hive[]): {
  today: number[];
  yesterday: number[];
  totalBees: number;
} {
  if (hives.length === 0) {
    return { today: Array(24).fill(0), yesterday: Array(24).fill(0), totalBees: 0 };
  }

  const today = Array(24).fill(0);
  const yesterday = Array(24).fill(0);

  for (const hive of hives) {
    for (let i = 0; i < 24; i++) {
      today[i] += hive.hourly_activity[i] || 0;
      yesterday[i] += hive.hourly_activity_yesterday[i] || 0;
    }
  }

  const currentHour = new Date().getHours();
  const totalBees = today.slice(0, currentHour + 1).reduce((a, b) => a + b, 0);

  return { today, yesterday, totalBees };
}

// Helper: get worst device status for a location
export function getWorstDeviceStatus(hives: Hive[]): {
  battery: number;
  solar_charging: boolean;
  signal: string;
} {
  if (hives.length === 0) {
    return { battery: 0, solar_charging: false, signal: '--' };
  }

  let minBattery = 100;
  let anySolarCharging = false;
  let worstSignal = 'LTE-M';

  for (const hive of hives) {
    if (hive.device.battery < minBattery) minBattery = hive.device.battery;
    if (hive.device.solar_charging) anySolarCharging = true;
    if (hive.device.signal === 'NB-IoT') worstSignal = 'NB-IoT';
  }

  return { battery: minBattery, solar_charging: anySolarCharging, signal: worstSignal };
}

// Helper: get health summary for a location
export function getHealthSummary(hives: Hive[]): {
  avgHealth: number;
  varroaDetected: boolean;
  healthyHives: number;
} {
  if (hives.length === 0) {
    return { avgHealth: 0, varroaDetected: false, healthyHives: 0 };
  }

  const avgHealth = Math.round(hives.reduce((sum, h) => sum + h.health_score, 0) / hives.length);
  const varroaDetected = hives.some(h => h.varroa_detected);
  const healthyHives = hives.filter(h => h.health_score >= 85 && !h.varroa_detected).length;

  return { avgHealth, varroaDetected, healthyHives };
}

// Varroa detection history types
export interface VarroaDetection {
  date: string;
  detected: boolean;
  confidence: number;
  miteCount: number;
  images: string[];
  severity: 'none' | 'low' | 'medium' | 'high';
  notes?: string;
}

// Generate mock varroa detection history
function generateVarroaHistory(hasActiveVarroa: boolean): VarroaDetection[] {
  const history: VarroaDetection[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    if (hasActiveVarroa) {
      if (i < 7 && Math.random() > 0.3) {
        history.push({
          date: dateStr,
          detected: true,
          confidence: 75 + Math.floor(Math.random() * 20),
          miteCount: 2 + Math.floor(Math.random() * 5),
          images: [
            'https://ughettoapicoltura.com/wp-content/uploads/2023/06/Senza-titolo-2.jpg',
            'https://www.scienzainrete.it/files/styles/molto_grande/public/Ape%20con%20Varroa.jpg?itok=HU4piufY',
          ],
          severity: 'medium',
          notes: 'Presenza di varroa identificata su api operaie. Monitoraggio consigliato.',
        });
      } else if (i >= 7 && i < 14 && Math.random() > 0.5) {
        history.push({
          date: dateStr,
          detected: true,
          confidence: 65 + Math.floor(Math.random() * 25),
          miteCount: 1 + Math.floor(Math.random() * 3),
          images: ['https://ughettoapicoltura.com/wp-content/uploads/2023/06/Senza-titolo-2.jpg'],
          severity: 'low',
        });
      } else {
        history.push({
          date: dateStr,
          detected: false,
          confidence: 90 + Math.floor(Math.random() * 10),
          miteCount: 0,
          images: [],
          severity: 'none',
        });
      }
    } else {
      history.push({
        date: dateStr,
        detected: false,
        confidence: 92 + Math.floor(Math.random() * 8),
        miteCount: 0,
        images: [],
        severity: 'none',
      });
    }
  }

  return history;
}

// Pre-generated varroa history for all hives
export const varroaHistory: Record<string, VarroaDetection[]> = {
  'hive-1': generateVarroaHistory(false),
  'hive-2': generateVarroaHistory(true),
  'hive-3': generateVarroaHistory(false),
  'hive-4': generateVarroaHistory(false),
  'hive-5': generateVarroaHistory(true),
  'hive-6': generateVarroaHistory(false),
};

// Legacy export for backward compatibility
export const apiaryData = {
  get apiary_name() { return mockLocations[0].address; },
  get hive_id() { return mockLocations[0].hives[0]?.name || 'N/A'; },
  hive_health_score: 92,
  varroa_detected: true,
  get total_bees() {
    const agg = aggregateActivity(mockLocations[0].hives);
    return agg.totalBees;
  },
  get env_data() {
    return {
      temp: mockLocations[0].env_data.temp,
      humidity: mockLocations[0].env_data.humidity,
    };
  },
  alert_crops: [
    'https://ughettoapicoltura.com/wp-content/uploads/2023/06/Senza-titolo-2.jpg',
    'https://www.scienzainrete.it/files/styles/molto_grande/public/Ape%20con%20Varroa.jpg?itok=HU4piufY',
    'https://ughettoapicoltura.com/wp-content/uploads/2023/06/Senza-titolo-2.jpg',
  ],
  get hourly_activity() { return aggregateActivity(mockLocations[0].hives).today; },
  get hourly_activity_yesterday() { return aggregateActivity(mockLocations[0].hives).yesterday; },
  hourly_temp: mockLocations[0].env_data.hourly_temp,
  hourly_humidity: mockLocations[0].env_data.hourly_humidity,
  get device() {
    return getWorstDeviceStatus(mockLocations[0].hives);
  },
};
