import { useState } from 'react';
import { X, Layers, List, Info } from 'lucide-react';
import type { Hive } from '../data/mockData';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const W = 800;
const H = 280;
const PAD = { top: 28, right: 24, bottom: 36, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

interface TimeSlot {
  start: number;
  end: number;
  label: string;
  shortLabel: string;
  fill: string;
  textColor: string;
  isCrown: boolean;
  icon: string;
  description: string;
  what: string;
  why: string;
  warning?: string;
}

const TIME_SLOTS: TimeSlot[] = [
  {
    start: 6, end: 11,
    label: 'Mattina',
    shortLabel: '06:00 - 11:00',
    fill: '#fef9e7',
    textColor: '#b45309',
    isCrown: false,
    icon: '🌅',
    description: 'Fase di intensa ripresa delle attività. Le api bottinatrici escono per la raccolta di nettare e polline fresco.',
    what: 'Le bottinatrici escono nelle prime ore del mattino per le raccolte di polline e nettare. Il traffico al portale cresce progressivamente con il riscaldarsi dell\'aria.',
    why: 'Questo è il periodo più indicato per osservare il comportamento della colonia: un flusso ordinato e bidirezionale indica una colonia sana e ben orientata.',
  },
  {
    start: 14, end: 16,
    label: 'Primo Pomeriggio',
    shortLabel: '14:00 - 16:00',
    fill: '#fef3c7',
    textColor: '#a16207',
    isCrown: false,
    icon: '☀️',
    description: 'Picco di calore giornaliero. Monitoraggio della ventilazione dell\'alveare e stabilità dei voli regolari.',
    what: 'Le temperature raggiungono il picco giornaliero. Le api continuano a bottinare con intensità, privilegiando fonti di nettare vicine all\'alveare.',
    why: 'Un\'attività sostenuta in questa fascia indica buona disponibilità floreale nel raggio di 1–3 km.',
  },
  {
    start: 16, end: 19,
    label: 'Volo della Regina',
    shortLabel: '16:00 - 19:00',
    fill: '#fde8c8',
    textColor: '#b45309',
    isCrown: true,
    icon: '👑',
    description: 'Finestra critica per il volo nuziale della regina e l\'orientamento dei giovani fuchi.',
    what: 'La regina vergine esce dall\'alveare per il volo di accoppiamento con i fuchi ad alta quota. L\'evento dura 20–30 minuti.',
    why: 'È un momento critico che determina la genetica, la fecondità della regina e il futuro intero della colonia.',
    warning: 'Evitare qualsiasi disturbo fisico all\'alveare in questa fascia oraria. Urti o aperture possono compromettere irreversibilmente il volo nuziale.',
  },
  {
    start: 19, end: 24,
    label: 'Sera',
    shortLabel: '19:00 - 24:00',
    fill: '#dce8f5',
    textColor: '#3b82f6',
    isCrown: false,
    icon: '🌙',
    description: 'Rientro totale dello sciame. Fase di riposo, ventilazione notturna ed elaborazione termica interna.',
    what: 'L\'attività di volo si riduce rapidamente dopo il tramonto. Le api rientrano nell\'alveare e avviano la termoregolazione notturna.',
    why: 'Un calo netto del traffico al portale in questa fascia è del tutto normale.',
  },
];

const HIVE_COLORS = ['#6B2D8C', '#0d9488', '#b45309', '#dc2626', '#0369a1'];

function smooth(points: [number, number][]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const cpx = (px + cx) / 2;
    d += ` C ${cpx} ${py}, ${cpx} ${cy}, ${cx} ${cy}`;
  }
  return d;
}

interface ActivityChartProps {
  hives: Hive[];
  aggregatedToday: number[];
  aggregatedYesterday: number[];
}

