// The mark: a causal attention mask. Each row is one token's attention over the tokens before it;
// the diagonal (pink) is a token attending to itself, and the empty upper triangle is the future it
// isn't allowed to see. Same drawing as public/favicon.svg.
const N = 4;
const PAD = 12;
const GAP = 3.2;
const CELL = (64 - 2 * PAD - (N - 1) * GAP) / N;

// Row-wise softmax that favors recent tokens, scaled to an opacity range.
const weights = Array.from({ length: N }, (_, i) => {
  const raw = Array.from({ length: i + 1 }, (_, j) => Math.exp(1.2 * (j - i)));
  const total = raw.reduce((a, b) => a + b, 0);
  const w = raw.map((r) => r / total);
  const max = i > 0 ? Math.max(...w.slice(0, -1)) : 1;
  return w.map((x) => 0.22 + 0.56 * (x / max));
});

const Logo = ({ size = 28, className = '' }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
    <rect width="64" height="64" rx="15" fill="#1f1236" />
    <rect x=".75" y=".75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#d4a9f8" strokeOpacity=".35" strokeWidth="1.5" />
    {Array.from({ length: N * N }, (_, k) => {
      const i = Math.floor(k / N);
      const j = k % N;
      const x = PAD + j * (CELL + GAP);
      const y = PAD + i * (CELL + GAP);
      const props = { x, y, width: CELL, height: CELL, rx: CELL * 0.2 };
      if (j === i) return <rect key={k} {...props} fill="#ff6cb5" />;
      if (j < i) return <rect key={k} {...props} fill="#e2c9fb" fillOpacity={weights[i][j].toFixed(2)} />;
      return <rect key={k} {...props} fill="#e2c9fb" fillOpacity="0.07" />;
    })}
  </svg>
);

export default Logo;
