import { Activity, FileText } from 'lucide-react';

export type ViewType = 'realtime' | 'daily';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-16 md:w-20 flex flex-col items-center py-6 z-50 shadow-sm"
      style={{ backgroundColor: 'white' }}
    >
      {/* Logo at top */}
      <div
        className="rounded-2xl p-2.5 flex items-center justify-center shadow-sm mb-8"
        style={{ backgroundColor: '#dcfd8b' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a7a10" strokeWidth="2.5">
          <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" />
        </svg>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-col gap-3 flex-1">
        <button
          onClick={() => onViewChange('realtime')}
          className={`group relative flex flex-col items-center justify-center gap-1 w-12 h-14 md:w-14 md:h-16 rounded-2xl transition-all ${
            currentView === 'realtime'
              ? 'shadow-sm'
              : 'hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currentView === 'realtime' ? '#dcfd8b' : 'transparent',
          }}
          title="Realtime Metrics"
        >
          <Activity
            size={20}
            strokeWidth={2.5}
            color={currentView === 'realtime' ? '#5a7a10' : '#9ca3af'}
          />
          <span
            className="text-[9px] md:text-[10px] font-medium leading-none"
            style={{
              color: currentView === 'realtime' ? '#5a7a10' : '#9ca3af',
              fontFamily: 'Afacad Flux, sans-serif',
            }}
          >
            Realtime
          </span>
        </button>

        <button
          onClick={() => onViewChange('daily')}
          className={`group relative flex flex-col items-center justify-center gap-1 w-12 h-14 md:w-14 md:h-16 rounded-2xl transition-all ${
            currentView === 'daily'
              ? 'shadow-sm'
              : 'hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currentView === 'daily' ? '#dcfd8b' : 'transparent',
          }}
          title="Daily Report"
        >
          <FileText
            size={20}
            strokeWidth={2.5}
            color={currentView === 'daily' ? '#5a7a10' : '#9ca3af'}
          />
          <span
            className="text-[9px] md:text-[10px] font-medium leading-none"
            style={{
              color: currentView === 'daily' ? '#5a7a10' : '#9ca3af',
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