export default function ActivityChart({
  hives,
  aggregatedToday,
  aggregatedYesterday,
}: ActivityChartProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'aggregate' | 'breakdown'>('aggregate');
  const [selectedHiveId, setSelectedHiveId] = useState<string | null>(null);

  const currentHour = new Date().getHours();
  const xStep = INNER_W / (24 - 1);

  const currentSlot = TIME_SLOTS.find(s => currentHour >= s.start && currentHour < s.end) ?? null;

  // Prepare data for chart - truncate today at current hour, show full yesterday
  const truncateAtHour = (arr: number[]) => arr.slice(0, currentHour + 1);

  // Get max values from data that will actually be displayed
  const todayDisplayData = viewMode === 'aggregate'
    ? truncateAtHour(aggregatedToday)
    : hives.flatMap(h => truncateAtHour(h.hourly_activity));
  const yesterdayDisplayData = viewMode === 'aggregate'
    ? aggregatedYesterday // Show full yesterday for comparison
    : hives.flatMap(h => h.hourly_activity_yesterday);

  const rawMax = Math.max(...todayDisplayData, ...yesterdayDisplayData, 1);

  // Calculate nice scale max (rounded up to nearest nice number)
  const getNiceMax = (max: number): number => {
    if (max <= 0) return 100;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const normalized = max / magnitude;
    let nice: number;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 5) nice = 5;
    else nice = 10;
    return nice * magnitude;
  };

  const scaleMax = getNiceMax(rawMax);

  // Generate Y-axis ticks
  const yTicks = [0, scaleMax * 0.25, scaleMax * 0.5, scaleMax * 0.75, scaleMax].map(v => Math.round(v));
  const currentX = PAD.left + currentHour * xStep;

  const renderLine = (
    data: number[],
    color: string,
    isDashed: boolean = false,
    showArea: boolean = false
  ) => {
    const displayData = truncateAtHour(data);
    const pts: [number, number][] = displayData.map((v, i) => [
      PAD.left + i * xStep,
      PAD.top + INNER_H - (v / scaleMax) * INNER_H,
    ]);

    const linePath = smooth(pts);
    if (!linePath) return null;

    const areaPath = showArea
      ? `${linePath} L ${pts[pts.length - 1][0]} ${PAD.top + INNER_H} L ${pts[0][0]} ${PAD.top + INNER_H} Z`
      : null;

    return (
      <>
        {areaPath && (
          <path
            d={areaPath}
            fill={color}
            fillOpacity="0.15"
            clipPath="url(#chartClip)"
          />
        )}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={isDashed ? 2 : 2.5}
          strokeDasharray={isDashed ? '6 4' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#chartClip)"
          opacity={isDashed ? 0.6 : 1}
        />
      </>
    );
  };

  const selectedHive = selectedHiveId
    ? hives.find(h => h.id === selectedHiveId) ?? null
    : null;

  return (
    <>
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'white' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Attività Api — 24h
              </h3>
              <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                {viewMode === 'aggregate'
                  ? 'Totale aggregato di tutti gli alveari'
                  : 'Dettaglio per singolo alveare'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* View mode toggle */}
              {hives.length > 1 && (
                <div
                  className="flex items-center rounded-full p-0.5"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  <button
                    onClick={() => setViewMode('aggregate')}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: viewMode === 'aggregate' ? 'white' : 'transparent',
                      color: viewMode === 'aggregate' ? '#6B2D8C' : '#6b7280',
                      fontFamily: 'Afacad Flux, sans-serif',
                      boxShadow: viewMode === 'aggregate' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    <Layers size={12} strokeWidth={2.5} />
                    Aggregato
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('breakdown');
                      if (!selectedHiveId && hives.length > 0) {
                        setSelectedHiveId(hives[0].id);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: viewMode === 'breakdown' ? 'white' : 'transparent',
                      color: viewMode === 'breakdown' ? '#6B2D8C' : '#6b7280',
                      fontFamily: 'Afacad Flux, sans-serif',
                      boxShadow: viewMode === 'breakdown' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    <List size={12} strokeWidth={2.5} />
                    Per alveare
                  </button>
                </div>
              )}

              {/* Info button to open modal */}
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:bg-gray-100"
                style={{
                  backgroundColor: '#f9fafb',
                  color: '#6b7280',
                  fontFamily: 'Afacad Flux, sans-serif',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Info size={14} strokeWidth={2.5} />
                Fasce orarie
              </button>
            </div>
          </div>

          {/* Current slot indicator */}
          {currentSlot && (
            <div
              className="flex items-center gap-2 mb-3"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentSlot.textColor }}
              />
              <span className="text-xs text-gray-500">
                Fascia attuale:
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: currentSlot.textColor }}
              >
                {currentSlot.isCrown && '♛ '}{currentSlot.label}
              </span>
              <span className="text-xs text-gray-400">
                ({currentSlot.shortLabel})
              </span>
            </div>
          )}

          {/* Hive selector for breakdown mode */}
          {viewMode === 'breakdown' && hives.length > 1 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {hives.map((hive, idx) => {
                const isSelected = selectedHiveId === hive.id;
                const currentTotal = truncateAtHour(hive.hourly_activity).reduce((a, b) => a + b, 0);

                return (
                  <button
                    key={hive.id}
                    onClick={() => setSelectedHiveId(hive.id)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
                    style={{
                      backgroundColor: isSelected ? HIVE_COLORS[idx % HIVE_COLORS.length] + '15' : '#f9fafb',
                      border: `1.5px solid ${isSelected ? HIVE_COLORS[idx % HIVE_COLORS.length] : '#e5e7eb'}`,
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: HIVE_COLORS[idx % HIVE_COLORS.length] }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: isSelected ? HIVE_COLORS[idx % HIVE_COLORS.length] : '#374151',
                        fontFamily: 'Afacad Flux, sans-serif',
                      }}
                    >
                      {hive.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: '#6b7280',
                        fontFamily: 'Afacad Flux, sans-serif',
                      }}
                    >
                      {currentTotal.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
              style={{ minWidth: 320 }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B2D8C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6B2D8C" stopOpacity="0.02" />
                </linearGradient>
                <clipPath id="chartClip">
                  <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
                </clipPath>
              </defs>

              {/* Time slot bands - only colored rects, no labels */}
              {TIME_SLOTS.map((slot) => {
                const x = PAD.left + slot.start * xStep;
                const w = (slot.end - slot.start) * xStep;
                const isActive = currentSlot?.label === slot.label;

                return (
                  <rect
                    key={slot.label}
                    x={x}
                    y={PAD.top}
                    width={w}
                    height={INNER_H}
                    fill={slot.fill}
                    opacity={isActive ? 0.85 : 0.5}
                    clipPath="url(#chartClip)"
                  />
                );
              })}

              {/* Y gridlines */}
              {yTicks.map(v => {
                const y = PAD.top + INNER_H - (v / scaleMax) * INNER_H;
                return (
                  <g key={v}>
                    <line
                      x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y}
                      stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
                    />
                    <text
                      x={PAD.left - 8} y={y + 4}
                      textAnchor="end" fontSize="11" fill="#9ca3af"
                      style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                    >
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* Render lines based on view mode */}
              {viewMode === 'aggregate' ? (
                <>
                  {renderLine(aggregatedYesterday, '#b0b8c1', true)}
                  {renderLine(aggregatedToday, '#6B2D8C', false, true)}
                </>
              ) : selectedHive ? (
                <>
                  {renderLine(selectedHive.hourly_activity_yesterday, '#b0b8c1', true)}
                  {renderLine(selectedHive.hourly_activity, HIVE_COLORS[hives.findIndex(h => h.id === selectedHive.id) % HIVE_COLORS.length], false, true)}
                </>
              ) : (
                hives.map((hive, idx) => (
                  <g key={hive.id}>
                    {renderLine(hive.hourly_activity_yesterday, '#b0b8c1', true)}
                    {renderLine(hive.hourly_activity, HIVE_COLORS[idx % HIVE_COLORS.length])}
                  </g>
                ))
              )}

              {/* X axis labels */}
              {HOURS.filter(h => h % 4 === 0).map(h => {
                const x = PAD.left + h * xStep;
                return (
                  <text
                    key={h}
                    x={x} y={H - 8}
                    textAnchor="middle" fontSize="11" fill="#9ca3af"
                    style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                  >
                    {`${String(h).padStart(2, '0')}:00`}
                  </text>
                );
              })}

              {/* Current hour marker */}
              <line
                x1={currentX} y1={PAD.top}
                x2={currentX} y2={PAD.top + INNER_H}
                stroke="#6B2D8C" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            {viewMode === 'aggregate' ? (
              <>
                <span className="flex items-center gap-1.5 text-xs text-gray-500" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  <svg width="20" height="10" viewBox="0 0 20 10">
                    <line x1="0" y1="5" x2="20" y2="5" stroke="#6B2D8C" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Oggi (totale)
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  <svg width="20" height="10" viewBox="0 0 20 10">
                    <line x1="0" y1="5" x2="20" y2="5" stroke="#b0b8c1" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                  </svg>
                  Ieri (totale)
                </span>
              </>
            ) : selectedHive ? (
              <>
                <span className="flex items-center gap-1.5 text-xs text-gray-500" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: HIVE_COLORS[hives.findIndex(h => h.id === selectedHive.id) % HIVE_COLORS.length] }}
                  />
                  {selectedHive.name} — Oggi
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  <svg width="20" height="10" viewBox="0 0 20 10">
                    <line x1="0" y1="5" x2="20" y2="5" stroke="#b0b8c1" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                  </svg>
                  {selectedHive.name} — Ieri
                </span>
              </>
            ) : (
              hives.map((hive, idx) => (
                <span key={hive.id} className="flex items-center gap-1.5 text-xs text-gray-500" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: HIVE_COLORS[idx % HIVE_COLORS.length] }}
                  />
                  {hive.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal with full time slot legend */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4" style={{ backgroundColor: '#f9fafb' }}>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1.5 transition-colors hover:bg-gray-200"
                style={{ color: '#6b7280' }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl p-2"
                  style={{ backgroundColor: '#f5f0f8' }}
                >
                  <Info size={20} strokeWidth={2} color="#6B2D8C" />
                </div>
                <div>
                  <h2
                    className="font-bold text-lg"
                    style={{ color: '#1e293b', fontFamily: 'Comfortaa, sans-serif' }}
                  >
                    Fasce Orarie Giornaliere
                  </h2>
                  <p
                    className="text-xs text-gray-500 mt-0.5"
                    style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                  >
                    I ritmi naturali dell\'attività delle api
                  </p>
                </div>
              </div>
            </div>

            {/* Time slots list */}
            <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {TIME_SLOTS.map((slot, idx) => {
                const isActive = currentSlot?.label === slot.label;

                return (
                  <div
                    key={slot.label}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: slot.fill,
                      border: isActive ? `2px solid ${slot.textColor}` : '1px solid transparent',
                    }}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {/* Colored badge */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: 'white' }}
                        >
                          <span style={{ fontSize: '20px' }}>{slot.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className="font-semibold text-sm"
                              style={{ color: slot.textColor, fontFamily: 'Comfortaa, sans-serif' }}
                            >
                              {slot.isCrown && '♛ '}{slot.label}
                            </p>
                            {isActive && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                  backgroundColor: slot.textColor,
                                  color: 'white',
                                  fontFamily: 'Afacad Flux, sans-serif',
                                }}
                              >
                                Attivo
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: slot.textColor, opacity: 0.7, fontFamily: 'Afacad Flux, sans-serif' }}
                          >
                            {slot.shortLabel}
                          </p>
                          <p
                            className="text-sm mt-2 leading-relaxed"
                            style={{ color: '#374151', fontFamily: 'Afacad Flux, sans-serif' }}
                          >
                            {slot.description}
                          </p>
                        </div>
                      </div>

                      {slot.warning && (
                        <div
                          className="flex items-start gap-2 mt-3 px-3 py-2 rounded-xl"
                          style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                        >
                          <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>
                            {idx === 2 ? '⚠️' : ''}
                          </span>
                          {slot.warning && idx === 2 && (
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: '#c2410c', fontFamily: 'Afacad Flux, sans-serif' }}
                            >
                              {slot.warning}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full rounded-2xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: '#f5f0f8',
                  color: '#6B2D8C',
                  fontFamily: 'Afacad Flux, sans-serif',
                }}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
