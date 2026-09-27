// Small schematic figures, one per project. They illustrate the idea, not measured data.
// Colours come from CSS variables so they follow the theme.
const INK = 'var(--ink-3)';
const RULE = 'var(--rule-strong)';
const TILE = 'var(--tile)';
const DOT = 'var(--dot)';

// Deterministic pseudo-random values so figures are identical on every render.
const seq = (n, seed) => {
  let x = seed;
  return Array.from({ length: n }, () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  });
};

// VoltaSplat: screen split into 16×16 tiles, Gaussians splatted across them.
const Tiles = () => {
  const cols = 8;
  const rows = 6;
  const s = 20;
  const splats = [
    [46, 42, 30, 16, -25, 0.5],
    [104, 70, 36, 18, 20, 0.4],
    [70, 88, 18, 10, 60, 0.55],
    [128, 30, 16, 10, -10, 0.45],
  ];
  // Tiles touched by a splat's bounding circle are shaded, like the per-tile lists a rasterizer builds.
  const hit = (cx, cy) =>
    splats.some(([x, y, rx]) => Math.hypot(cx - x, cy - y) < rx + s * 0.35);
  return (
    <>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = (i % cols) * s;
        const y = Math.floor(i / cols) * s;
        return hit(x + s / 2, y + s / 2) ? (
          <rect key={i} x={x} y={y} width={s} height={s} fill={TILE} opacity="0.1" />
        ) : null;
      })}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * s} y1="0" x2={i * s} y2={rows * s} stroke={RULE} strokeWidth="0.75" />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * s} x2={cols * s} y2={i * s} stroke={RULE} strokeWidth="0.75" />
      ))}
      {splats.map(([x, y, rx, ry, rot, o], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          transform={`rotate(${rot} ${x} ${y})`}
          fill={i === 2 ? DOT : TILE}
          opacity={o}
        />
      ))}
    </>
  );
};

// TernixEngine: a weight matrix where every entry is −1, 0 or +1.
const Ternary = () => {
  const vals = seq(8 * 6, 7).map((v) => (v < 0.33 ? -1 : v < 0.62 ? 0 : 1));
  return (
    <>
      {vals.map((v, i) => {
        const x = (i % 8) * 20 + 3;
        const y = Math.floor(i / 8) * 20 + 3;
        if (v === 0) return <rect key={i} x={x} y={y} width="14" height="14" rx="1.5" fill="none" stroke={RULE} strokeWidth="0.75" />;
        return (
          <g key={i}>
            <rect x={x} y={y} width="14" height="14" rx="1.5" fill={TILE} opacity={v === 1 ? 0.55 : 0.18} />
            <line x1={x + 4} y1={y + 7} x2={x + 10} y2={y + 7} stroke={INK} strokeWidth="1.25" />
            {v === 1 && <line x1={x + 7} y1={y + 4} x2={x + 7} y2={y + 10} stroke={INK} strokeWidth="1.25" />}
          </g>
        );
      })}
    </>
  );
};

// nanoDist: ring all-reduce, each worker passes a chunk to its neighbour.
const Ring = () => {
  const n = 5;
  const cx = 80;
  const cy = 60;
  const r = 40;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return (
    <>
      <defs>
        <marker id="ring-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L6 3L0 6z" fill={INK} />
        </marker>
      </defs>
      {pts.map(([x, y], i) => {
        const [nx, ny] = pts[(i + 1) % n];
        const dx = nx - x;
        const dy = ny - y;
        const len = Math.hypot(dx, dy);
        const k = 13 / len;
        return (
          <line
            key={`e${i}`}
            x1={x + dx * k}
            y1={y + dy * k}
            x2={nx - dx * k}
            y2={ny - dy * k}
            stroke={INK}
            strokeWidth="1"
            markerEnd="url(#ring-arrow)"
          />
        );
      })}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 9} y={y - 9} width="18" height="18" rx="2" fill="var(--bg)" stroke={RULE} />
          <rect x={x - 5} y={y - 5} width="10" height="10" rx="1" fill={i === 0 ? DOT : TILE} opacity={i === 0 ? 0.9 : 0.45} />
        </g>
      ))}
    </>
  );
};

// HiveTorch: one server, several clients, each holding a skewed (non-IID) slice of the labels.
const Federated = () => {
  const clients = [16, 48, 80, 112, 144];
  const dist = [
    [0.9, 0.2, 0.1],
    [0.1, 0.8, 0.3],
    [0.3, 0.1, 0.95],
    [0.6, 0.6, 0.1],
    [0.15, 0.3, 0.7],
  ];
  return (
    <>
      {clients.map((x) => (
        <line key={`l${x}`} x1="80" y1="28" x2={x} y2="72" stroke={RULE} strokeWidth="0.75" />
      ))}
      <circle cx="80" cy="20" r="10" fill="var(--bg)" stroke={INK} />
      <circle cx="80" cy="20" r="4" fill={DOT} />
      {clients.map((x, i) => (
        <g key={x}>
          <line x1={x - 12} y1="108" x2={x + 12} y2="108" stroke={RULE} />
          {dist[i].map((h, j) => (
            <rect
              key={j}
              x={x - 11 + j * 8}
              y={108 - h * 32}
              width="6"
              height={h * 32}
              fill={TILE}
              opacity={0.25 + j * 0.2}
            />
          ))}
        </g>
      ))}
    </>
  );
};

// LumaSort: a row of pixels, then the same pixels sorted by brightness.
const Luma = () => {
  const vals = seq(16, 11);
  const sorted = [...vals].sort((a, b) => a - b);
  const row = (arr, y) =>
    arr.map((v, i) => <rect key={`${y}-${i}`} x={i * 10} y={y} width="9" height="34" fill={TILE} opacity={0.08 + v * 0.8} />);
  return (
    <>
      {row(vals, 8)}
      <path d="M80 50v14m-4-4 4 4 4-4" fill="none" stroke={INK} strokeWidth="1" />
      {row(sorted, 72)}
    </>
  );
};

// Cognova: text and image features meet in one ensemble.
const Fusion = () => (
  <>
    <g>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="10" y1={22 + i * 7} x2={i === 3 ? 30 : 42} y2={22 + i * 7} stroke={INK} strokeWidth="1.5" />
      ))}
    </g>
    <rect x="10" y="72" width="32" height="26" rx="1.5" fill={TILE} opacity="0.25" />
    <path d="M14 94l8-10 6 6 5-4 7 8" fill="none" stroke={INK} strokeWidth="1" />
    <rect x="62" y="20" width="30" height="24" rx="2" fill="none" stroke={RULE} />
    <rect x="62" y="74" width="30" height="24" rx="2" fill="none" stroke={RULE} />
    <line x1="48" y1="32" x2="60" y2="32" stroke={INK} />
    <line x1="48" y1="85" x2="60" y2="85" stroke={INK} />
    <path d="M94 32c20 0 18 27 34 27M94 86c20 0 18-27 34-27" fill="none" stroke={INK} />
    <circle cx="138" cy="59" r="10" fill={DOT} opacity="0.85" />
  </>
);

const figures = { tiles: Tiles, ternary: Ternary, ring: Ring, federated: Federated, luma: Luma, fusion: Fusion };

const ProjectFigure = ({ kind, className = '' }) => {
  const Figure = figures[kind];
  if (!Figure) return null;
  return (
    <svg viewBox="-4 -4 168 128" className={className} aria-hidden="true" focusable="false">
      <Figure />
    </svg>
  );
};

export default ProjectFigure;
