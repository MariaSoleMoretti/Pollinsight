const HOURS = Array.from({ length: 24 }, (_, i) => i);
const W = 800;
const H = 300;
const PAD = { top: 48, right: 24, bottom: 36, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

interface TimeSlot {
  start: number;
  end: number;
  label: string;
  fill: string;
  activeFill: string;
  textColor: string;
  isCrown: boolean;
  info: string;
}

const TIME_SLOTS: TimeSlot[] = [
  {
    start: 6, end: 11,
    label: 'Mattina – Mezzogiorno',
    fill: '#fef9e7', activeFill: '#fef08a',
    textColor: '#b45309', isCrown: false,
    info: 'Le api escono per le prime raccolte del giorno. L\'attività aumenta rapidamente con il riscaldarsi dell\'aria. Periodo ideale per osservare il traffico al portale e verificare lo stato della colonia.',
  },
  {
    start: 14, end: 16,
    label: 'Primo Pomeriggio',
    fill: '#fef3c7', activeFill: '#fde68a',
    textColor: '#a16207', isCrown: false,
    info: 'Picco di attività secondario. Le bottinatrici tornano cariche di polline e nettare. Alta densità al portale: normale se il flusso è bidirezionale e ordinato.',
  },
  {
    start: 16, end: 19,
    label: 'Volo della Regina',
    fill: '#fde8c8', activeFill: '#fdba74',
    textColor: '#b45309', isCrown: true,
    info: 'La regina vergine esce per l\'accoppiamento con i fuchi. Momento cruciale e delicato per la genetica e la continuità dell\'alveare. Evitare interventi: qualsiasi disturbo può compromettere il volo nuziale.',
  },
  {
    start: 19, end: 24,
    label: 'Sera',
    fill: '#dce8f5', activeFill: '#bfdbfe',
    textColor: '#3b82f6', isCrown: false,
    info: 'L\'attività diminuisce rapidamente. Le api rientrano nell\'alveare e iniziano la termoregolazione notturna. Un calo netto del traffico al portale è del tutto normale in questa fascia.',
  },
];

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
  data: number[];
  previousData?: number[];
}

