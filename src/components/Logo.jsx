import { useId } from 'react';

// The mark: a loss landscape seen from above. Two contour lines of an ill-conditioned valley, and the
// zigzag path gradient descent takes across it to the minimum. Same drawing as public/favicon.svg.
const Logo = ({ size = 28, className = '' }) => {
  const bg = `bg-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={bg} cx="50%" cy="38%" r="80%">
          <stop offset="0" stopColor="#2c1650" />
          <stop offset="1" stopColor="#170c29" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${bg})`} />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#d4a9f8" strokeOpacity=".3" strokeWidth="1.5" />
      <g transform="translate(32 32) rotate(-32) scale(1.1)">
        <ellipse rx="24" ry="12" fill="none" stroke="#dcc3f8" strokeOpacity=".32" strokeWidth="1.8" />
        <ellipse rx="16" ry="8" fill="none" stroke="#dcc3f8" strokeOpacity=".5" strokeWidth="1.8" />
        <path d="M-21 -5.5 L-14 6 L-8 -4 L-3 2.2 L0 0" fill="none" stroke="#ff6cb5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle r="3" fill="#ffe8f3" />
        <circle r="3" fill="none" stroke="#ff6cb5" strokeWidth="1.6" />
      </g>
    </svg>
  );
};

export default Logo;
