import { useId } from 'react';

// The lotus mark (Puṇḍarīkākṣa: "lotus-eyed"). Five translucent petals, drawn as Gaussians,
// around a pink core. Same drawing as public/favicon.svg; gradient ids are per-instance.
const Logo = ({ size = 28, className = '' }) => {
  const id = useId().replace(/:/g, '');
  const g = (name) => `${name}-${id}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={g('bg')} cx="50%" cy="30%" r="80%">
          <stop offset="0" stopColor="#43226a" />
          <stop offset="1" stopColor="#1b1030" />
        </radialGradient>
        <linearGradient id={g('c')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7ecff" />
          <stop offset="1" stopColor="#d2b0f7" />
        </linearGradient>
        <linearGradient id={g('s')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b9fa" />
          <stop offset="1" stopColor="#a77fdc" />
        </linearGradient>
        <linearGradient id={g('o')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9fd0" />
          <stop offset="1" stopColor="#e0559b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${g('bg')})`} />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#d2a8f7" strokeOpacity=".4" strokeWidth="1.5" />
      <g transform="translate(32 47)">
        <ellipse cy="-12.5" rx="7" ry="13.5" fill={`url(#${g('o')})`} opacity=".85" stroke="#1b1030" strokeWidth="1.6" transform="rotate(-76)" />
        <ellipse cy="-12.5" rx="7" ry="13.5" fill={`url(#${g('o')})`} opacity=".85" stroke="#1b1030" strokeWidth="1.6" transform="rotate(76)" />
        <ellipse cy="-16" rx="8" ry="17" fill={`url(#${g('s')})`} opacity=".95" stroke="#1b1030" strokeWidth="1.6" transform="rotate(-38)" />
        <ellipse cy="-16" rx="8" ry="17" fill={`url(#${g('s')})`} opacity=".95" stroke="#1b1030" strokeWidth="1.6" transform="rotate(38)" />
        <ellipse cy="-18" rx="9" ry="19.5" fill={`url(#${g('c')})`} stroke="#1b1030" strokeWidth="1.6" />
        <circle cy="-7" r="5.4" fill="#ff4fa3" stroke="#1b1030" strokeWidth="1.2" />
        <circle cy="-8.6" r="1.7" fill="#ffe3f1" />
      </g>
    </svg>
  );
};

export default Logo;
