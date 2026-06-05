import { AlertTriangle, TrendingUp, AlertCircle, Thermometer, Droplets, Activity } from 'lucide-react';

interface HealthIndicatorProps {
  totalBees: number;
  temp: number;
  humidity: number;
}

export default function HealthIndicator({ totalBees, temp, humidity }: HealthIndicatorProps) {
  const isTempOptimal = temp >= 20 && temp <= 35;
  const isHumidityOptimal = humidity >= 40 && humidity <= 70;
  const isActivityGood = totalBees > 800;

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
    <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr 2fr' }}>
      {/* Temperature Card */}
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

      {/* Humidity Card */}
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

      {/* Activity Card */}
      <div className="rounded-2xl p-5 shadow-sm flex flex-col gap-3" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            Attività
          </p>
          <div className="rounded-xl p-1.5" style={{ backgroundColor: '#f5f0f8' }}>
            <Activity size={15} strokeWidth={2} color="#6B2D8C" />
          </div>
        </div>
        <div>
          <p className="font-bold leading-none" style={{ color: '#1e293b', fontFamily: 'Comfortaa, sans-serif', fontSize: '2.2rem' }}>
            {totalBees.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>api/ora</p>
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

      {/* Alert / Relation Card */}
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
              Relazione dati
            </p>
          </div>
        </div>

        {/* Alert banner for anomaly */}
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
  );
}
