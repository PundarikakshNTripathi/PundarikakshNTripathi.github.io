import { useId } from 'react';

// The mark: a loss landscape seen from above. Two contour lines of an ill-conditioned valley, and the
// zigzag path gradient descent takes across it to the minimum. Same drawing as public/favicon.svg.
// Full-opacity strokes and a large scale so it stays legible at 16px in a browser tab, not just at
// header size.
const Logo = ({ size = 28, className = '' }) => {
  const bg = `bg-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <title>The mark is a loss surface seen from above: gradient descent zigzagging down a narrow valley to its minimum.</title>
      <defs>
        <radialGradient id={bg} cx="50%" cy="35%" r="85%">
          <stop offset="0" stopColor="#3a1d68" />
          <stop offset="1" stopColor="#170c29" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${bg})`} />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#d4a9f8" strokeOpacity=".3" strokeWidth="1.5" />
      <g transform="translate(32 32) rotate(-32) scale(1.55)">
        <ellipse rx="24" ry="12" fill="none" stroke="#e6d6fb" strokeOpacity=".95" strokeWidth="2.6" />
        <ellipse rx="16" ry="8" fill="none" stroke="#e6d6fb" strokeWidth="2.8" />
        <path d="M-21 -5.5 L-14 6 L-8 -4 L-3 2.2 L0 0" fill="none" stroke="#ff6cb5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle r="4.6" fill="#fff2f9" />
        <circle r="4.6" fill="none" stroke="#ff6cb5" strokeWidth="2.4" />
      </g>
    </svg>
  );
};

export default Logo;