export default function ActivityChart({ data, previousData }: ActivityChartProps) {
  const currentHour = new Date().getHours();
  const maxVal = Math.max(...data, ...(previousData ?? []), 1);
  const xStep = INNER_W / (data.length - 1);

  const currentSlot = TIME_SLOTS.find(s => currentHour >= s.start && currentHour < s.end) ?? null;

  const currentDataToDisplay = data.slice(0, currentHour + 1);

  const pts: [number, number][] = currentDataToDisplay.map((v, i) => [
    PAD.left + i * xStep,
    PAD.top + INNER_H - (v / maxVal) * INNER_H,
  ]);

  const prevPts: [number, number][] | null = previousData
    ? previousData.map((v, i) => [
        PAD.left + i * xStep,
        PAD.top + INNER_H - (v / maxVal) * INNER_H,
      ])
    : null;

  const linePath = smooth(pts);
  const areaPath =
    pts.length > 1
      ? `${linePath} L ${pts[pts.length - 1][0]} ${PAD.top + INNER_H} L ${pts[0][0]} ${PAD.top + INNER_H} Z`
      : '';
  const prevLinePath = prevPts ? smooth(prevPts) : null;

  const yTicks = [0, 300, 600, 900, 1200].filter(v => v <= maxVal + 200);
  const currentX = PAD.left + currentHour * xStep;

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'white' }}>
      {/* Info box for the active time slot */}
      {currentSlot && (
        <div
          className="px-6 pt-5 pb-4 flex items-start gap-4 border-b"
          style={{ borderColor: '#f3f4f6', backgroundColor: currentSlot.activeFill + '55' }}
        >
          <div
            className="rounded-xl px-3 py-1.5 flex-shrink-0 text-xs font-bold flex items-center gap-1.5 mt-0.5"
            style={{
              backgroundColor: currentSlot.activeFill,
              color: currentSlot.textColor,
              fontFamily: 'Afacad Flux, sans-serif',
            }}
          >
            {currentSlot.isCrown && <span style={{ fontSize: '13px' }}>♛</span>}
            Fascia attuale
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-bold text-sm"
              style={{ color: currentSlot.textColor, fontFamily: 'Comfortaa, sans-serif' }}
            >
              {currentSlot.isCrown ? `♛ ${currentSlot.label}` : currentSlot.label}
            </p>
            <p
              className="text-xs text-gray-500 mt-1 leading-relaxed"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              {currentSlot.info}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Attività Api — 24h
            </h3>
            <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              Entrate e uscite attraverso il sensore del portale alveare
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            <span className="flex items-center gap-1.5 text-gray-500">
              <svg width="20" height="10" viewBox="0 0 20 10">
                <line x1="0" y1="5" x2="20" y2="5" stroke="#6B2D8C" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Oggi
            </span>
            {prevLinePath && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <svg width="20" height="10" viewBox="0 0 20 10">
                  <line x1="0" y1="5" x2="20" y2="5" stroke="#b0b8c1" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                </svg>
                Ieri
              </span>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ minWidth: 320 }}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B2D8C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6B2D8C" stopOpacity="0.02" />
              </linearGradient>
              <clipPath id="chartClip">
                <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
              </clipPath>
            </defs>

            {/* Time slot bands */}
            {TIME_SLOTS.map((slot) => {
              const x = PAD.left + slot.start * xStep;
              const w = (slot.end - slot.start) * xStep;
              const midX = x + w / 2;
              const isActive = currentSlot?.label === slot.label;

              return (
                <g key={slot.label}>
                  {/* Band background — brighter if active */}
                  <rect
                    x={x}
                    y={PAD.top}
                    width={w}
                    height={INNER_H}
                    fill={isActive ? slot.activeFill : slot.fill}
                    opacity={isActive ? 0.85 : 0.6}
                    clipPath="url(#chartClip)"
                  />
                  {/* Active: luminous top border */}
                  {isActive && (
                    <rect
                      x={x}
                      y={PAD.top}
                      width={w}
                      height={3}
                      fill={slot.textColor}
                      opacity="0.7"
                      clipPath="url(#chartClip)"
                    />
                  )}
                  {/* Band label */}
                  <text
                    x={midX}
                    y={PAD.top - 7}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill={slot.textColor}
                    fontWeight={isActive ? '700' : '600'}
                    style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                  >
                    {slot.isCrown ? `♛ ${slot.label}` : slot.label}
                  </text>
                  {/* Top indicator line */}
                  <line
                    x1={x}
                    y1={PAD.top - 20}
                    x2={x + w}
                    y2={PAD.top - 20}
                    stroke={slot.textColor}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeLinecap="round"
                    opacity={isActive ? 0.8 : 0.4}
                  />
                </g>
              );
            })}

            {/* Y gridlines */}
            {yTicks.map(v => {
              const y = PAD.top + INNER_H - (v / maxVal) * INNER_H;
              return (
                <g key={v}>
                  <line
                    x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y}
                    stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
                  />
                  <text
                    x={PAD.left - 8} y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#9ca3af"
                    style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Yesterday line */}
            {prevLinePath && (
              <path
                d={prevLinePath}
                fill="none"
                stroke="#b0b8c1"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#chartClip)"
                opacity="0.7"
              />
            )}

            {/* Area fill */}
            {areaPath && (
              <path d={areaPath} fill="url(#areaGrad)" clipPath="url(#chartClip)" />
            )}

            {/* Today line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#6B2D8C"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#chartClip)"
              />
            )}

            {/* Dots at peaks */}
            {pts.map(([x, y], i) =>
              data[i] > 300 ? (
                <circle key={i} cx={x} cy={y} r="4" fill="#6B2D8C" stroke="white" strokeWidth="2" />
              ) : null
            )}

            {/* X axis labels */}
            {HOURS.filter(h => h % 4 === 0).map(h => {
              const x = PAD.left + h * xStep;
              const label = `${String(h).padStart(2, '0')}:00`;
              return (
                <text
                  key={h}
                  x={x} y={H - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#9ca3af"
                  style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                >
                  {label}
                </text>
              );
            })}

            {/* Current hour marker */}
            <line
              x1={currentX}
              y1={PAD.top}
              x2={currentX}
              y2={PAD.top + INNER_H}
              stroke="#6B2D8C"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <text
              x={currentX + 5}
              y={PAD.top + 11}
              fontSize="9"
              fill="#6B2D8C"
              fontWeight="700"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Ora
            </text>

          </svg>
        </div>
      </div>
    </div>
  );
}
