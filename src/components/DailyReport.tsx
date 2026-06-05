import VarroaAlert from './VarroaAlert';
import EnvMiniChart from './EnvMiniChart';
import { apiaryData as d } from '../data/mockData';
import { Bug, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';


export default function DailyReport() {
  const todayStr = new Date().toLocaleDateString('it-IT', {
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
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-gray-400 text-sm capitalize" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            {todayStr}
          </p>
          <h1
            className="font-bold text-gray-800 text-3xl mt-1 leading-tight"
            style={{ fontFamily: 'Comfortaa, sans-serif' }}
          >
            Report Giornaliero
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm"
            style={{ backgroundColor: '#e6faf5', color: '#0d9488', fontFamily: 'Afacad Flux, sans-serif' }}
          >
            <MapPin size={13} strokeWidth={2} />
            <span>{d.apiary_name}</span>
          </div>
        </div>
      </div>

      {/* Varroa Alert */}
      {d.varroa_detected && (
        <VarroaAlert hiveName={d.hive_id} cropImages={d.alert_crops} />
      )}

      {/* Varroa Detection Section */}
      <section
        className="rounded-[16px] p-6 shadow-sm"
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
              Rilevamento Varroa
            </h3>
            <p
              className="text-gray-400 text-sm mt-0.5"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Riepilogo monitoraggio acari settimanale
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
                  {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(scan.day)]}
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
                <strong className="text-gray-800">Azione richiesta:</strong> Acari varroa rilevati
                nell'ultimo scan. Trattamento consigliato entro 48 ore.
              </p>
            </>
          ) : (
            <>
              <TrendingUp size={16} strokeWidth={2.5} style={{ color: '#22c55e', marginTop: 2 }} />
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                <strong className="text-gray-800">Tutto bene:</strong> Nessun acaro varroa rilevato questa
                settimana. Continuare il monitoraggio regolare.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Environmental Trends Section */}
      <section
        className="rounded-[16px] p-6 shadow-sm"
        style={{ backgroundColor: 'white' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="rounded-2xl p-2.5"
            style={{ backgroundColor: '#e6faf5' }}
          >
            <TrendingUp size={18} strokeWidth={2.5} color="#20C997" />
          </div>
          <div>
            <h3
              className="font-bold text-gray-800 text-lg"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              Tendenze Ambientali
            </h3>
            <p
              className="text-gray-400 text-sm mt-0.5"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Modelli di temperatura e umidità nelle 24 ore
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <EnvMiniChart
            data={d.hourly_temp}
            label="Temperatura"
            unit="°C"
            color="#6B2D8C"
            bgColor="#f5f0f8"
            gradId="dailyTempGrad"
            gradStart="#6B2D8C"
          />
          <EnvMiniChart
            data={d.hourly_humidity}
            label="Umidità"
            unit="%"
            color="#20C997"
            bgColor="#e6faf5"
            gradId="dailyHumidGrad"
            gradStart="#20C997"
          />
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#f5f0f8' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Temp Media
            </p>
            <p
              className="font-bold text-xl text-gray-800"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#6B2D8C' }}
            >
              {(
                d.hourly_temp.reduce((a, b) => a + b, 0) / d.hourly_temp.length
              ).toFixed(1)}
              °C
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#f5f0f8' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Temp Max
            </p>
            <p
              className="font-bold text-xl"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#6B2D8C' }}
            >
              {Math.max(...d.hourly_temp).toFixed(1)}°C
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#e6faf5' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Umidità Media
            </p>
            <p
              className="font-bold text-xl"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#20C997' }}
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
            style={{ backgroundColor: '#e6faf5' }}
          >
            <p
              className="text-xs text-gray-400 mb-1"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Umidità Min
            </p>
            <p
              className="font-bold text-xl"
              style={{ fontFamily: 'Comfortaa, sans-serif', color: '#20C997' }}
            >
              {Math.min(...d.hourly_humidity).toFixed(0)}%
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
