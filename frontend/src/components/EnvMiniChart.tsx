const W = 360;
const H = 120;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

function smoothLine(points: [number, number][]): string {
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

interface EnvMiniChartProps {
  data: number[];
  label: string;
  unit: string;
  color: string;
  bgColor: string;
  gradId: string;
  gradStart: string;
}

export default function EnvMiniChart({ data, label, unit, color, bgColor, gradId, gradStart }: EnvMiniChartProps) {
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const xStep = INNER_W / (data.length - 1);

  const pts: [number, number][] = data.map((v, i) => [
    PAD.left + i * xStep,
    PAD.top + INNER_H - ((v - minVal) / range) * INNER_H,
  ]);

  const linePath = smoothLine(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]} ${PAD.top + INNER_H} L ${pts[0][0]} ${PAD.top + INNER_H} Z`;

  const current = data[data.length - 1];
  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <div className="flex-1 rounded-[10px] p-5 shadow-sm" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-gray-700 text-base" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          {label}
        </p>
        <span
          className="font-bold text-lg"
          style={{ color, fontFamily: 'Comfortaa, sans-serif' }}
        >
          {current.toFixed(1)}{unit}
        </span>
      </div>
      <p className="text-gray-400 text-xs mb-3" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
        24-hour trend
      </p>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradStart} stopOpacity="0.3" />
              <stop offset="100%" stopColor={gradStart} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`clip-${gradId}`}>
              <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
            </clipPath>
          </defs>

          {yTicks.map((v, idx) => {
            const y = PAD.top + INNER_H - ((v - minVal) / range) * INNER_H;
            return (
              <g key={idx}>
                <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
                <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#aaa" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  {v.toFixed(0)}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill={`url(#${gradId})`} clipPath={`url(#clip-${gradId})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" clipPath={`url(#clip-${gradId})`} />

          {[0, 6, 12, 18, 23].map(h => (
            <text key={h} x={PAD.left + h * xStep} y={H - 6} textAnchor="middle" fontSize="9" fill="#bbb" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              {h === 0 ? '12a' : h === 12 ? '12p' : h < 12 ? `${h}a` : `${h - 12}p`}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
