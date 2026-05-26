const HOURS = Array.from({ length: 24 }, (_, i) => i);
const W = 800;
const H = 280;
const PAD = { top: 40, right: 24, bottom: 36, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

// Time slots: [startHour, endHour, label, color, textColor]
const TIME_SLOTS: [number, number, string, string, string][] = [
  [6, 11, 'Early Morning to Mid-Day', '#fef9e7', '#c98a00'],
  [14, 16, 'Mid-Afternoon', '#fef3c7', '#b07700'],
  [16, 19, "Queen's Flight Window", '#fde8c8', '#b85c00'],
  [19, 24, 'Evening & Night', '#dce8f5', '#5a88b5'],
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
  const maxVal = Math.max(...data, ...(previousData ?? []), 1);
  const xStep = INNER_W / (data.length - 1);

  const pts: [number, number][] = data.map((v, i) => [
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
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]} ${PAD.top + INNER_H} L ${pts[0][0]} ${PAD.top + INNER_H} Z`;
  const prevLinePath = prevPts ? smooth(prevPts) : null;

  const yTicks = [0, 300, 600, 900, 1200].filter(v => v <= maxVal + 200);

  return (
    <div className="rounded-[28px] p-6 shadow-sm" style={{ backgroundColor: 'white' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Bee Activity — 24h
          </h3>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            Entries &amp; exits through hive gate sensor
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
          <span className="flex items-center gap-1.5 text-gray-500">
            <svg width="20" height="10" viewBox="0 0 20 10">
              <line x1="0" y1="5" x2="20" y2="5" stroke="#5b8dee" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Today
          </span>
          {prevLinePath && (
            <span className="flex items-center gap-1.5 text-gray-400">
              <svg width="20" height="10" viewBox="0 0 20 10">
                <line x1="0" y1="5" x2="20" y2="5" stroke="#b0b8c1" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
              </svg>
              Yesterday
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
              <stop offset="0%" stopColor="#5b8dee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#5b8dee" stopOpacity="0.02" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
            </clipPath>
          </defs>

          {/* Time slot bands */}
          {TIME_SLOTS.map(([start, end, label, fill, textColor]) => {
            const x = PAD.left + start * xStep;
            const w = (end - start) * xStep;
            const midX = x + w / 2;
            return (
              <g key={label}>
                <rect x={x} y={PAD.top} width={w} height={INNER_H} fill={fill} opacity="0.7" clipPath="url(#chartClip)" />
                <text
                  x={midX}
                  y={PAD.top - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill={textColor}
                  fontWeight="600"
                  style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                >
                  {label}
                </text>
                <line x1={x} y1={PAD.top - 14} x2={x + w} y2={PAD.top - 14} stroke={textColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
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

          {/* Yesterday line (behind today) */}
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
          <path d={areaPath} fill="url(#areaGrad)" clipPath="url(#chartClip)" />

          {/* Today line */}
          <path
            d={linePath}
            fill="none"
            stroke="#5b8dee"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#chartClip)"
          />

          {/* Data dots at peaks */}
          {pts.map(([x, y], i) =>
            data[i] > 300 ? (
              <circle key={i} cx={x} cy={y} r="4" fill="#5b8dee" stroke="white" strokeWidth="2" />
            ) : null
          )}

          {/* X axis labels */}
          {HOURS.filter(h => h % 4 === 0).map(h => {
            const x = PAD.left + h * xStep;
            const label = h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`;
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

        </svg>
      </div>
    </div>
  );
}
