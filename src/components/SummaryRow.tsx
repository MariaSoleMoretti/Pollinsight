import { Activity, Thermometer, Droplets } from 'lucide-react';

interface SummaryRowProps {
  totalBees: number;
  temp: number;
  humidity: number;
  healthScore: number;
}

function StatCard({
  icon,
  label,
  value,
  bg,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="flex-1 rounded-[28px] p-6 shadow-sm flex items-center gap-4 min-w-0"
      style={{ backgroundColor: bg }}
    >
      <div className="rounded-2xl p-3 flex-shrink-0" style={{ backgroundColor: iconBg }}>
        <span style={{ color: iconColor, display: 'flex' }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-gray-500 text-sm truncate" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
          {label}
        </p>
        <p className="font-bold text-gray-800 text-2xl leading-tight truncate" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SummaryRow({ totalBees, temp, humidity, healthScore }: SummaryRowProps) {
  return (
    <div className="flex gap-4 flex-wrap md:flex-nowrap">
      <StatCard
        icon={<Activity size={24} strokeWidth={2.5} />}
        label="Total Activity Today"
        value={`${totalBees.toLocaleString()} bees`}
        bg="#f5edff"
        iconBg="#bc84ee"
        iconColor="white"
      />
      <StatCard
        icon={<Thermometer size={24} strokeWidth={2.5} />}
        label="Temperature"
        value={`${temp}°C`}
        bg="#dcfd8b"
        iconBg="#a8d04a"
        iconColor="white"
      />
      <StatCard
        icon={<Droplets size={24} strokeWidth={2.5} />}
        label="Humidity"
        value={`${humidity}%`}
        bg="#fdd5bd"
        iconBg="#ff823a"
        iconColor="white"
      />
      <div
        className="flex-1 rounded-[28px] p-6 shadow-sm flex items-center gap-4 min-w-0"
        style={{ backgroundColor: '#e8f9f0' }}
      >
        <div className="relative flex-shrink-0 w-14 h-14">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#c5edd9" strokeWidth="5" />
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke="#28c76f"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - healthScore / 100)}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            {healthScore}
          </span>
        </div>
        <div>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            Hive Health Score
          </p>
          <p className="font-bold text-green-600 text-2xl leading-tight" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Excellent
          </p>
        </div>
      </div>
    </div>
  );
}
