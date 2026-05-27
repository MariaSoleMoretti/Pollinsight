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
        Last sync: today at 06:14 AM
      </p>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="rounded-xl p-1.5" style={{ backgroundColor: '#e8f9f0' }}>
            <BatteryCharging size={16} strokeWidth={2} color="#28c76f" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-none" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {battery}%
            </p>
            <p className="text-xs text-gray-400 leading-none mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {solarCharging ? 'Solar charging' : 'On battery'}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="rounded-xl p-1.5" style={{ backgroundColor: '#f0f4ff' }}>
            <Signal size={16} strokeWidth={2} color="#5b8dee" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-none" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {signal} Active
            </p>
            <p className="text-xs text-gray-400 leading-none mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              Connection stable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
