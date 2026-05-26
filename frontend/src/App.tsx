import { useState } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import SummaryRow from './components/SummaryRow';
import ActivityChart from './components/ActivityChart';
import EnvMiniChart from './components/EnvMiniChart';
import DeviceHealth from './components/DeviceHealth';
import DailyReport from './components/DailyReport';
import { apiaryData as d } from './data/mockData';
import { Sun, MapPin } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('realtime');

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f7f4ef' }}>
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main content area */}
      <div className="flex-1" style={{ marginLeft: '4rem' }}>
        {/* Header */}
        <header
          className="sticky top-0 z-40 border-b border-gray-100"
          style={{ backgroundColor: '#f7f4ef' }}
        >
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1
                  className="font-bold text-gray-800 text-xl leading-none"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  PollinAction
                </h1>
                <p
                  className="text-gray-400 text-xs mt-0.5"
                  style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                >
                  Beekeeper Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm"
                style={{ backgroundColor: '#dcfd8b' }}
              >
                <Sun size={15} strokeWidth={2.5} color="#6b8c1a" />
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: '#4a6210',
                    fontFamily: 'Afacad Flux, sans-serif',
                  }}
                >
                  {timeStr}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {currentView === 'realtime' ? (
          <main className="max-w-5xl mx-auto px-4 md:px-8 pb-12 space-y-5 pt-6">
            {/* Date + greeting */}
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <p
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                >
                  {dateStr}
                </p>
                <h2
                  className="font-bold text-gray-800 text-3xl mt-1"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  Good morning, Marco
                </h2>
              </div>
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm"
                style={{
                  backgroundColor: '#fdd5bd',
                  color: '#b84f10',
                  fontFamily: 'Afacad Flux, sans-serif',
                }}
              >
                <MapPin size={13} strokeWidth={2} />
                <span>{d.apiary_name}</span>
              </div>
            </div>

            {/* Summary Row */}
            <SummaryRow
              totalBees={d.total_bees}
              temp={d.env_data.temp}
              humidity={d.env_data.humidity}
              healthScore={d.hive_health_score}
            />

            {/* Activity Chart */}
            <ActivityChart
              data={d.hourly_activity}
              previousData={d.hourly_activity_yesterday}
            />

            {/* Env mini charts */}
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <EnvMiniChart
                data={d.hourly_temp}
                label="Temperature"
                unit="°C"
                color="#ff823a"
                bgColor="#fff8f4"
                gradId="tempGrad"
                gradStart="#ff823a"
              />
              <EnvMiniChart
                data={d.hourly_humidity}
                label="Humidity"
                unit="%"
                color="#5b8dee"
                bgColor="#f0f6ff"
                gradId="humidGrad"
                gradStart="#5b8dee"
              />
            </div>

            {/* Device health */}
            <div
              className="rounded-[28px] px-6 py-4 shadow-sm"
              style={{ backgroundColor: 'white' }}
            >
              <DeviceHealth
                battery={d.device.battery}
                solarCharging={d.device.solar_charging}
                signal={d.device.signal}
              />
            </div>
          </main>
        ) : (
          <DailyReport />
        )}
      </div>
    </div>
  );
}
