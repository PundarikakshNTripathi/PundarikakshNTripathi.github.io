// What a pasted URL can become. Iframe embeds are limited to a short allowlist of providers,
// and the same list is used by the sanitizer and the Content-Security-Policy (vite.config.js).

export const FRAME_ORIGINS = [
  'https://www.youtube-nocookie.com',
  'https://player.vimeo.com',
  'https://open.spotify.com',
  'https://www.loom.com',
  'https://codepen.io',
];

const providers = [
  {
    name: 'YouTube',
    match: /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
    src: (m, url) => {
      const t = new URL(url, 'https://x').searchParams.get('t');
      const start = t ? `?start=${parseInt(t, 10) || 0}` : '';
      return `https://www.youtube-nocookie.com/embed/${m[1]}${start}`;
    },
    aspect: '16 / 9',
  },
  {
    name: 'Vimeo',
    match: /^(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/,
    src: (m) => `https://player.vimeo.com/video/${m[1]}`,
    aspect: '16 / 9',
  },
  {
    name: 'Spotify',
    match: /^(?:https?:\/\/)?open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode|show)\/([\w]+)/,
    src: (m) => `https://open.spotify.com/embed/${m[1]}/${m[2]}`,
    aspect: null,
    height: 152,
  },
  {
    name: 'Loom',
    match: /^(?:https?:\/\/)?(?:www\.)?loom\.com\/(?:share|embed)\/([\w]+)/,
    src: (m) => `https://www.loom.com/embed/${m[1]}`,
    aspect: '16 / 9',
  },
  {
    name: 'CodePen',
    match: /^(?:https?:\/\/)?codepen\.io\/([\w-]+)\/(?:pen|embed)\/([\w]+)/,
    src: (m) => `https://codepen.io/${m[1]}/embed/${m[2]}?default-tab=result`,
    aspect: null,
    height: 420,
  },
];

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|ogv|mov)(\?.*)?$/i;

export const isHttpUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

// Returns { kind: 'embed' | 'image' | 'video' | 'link', ... } for a URL.
export function classifyUrl(raw) {
  const url = raw.trim();
  for (const p of providers) {
    const m = url.match(p.match);
    if (m) return { kind: 'embed', provider: p.name, src: p.src(m, url), url, aspect: p.aspect, height: p.height || null };
  }
  if (IMAGE_EXT.test(url)) return { kind: 'image', url };
  if (VIDEO_EXT.test(url)) return { kind: 'video', url };
  return { kind: 'link', url };
}

export const isAllowedFrameSrc = (src) => {
  try {
    const u = new URL(src);
    return FRAME_ORIGINS.includes(u.origin);
  } catch {
    return false;
  }
};

export const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
