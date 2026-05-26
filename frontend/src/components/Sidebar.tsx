import { Activity, FileText } from 'lucide-react';

export type ViewType = 'realtime' | 'daily';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-24 md:w-32 flex flex-col items-center py-6 z-50 shadow-sm"
      style={{ backgroundColor: 'white' }}
    >
      {/* Logo at top with ladybug image and text */}
      <div
        className="flex flex-col items-center gap-2 mb-8 px-2"
      >
        <img
          src="/coccinella.Dq1fXhvj.svg"
          alt="PollinAction Logo"
          className="w-12 h-12 md:w-14 md:h-14"
        />
        <span
          className="text-xs md:text-sm font-bold text-center leading-tight hidden md:block"
          style={{
            color: '#6B2D8C',
            fontFamily: 'Comfortaa, sans-serif',
          }}
        >
          PolliSight
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-col gap-3 flex-1 w-full px-2">
        <button
          onClick={() => onViewChange('realtime')}
          className={`group relative flex items-center justify-start gap-3 w-full rounded-2xl py-3 px-3 transition-all ${
            currentView === 'realtime'
              ? 'shadow-sm'
              : 'hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currentView === 'realtime' ? '#f5f0f8' : 'transparent',
          }}
          title="Realtime Metrics"
        >
          <Activity
            size={20}
            strokeWidth={2.5}
            color={currentView === 'realtime' ? '#6B2D8C' : '#9ca3af'}
            className="flex-shrink-0"
          />
          <span
            className="text-xs md:text-sm font-medium leading-tight hidden md:block"
            style={{
              color: currentView === 'realtime' ? '#6B2D8C' : '#9ca3af',
              fontFamily: 'Afacad Flux, sans-serif',
            }}
          >
            Realtime
          </span>
        </button>

        <button
          onClick={() => onViewChange('daily')}
          className={`group relative flex items-center justify-start gap-3 w-full rounded-2xl py-3 px-3 transition-all ${
            currentView === 'daily'
              ? 'shadow-sm'
              : 'hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currentView === 'daily' ? '#f5f0f8' : 'transparent',
          }}
          title="Daily Report"
        >
          <FileText
            size={20}
            strokeWidth={2.5}
            color={currentView === 'daily' ? '#6B2D8C' : '#9ca3af'}
            className="flex-shrink-0"
          />
          <span
            className="text-xs md:text-sm font-medium leading-tight hidden md:block"
            style={{
              color: currentView === 'daily' ? '#6B2D8C' : '#9ca3af',
              fontFamily: 'Afacad Flux, sans-serif',
            }}
          >
            Daily
          </span>
        </button>
      </nav>
    </aside>
  );
}
