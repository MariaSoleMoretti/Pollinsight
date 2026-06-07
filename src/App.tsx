import { useState, useEffect, useMemo } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import HealthIndicator from './components/HealthIndicator';
import ActivityChart from './components/ActivityChart';
import DeviceHealth from './components/DeviceHealth';
import DailyReport from './components/DailyReport';
import AddressSelector from './components/AddressSelector';
import { mockLocations, aggregateActivity, getWorstDeviceStatus } from './data/mockData';
import type { Location } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('realtime');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    mockLocations[0] ?? null
  );
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString('it-IT', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Aggregated data for selected location
  const aggregatedData = useMemo(() => {
    if (!selectedLocation) return null;
    return aggregateActivity(selectedLocation.hives);
  }, [selectedLocation]);

  // Device status (worst across hives)
  const deviceStatus = useMemo(() => {
    if (!selectedLocation) return null;
    return getWorstDeviceStatus(selectedLocation.hives);
  }, [selectedLocation]);

  if (!selectedLocation || !aggregatedData || !deviceStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f4ef' }}>
        <p className="text-gray-400" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
          Nessuna ubicazione disponibile
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f7f4ef' }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1" style={{ marginLeft: '6rem' }}>
        {currentView === 'realtime' ? (
          <main className="max-w-5xl mx-auto px-4 md:px-8 pb-12 space-y-5 pt-6">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-gray-400 text-sm capitalize" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  {dateStr}
                </p>
                <h1
                  className="font-bold text-gray-800 text-3xl mt-1 leading-tight"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  Panoramica Attività
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <AddressSelector
                  locations={mockLocations}
                  selectedLocation={selectedLocation}
                  onSelectLocation={setSelectedLocation}
                />
              </div>
            </div>

            {/* Location summary badge */}
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: 'white', border: '1px solid #f3f4f6' }}
            >
              <div
                className="rounded-xl px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: selectedLocation.hives.some(h => h.health_score < 85 || h.varroa_detected)
                    ? '#fef3c7'
                    : '#dcfce7',
                  color: selectedLocation.hives.some(h => h.health_score < 85 || h.varroa_detected)
                    ? '#a16207'
                    : '#15803d',
                  fontFamily: 'Afacad Flux, sans-serif',
                }}
              >
                {selectedLocation.hives.length} {selectedLocation.hives.length === 1 ? 'alveare' : 'alveari'}
              </div>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                <span className="font-medium text-gray-700">{selectedLocation.name}</span>
                {' '}— {selectedLocation.address}
              </p>
            </div>

            {/* Device health */}
            <div className="rounded-2xl px-6 py-4 shadow-sm" style={{ backgroundColor: 'white' }}>
              <DeviceHealth
                battery={deviceStatus.battery}
                solarCharging={deviceStatus.solar_charging}
                signal={deviceStatus.signal}
              />
            </div>

            {/* KPI cards + alert */}
            <HealthIndicator
              location={selectedLocation}
              aggregatedTotal={aggregatedData.totalBees}
            />

            {/* Activity Chart */}
            <ActivityChart
              hives={selectedLocation.hives}
              aggregatedToday={aggregatedData.today}
              aggregatedYesterday={aggregatedData.yesterday}
            />
          </main>
        ) : (
          <DailyReport />
        )}
      </div>
    </div>
  );
}
