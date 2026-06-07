import { useState } from 'react';
import { AlertTriangle, TrendingUp, AlertCircle, Thermometer, Droplets, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import type { Location } from '../data/mockData';

interface HealthIndicatorProps {
  location: Location;
  aggregatedTotal: number;
}

export default function HealthIndicator({ location, aggregatedTotal }: HealthIndicatorProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { env_data, hives } = location;
  const temp = env_data.temp;
  const humidity = env_data.humidity;

  const isTempOptimal = temp >= 20 && temp <= 35;
  const isHumidityOptimal = humidity >= 40 && humidity <= 70;
  const isActivityGood = aggregatedTotal > 2000;

  const hasIssue = !isActivityGood && (isTempOptimal || isHumidityOptimal);
  const isCritical = !isActivityGood && !isTempOptimal && !isHumidityOptimal;
  const isHealthy = isActivityGood && isTempOptimal && isHumidityOptimal;

  let alertMessage: string;
  let alertType: 'success' | 'warning' | 'critical';
  let alertColor: string;
  let alertBg: string;
  let alertBorder: string;
  let alertIcon: React.ReactNode;

  if (isCritical) {
    alertMessage = 'Condizioni critiche rilevate. L\'alveare necessita di attenzione immediata. Le api potrebbero essere sottoposte a stress a causa delle condizioni ambientali sfavorevoli. Verificare l\'accesso all\'acqua, la ventilazione e lo spazio disponibile.';
    alertType = 'critical';
    alertColor = '#dc2626';
    alertBg = '#fff5f5';
    alertBorder = '#fecaca';
    alertIcon = <AlertTriangle size={22} strokeWidth={2.5} />;
  } else if (hasIssue) {
    alertMessage = 'Attività api ridotta nonostante i parametri ambientali siano ottimali. Potrebbero essere presenti parassiti, malattie o problemi interni all\'alveare. Si consiglia un\'ispezione visiva nei prossimi giorni.';
    alertType = 'warning';
    alertColor = '#d97706';
    alertBg = '#fffbeb';
    alertBorder = '#fde68a';
    alertIcon = <AlertCircle size={22} strokeWidth={2.5} />;
  } else if (isHealthy) {
    alertMessage = 'Tutti i parametri sono entro i range ottimali. Le api sono attive e l\'ambiente è favorevole per lo sviluppo della colonia e la raccolta del nettare. Continua il monitoraggio regolare.';
    alertType = 'success';
    alertColor = '#059669';
    alertBg = '#f0fdf4';
    alertBorder = '#bbf7d0';
    alertIcon = <TrendingUp size={22} strokeWidth={2.5} />;
  } else {
    alertMessage = 'Monitoraggio in corso. Alcuni parametri sono fuori dall\'intervallo ottimale. Tieni d\'occhio l\'andamento nelle prossime ore.';
    alertType = 'warning';
    alertColor = '#d97706';
    alertBg = '#fffbeb';
    alertBorder = '#fde68a';
    alertIcon = <AlertCircle size={22} strokeWidth={2.5} />;
  }

  const tempStatus = isTempOptimal ? 'Ottimale' : temp > 35 ? 'Troppo calda' : 'Troppo fresca';
  const humStatus = isHumidityOptimal ? 'Ottimale' : humidity > 70 ? 'Alta' : 'Bassa';
  const actStatus = isActivityGood ? 'Buona' : 'Anomalia bassa';
  const actStatusColor = isActivityGood ? '#059669' : '#d97706';

  return (
    <div className="space-y-4">
      {/* Main KPI cards row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: hives.length > 1 ? '1fr 1fr 1fr 2fr' : 'repeat(4, 1fr)' }}>
        {/* Temperature Card - shared across location */}
        <div className="rounded-2xl p-5 shadow-sm flex flex-col gap-3" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              Temperatura
            </p>
            <div className="rounded-xl p-1.5" style={{ backgroundColor: '#fffbd9' }}>
              <Thermometer size={15} strokeWidth={2} color="#b45309" />
            </div>
          </div>
          <div>
            <p className="font-bold leading-none" style={{ color: '#1e293b', fontFamily: 'Comfortaa, sans-serif', fontSize: '2.2rem' }}>
              {temp.toFixed(1)}<span className="text-xl font-semibold">°C</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: isTempOptimal ? '#dcfce7' : '#fef9c3',
                color: isTempOptimal ? '#15803d' : '#a16207',
                fontFamily: 'Afacad Flux, sans-serif',
              }}
            >
              {tempStatus}
            </span>
          </div>
        </div>

        {/* Humidity Card - shared across location */}
        <div className="rounded-2xl p-5 shadow-sm flex flex-col gap-3" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              Umidità
            </p>
            <div className="rounded-xl p-1.5" style={{ backgroundColor: '#e6faf5' }}>
              <Droplets size={15} strokeWidth={2} color="#0d9488" />
            </div>
          </div>
          <div>
            <p className="font-bold leading-none" style={{ color: '#1e293b', fontFamily: 'Comfortaa, sans-serif', fontSize: '2.2rem' }}>
              {humidity}<span className="text-xl font-semibold">%</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: isHumidityOptimal ? '#dcfce7' : '#fef9c3',
                color: isHumidityOptimal ? '#15803d' : '#a16207',
                fontFamily: 'Afacad Flux, sans-serif',
              }}
            >
              {humStatus}
            </span>
          </div>
        </div>

        {/* Activity Card - aggregated */}
        <div className="rounded-2xl p-5 shadow-sm flex flex-col gap-3" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              Attività {hives.length > 1 ? 'Totale' : ''}
            </p>
            <div className="rounded-xl p-1.5" style={{ backgroundColor: '#f5f0f8' }}>
              <Activity size={15} strokeWidth={2} color="#6B2D8C" />
            </div>
          </div>
          <div>
            <p className="font-bold leading-none" style={{ color: '#1e293b', fontFamily: 'Comfortaa, sans-serif', fontSize: '2.2rem' }}>
              {aggregatedTotal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              api/oggi
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: isActivityGood ? '#dcfce7' : '#ffedd5',
                color: actStatusColor,
                fontFamily: 'Afacad Flux, sans-serif',
              }}
            >
              {actStatus}
            </span>
          </div>
        </div>

        {/* Alert Card */}
        <div
          className="rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          style={{ backgroundColor: alertBg, border: `1.5px solid ${alertBorder}` }}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl p-2 flex-shrink-0" style={{ backgroundColor: 'white' }}>
              <span style={{ color: alertColor }}>{alertIcon}</span>
            </div>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: alertColor, fontFamily: 'Comfortaa, sans-serif' }}
              >
                {alertType === 'success'
                  ? 'Alveare in salute'
                  : alertType === 'critical'
                  ? 'Condizioni critiche'
                  : 'Attenzione richiesta'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                {hives.length} {hives.length === 1 ? 'alveare' : 'alveari'} monitorati
              </p>
            </div>
          </div>

          {!isActivityGood && (isTempOptimal || isHumidityOptimal) && (
            <div
              className="rounded-xl px-3 py-2 mt-3 text-xs font-semibold flex items-center gap-2"
              style={{
                backgroundColor: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #fed7aa',
                fontFamily: 'Afacad Flux, sans-serif',
              }}
            >
              <AlertCircle size={13} strokeWidth={2.5} />
              ALERT: Attività api ridotta nonostante parametri meteo ideali
            </div>
          )}

          <p
            className="text-xs leading-relaxed mt-3"
            style={{ color: '#374151', fontFamily: 'Afacad Flux, sans-serif' }}
          >
            {alertMessage}
          </p>
        </div>
      </div>

      {/* Per-hive breakdown - only if multiple hives */}
      {hives.length > 1 && (
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'white' }}>
          <button
            onClick={() => setShowBreakdown(prev => !prev)}
            className="w-full px-5 py-3 flex items-center justify-between transition-colors hover:bg-gray-50"
          >
            <span
              className="text-sm font-semibold"
              style={{ color: '#374151', fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Dettaglio per alveare
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#f5f0f8', color: '#6B2D8C', fontFamily: 'Afacad Flux, sans-serif' }}
              >
                {hives.length} alveari
              </span>
              {showBreakdown ? (
                <ChevronUp size={18} strokeWidth={2} color="#6b7280" />
              ) : (
                <ChevronDown size={18} strokeWidth={2} color="#6b7280" />
              )}
            </div>
          </button>

          {showBreakdown && (
            <div className="border-t" style={{ borderColor: '#f3f4f6' }}>
              {hives.map((hive, idx) => {
                const currentHour = new Date().getHours();
                const hiveTotal = hive.hourly_activity
                  .slice(0, currentHour + 1)
                  .reduce((a, b) => a + b, 0);
                const isLowHealth = hive.health_score < 85 || hive.varroa_detected;

                return (
                  <div
                    key={hive.id}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-gray-50"
                    style={{ borderTop: idx > 0 ? '1px solid #f3f4f6' : 'none' }}
                  >
                    {/* Hive indicator */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isLowHealth ? '#fef3c7' : '#dcfce7',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>
                        {isLowHealth ? '⚠️' : '🐝'}
                      </span>
                    </div>

                    {/* Hive info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: '#1e293b', fontFamily: 'Comfortaa, sans-serif' }}
                      >
                        {hive.name}
                      </p>
                      <p
                        className="text-xs text-gray-500"
                        style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                      >
                        Salute: {hive.health_score}% {hive.varroa_detected && '• Varroa rilevato'}
                      </p>
                    </div>

                    {/* Activity count */}
                    <div className="text-right">
                      <p
                        className="font-bold text-lg"
                        style={{ color: '#6B2D8C', fontFamily: 'Comfortaa, sans-serif' }}
                      >
                        {hiveTotal.toLocaleString()}
                      </p>
                      <p
                        className="text-xs text-gray-400"
                        style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                      >
                        api/oggi
                      </p>
                    </div>

                    {/* Device status */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className="rounded-lg px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: hive.device.battery > 50 ? '#dcfce7' : '#fef3c7',
                          color: hive.device.battery > 50 ? '#15803d' : '#a16207',
                          fontFamily: 'Afacad Flux, sans-serif',
                        }}
                      >
                        {hive.device.battery}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
