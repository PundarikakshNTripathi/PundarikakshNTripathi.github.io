// Schematic figures for the featured projects. They illustrate the idea, not measured data.
// Colours come from CSS variables so they follow the theme.
const INK = 'var(--ink-3)';
const RULE = 'var(--rule-strong)';
const TILE = 'var(--tile)';
const WEAK = 'var(--tile-weak)';
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
    [46, 42, 30, 16, -25, 0.55],
    [104, 70, 36, 18, 20, 0.45],
    [70, 88, 18, 10, 60, 0.8],
    [128, 30, 16, 10, -10, 0.5],
  ];
  // Tiles touched by a splat's bounding circle are shaded, like the per-tile lists a rasterizer builds.
  const hit = (cx, cy) => splats.some(([x, y, rx]) => Math.hypot(cx - x, cy - y) < rx + s * 0.35);
  return (
    <>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = (i % cols) * s;
        const y = Math.floor(i / cols) * s;
        return hit(x + s / 2, y + s / 2) ? <rect key={i} x={x} y={y} width={s} height={s} fill={WEAK} /> : null;
      })}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * s} y1="0" x2={i * s} y2={rows * s} stroke={RULE} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * s} x2={cols * s} y2={i * s} stroke={RULE} strokeWidth="1" vectorEffect="non-scaling-stroke" />
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
        if (v === 0) {
          return (
            <rect key={i} x={x} y={y} width="14" height="14" rx="1.5" fill="none" stroke={RULE} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          );
        }
        return (
          <g key={i}>
            <rect x={x} y={y} width="14" height="14" rx="1.5" fill={v === 1 ? TILE : WEAK} opacity={v === 1 ? 0.6 : 1} />
            <line x1={x + 4} y1={y + 7} x2={x + 10} y2={y + 7} stroke={INK} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            {v === 1 && (
              <line x1={x + 7} y1={y + 4} x2={x + 7} y2={y + 10} stroke={INK} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            )}
          </g>
        );
      })}
    </>
  );
};

// Aegis: syscalls from the agent cross the kernel boundary into a behavior graph.
// Each step alone is allowed; the pink sequence adds up to an attack and is stopped at the hook.
const Layers = () => {
  const xs = [18, 50, 82, 114, 146];
  return (
    <>
      <defs>
        <marker id="layers-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L6 3L0 6z" fill={INK} />
        </marker>
      </defs>
      <rect x="2" y="2" width="156" height="30" rx="3" fill={WEAK} />
      {xs.map((x, i) => (
        <circle key={`e${i}`} cx={x} cy="17" r="5" fill={i === 4 ? DOT : TILE} opacity={i === 4 ? 0.9 : 0.6} />
      ))}
      {xs.slice(0, 4).map((x) => (
        <line key={`d${x}`} x1={x} y1="25" x2={x} y2="80" stroke={INK} strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#layers-arrow)" />
      ))}
      <line x1={xs[4]} y1="25" x2={xs[4]} y2="44" stroke={DOT} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <line x1={xs[4] - 7} y1="50" x2={xs[4] + 7} y2="50" stroke={DOT} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="50" x2="160" y2="50" stroke={RULE} strokeWidth="1" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
      {[
        [18, 96],
        [50, 106],
        [82, 92],
        [114, 104],
      ].map(([x, y], i, arr) => (
        <g key={`n${i}`}>
          {i < arr.length - 1 && (
            <line x1={x} y1={y} x2={arr[i + 1][0]} y2={arr[i + 1][1]} stroke={i >= 1 ? DOT : RULE} strokeWidth={i >= 1 ? 1.5 : 1} vectorEffect="non-scaling-stroke" />
          )}
          <circle cx={x} cy={y} r="6" fill="var(--bg)" stroke={i >= 1 ? DOT : INK} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </>
  );
};

// Causal-DML: listening history (X) confounds both the offer (T) and churn (Y).
// Double ML partials X out of both (dashed), leaving the effect of T on Y (pink).
const Dag = () => {
  const node = (x, y, label, strong) => (
    <g>
      <circle cx={x} cy={y} r="15" fill={strong ? WEAK : 'var(--bg)'} stroke={strong ? TILE : INK} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontStyle="italic" fill="var(--ink)" style={{ fontFamily: 'var(--font-serif)' }}>
        {label}
      </text>
    </g>
  );
  return (
    <>
      <defs>
        <marker id="dag-ink" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L6 3L0 6z" fill={INK} />
        </marker>
        <marker id="dag-dot" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L6 3L0 6z" fill={DOT} />
        </marker>
      </defs>
      <line x1="70" y1="31" x2="37" y2="80" stroke={INK} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" markerEnd="url(#dag-ink)" />
      <line x1="90" y1="31" x2="123" y2="80" stroke={INK} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" markerEnd="url(#dag-ink)" />
      <line x1="44" y1="95" x2="112" y2="95" stroke={DOT} strokeWidth="2" vectorEffect="non-scaling-stroke" markerEnd="url(#dag-dot)" />
      {node(80, 18, 'X')}
      {node(28, 95, 'T', true)}
      {node(132, 95, 'Y', true)}
    </>
  );
};

const figures = { tiles: Tiles, ternary: Ternary, layers: Layers, dag: Dag };

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
