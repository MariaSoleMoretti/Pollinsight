import { useState } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import HealthIndicator from './components/HealthIndicator';
import ActivityChart from './components/ActivityChart';
import DeviceHealth from './components/DeviceHealth';
import DailyReport from './components/DailyReport';
import { apiaryData as d } from './data/mockData';
import { MapPin } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('realtime');

  const dateStr = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f7f4ef' }}>
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main content area */}
      <div className="flex-1" style={{ marginLeft: '6rem' }}>

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
                  Buongiorno, Marco
                </h2>
              </div>
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm"
                style={{
                  backgroundColor: '#e6faf5',
                  color: '#20C997',
                  fontFamily: 'Afacad Flux, sans-serif',
                }}
              >
                <MapPin size={13} strokeWidth={2} />
                <span>{d.apiary_name}</span>
              </div>
            </div>
            {/* Device health */}
            <div
              className="rounded-[10px] px-6 py-4 shadow-sm"
              style={{ backgroundColor: 'white' }}
            >
              <DeviceHealth
                battery={d.device.battery}
                solarCharging={d.device.solar_charging}
                signal={d.device.signal}
              />
            </div>
            {/* Health Indicator */}
            <HealthIndicator
              totalBees={d.total_bees}
              temp={d.env_data.temp}
              humidity={d.env_data.humidity}
            />

            {/* Activity Chart */}
            <ActivityChart
              data={d.hourly_activity}
              previousData={d.hourly_activity_yesterday}
            />
          </main>
        ) : (
          <DailyReport />
        )}
      </div>
    </div>
  );
}
