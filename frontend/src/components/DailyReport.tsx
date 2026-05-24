import VarroaAlert from './VarroaAlert';
import EnvMiniChart from './EnvMiniChart';
import { apiaryData as d } from '../data/mockData';
import { Bug, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react';

export default function DailyReport() {
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Mock weekly trend data
  const weeklyVarroaScans = [
    { day: 'Mon', detected: 0 },
    { day: 'Tue', detected: 0 },
    { day: 'Wed', detected: 1 },
    { day: 'Thu', detected: 0 },
    { day: 'Fri', detected: 0 },
    { day: 'Sat', detected: 2 },
    { day: 'Sun', detected: d.varroa_detected ? 1 : 0 },
  ];

  const maxVarroa = Math.max(...weeklyVarroaScans.map(s => s.detected), 1);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 pb-12 space-y-5 pt-6">
      {/* Page title */}
      <div>
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
          {todayStr}
        </p>
        <h2
          className="font-bold text-gray-800 text-3xl mt-1"
          style={{ fontFamily: 'Comfortaa, sans-serif' }}
        >
          Daily Report
        </h2>
      </div>

      {/* Varroa Alert */}
      {d.varroa_detected && (
        <VarroaAlert hiveName={d.hive_id} cropImages={d.alert_crops} />
      )}

      {/* Varroa Detection Section */}
      <section
        className="rounded-[28px] p-6 shadow-sm"
        style={{ backgroundColor: 'white' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="rounded-2xl p-2.5"
            style={{ backgroundColor: '#fff0e8' }}
          >
            <Bug size={18} strokeWidth={2.5} color="#ff823a" />
          </div>
          <div>
            <h3
              className="font-bold text-gray-800 text-lg"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              Varroa Detection
            </h3>
            <p
              className="text-gray-400 text-sm mt-0.5"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Weekly mite monitoring summary
            </p>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="flex items-end gap-2 h-28 mb-3">
          {weeklyVarroaScans.map((scan, i) => {
            const height = scan.detected > 0 ? (scan.detected / maxVarroa) * 100 : 8;
            const hasVarroa = scan.detected > 0;
            return (
              <div key={scan.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-xl transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: hasVarroa ? '#ff823a' : '#e5e7eb',
                    minHeight: 8,
                  }}
                />
                <span
                  className="text-xs text-gray-400"
                  style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                >
                  {scan.day}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: d.varroa_detected ? '#fff0e8' : '#f0fdf4' }}
        >
          {d.varroa_detected ? (
            <>
              <AlertTriangle size={16} strokeWidth={2.5} style={{ color: '#ff823a', marginTop: 2 }} />
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                <strong className="text-gray-800">Action required:</strong> Varroa mites detected
                in latest scan. Treatment recommended within 48 hours.
              </p>
            </>
          ) : (
            <>
              <TrendingUp size={16} strokeWidth={2.5} style={{ color: '#22c55e', marginTop: 2 }} />
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                <strong className="text-gray-800">All clear:</strong> No varroa mites detected this
                week. Continue regular monitoring.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Environmental Trends Section */}
      <section
        className="rounded-[28px] p-6 shadow-sm"
        style={{ backgroundColor: 'white' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="rounded-2xl p-2.5"
            style={{ backgroundColor: '#f0f6ff' }}
          >
            <TrendingUp size={18} strokeWidth={2.5} color="#5b8dee" />
          </div>
          <div>
            <h3
              className="font-bold text-gray-800 text-lg"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              Environmental Trends
            </h3>
            <p
              className="text-gray-400 text-sm mt-0.5"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              24-hour temperature and humidity patterns
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <EnvMiniChart
            data={d.hourly_temp}
            label="Temperature"
            unit="°C"
            color="#ff823a"
            bgColor="#fff8f4"
            gradId="dailyTempGrad"
            gradStart="#ff823a"
          />
          <EnvMiniChart
            data={d.hourly_humidity}
            label="Humidity"
            unit="%"
            color="#5b8dee"
            bgColor="#f0f6ff"
            gradId="dailyHumidGrad"
            gradStart="#5b8dee"
          />
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#fff8f4' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Avg Temp
            </p>
            <p
              className="font-bold text-xl text-gray-800"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#ff823a' }}
            >
              {(
                d.hourly_temp.reduce((a, b) => a + b, 0) / d.hourly_temp.length
              ).toFixed(1)}
              °C
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#fff8f4' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Max Temp
            </p>
            <p
              className="font-bold text-xl"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#ff823a' }}
            >
              {Math.max(...d.hourly_temp).toFixed(1)}°C
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#f0f6ff' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Avg Humidity
            </p>
            <p
              className="font-bold text-xl"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#5b8dee' }}
            >
              {(
                d.hourly_humidity.reduce((a, b) => a + b, 0) /
                d.hourly_humidity.length
              ).toFixed(0)}
              %
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#f0f6ff' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Min Humidity
            </p>
            <p
              className="font-bold text-xl"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#5b8dee' }}
            >
              {Math.min(...d.hourly_humidity).toFixed(0)}%
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
