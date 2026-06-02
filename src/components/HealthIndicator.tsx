import { AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';

interface HealthIndicatorProps {
  totalBees: number;
  temp: number;
  humidity: number;
}

export default function HealthIndicator({ totalBees, temp, humidity }: HealthIndicatorProps) {
  // Determine optimal ranges
  const isTempOptimal = temp >= 34 && temp <= 36;
  const isHumidityOptimal = humidity >= 40 && humidity <= 60;
  const isActivityGood = totalBees > 800;

  // Determine health status
  const hasIssue = !isActivityGood && (isTempOptimal || isHumidityOptimal);
  const isCritical = !isActivityGood && !isTempOptimal && !isHumidityOptimal;
  const isHealthy = isActivityGood && isTempOptimal && isHumidityOptimal;

  let alertMessage = '';
  let alertType: 'success' | 'warning' | 'critical' | null = null;
  let alertColor = '';
  let alertBg = '';
  let alertIcon = null;

  if (isCritical) {
    alertMessage = 'Condizioni critiche rilevate. L\'alveare necessita di attenzione immediata. Le api potrebbero essere sottoposte a stress a causa delle condizioni ambientali sfavorevoli. Verificare l\'accesso all\'acqua, la ventilazione e lo spazio disponibile.';
    alertType = 'critical';
    alertColor = '#dc2626';
    alertBg = '#fee2e2';
    alertIcon = <AlertTriangle size={20} strokeWidth={2.5} />;
  } else if (hasIssue) {
    alertMessage = 'Attività inferiore al normale nonostante le condizioni ambientali siano favorevoli. Potrebbero essere presenti parassiti, malattie o problemi interni all\'alveare. Si consiglia di ispezionare l\'alveare nei prossimi giorni.';
    alertType = 'warning';
    alertColor = '#ff823a';
    alertBg = '#fff0e8';
    alertIcon = <AlertCircle size={20} strokeWidth={2.5} />;
  } else if (isHealthy) {
    alertMessage = 'L\'alveare è in ottime condizioni. Tutti i parametri sono entro i range ottimali. Le api sono attive e l\'ambiente è favorevole per lo sviluppo della popolazione e la raccolta del nettare.';
    alertType = 'success';
    alertColor = '#22c55e';
    alertBg = '#f0fdf4';
    alertIcon = <TrendingUp size={20} strokeWidth={2.5} />;
  }

  return (
    <div>
      {/* Left Column - Vertical Cards */}
      <div className="flex flex-row gap-6">
        {/* Total Bees Card */}
        <div
          className="rounded-[10px] p-6 shadow-sm"
          style={{ backgroundColor: '#f5f0f8' }}
        >
          <p className="text-gray-600 text-sm font-medium mb-4" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            Attività totale
          </p>
          <p
            className="font-bold text-4xl"
            style={{
              color: '#6B2D8C',
              fontFamily: 'Comfortaa, sans-serif',
            }}
          >
            {totalBees.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-3" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            {isActivityGood ? 'Attività: Buona' : 'Attività: Bassa'}
          </p>
        </div>

        {/* Temperature Card */}
        <div
          className="rounded-[10px] p-6 shadow-sm"
          style={{ backgroundColor: '#fffbd9' }}
        >
          <p className="text-gray-600 text-sm font-medium mb-4" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            Temperatura
          </p>
          <p
            className="font-bold text-4xl"
            style={{
              color: '#FFB800',
              fontFamily: 'Comfortaa, sans-serif',
            }}
          >
            {temp.toFixed(1)}°C
          </p>
          <p className="text-xs text-gray-500 mt-3" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            {isTempOptimal ? 'Stato: Ottimale' : temp > 36 ? 'Stato: Calda' : 'Stato: Fresca'}
          </p>
        </div>

        {/* Humidity Card */}
        <div
          className="rounded-[10px] p-6 shadow-sm"
          style={{ backgroundColor: '#e6faf5' }}
        >
          <p className="text-gray-600 text-sm font-medium mb-4" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            Umidità
          </p>
          <p
            className="font-bold text-4xl"
            style={{
              color: '#20C997',
              fontFamily: 'Comfortaa, sans-serif',
            }}
          >
            {humidity}%
          </p>
          <p className="text-xs text-gray-500 mt-3" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            {isHumidityOptimal ? 'Stato: Ottimale' : humidity > 60 ? 'Stato: Alta' : 'Stato: Bassa'}
          </p>
        </div>
      </div>
    </div>
  );
}
