import { Activity, Thermometer, Droplets } from 'lucide-react';

interface SummaryRowProps {
  totalBees: number;
  temp: number;
  humidity: number;
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
      className="flex-1 rounded-[10px] p-6 shadow-sm flex items-center gap-4 min-w-0"
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

export default function SummaryRow({ totalBees, temp, humidity }: SummaryRowProps) {
  return (
    <div className="flex gap-4 flex-wrap md:flex-nowrap">
      <StatCard
        icon={<Activity size={24} strokeWidth={2.5} />}
        label="Attività Totale Oggi"
        value={`${totalBees.toLocaleString()} api`}
        bg="#f5f0f8"
        iconBg="#6B2D8C"
        iconColor="white"
      />
      <StatCard
        icon={<Thermometer size={24} strokeWidth={2.5} />}
        label="Temperatura"
        value={`${temp}°C`}
        bg="#fffbd9"
        iconBg="#FFD700"
        iconColor="#6B2D8C"
      />
      <StatCard
        icon={<Droplets size={24} strokeWidth={2.5} />}
        label="Umidità"
        value={`${humidity}%`}
        bg="#e6faf5"
        iconBg="#20C997"
        iconColor="white"
      />
    </div>
  );
}
