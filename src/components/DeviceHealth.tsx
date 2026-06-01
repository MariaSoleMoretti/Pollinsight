import { BatteryCharging, Signal } from 'lucide-react';

interface DeviceHealthProps {
  battery: number;
  solarCharging: boolean;
  signal: string;
}

export default function DeviceHealth({ battery, solarCharging, signal }: DeviceHealthProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-gray-400 text-xs" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
        Ultimo sincronismo: oggi alle 06:14
      </p>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="rounded-xl p-1.5" style={{ backgroundColor: '#f5f0f8' }}>
            <BatteryCharging size={16} strokeWidth={2} color="#6B2D8C" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-none" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {battery}%
            </p>
            <p className="text-xs text-gray-400 leading-none mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {solarCharging ? 'Carica solare' : 'Su batteria'}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="rounded-xl p-1.5" style={{ backgroundColor: '#e6faf5' }}>
            <Signal size={16} strokeWidth={2} color="#20C997" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-none" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {signal} Attivo
            </p>
            <p className="text-xs text-gray-400 leading-none mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              Connessione stabile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
