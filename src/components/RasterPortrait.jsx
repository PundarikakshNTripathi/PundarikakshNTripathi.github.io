import { useCallback, useEffect, useRef, useState } from 'react';

// The portrait renders coarse-to-fine once on load, like a progressive rasterizer.
// A canvas sits over the real <img>; each pass draws the photo at a higher tile resolution,
// then the canvas fades away. Reduced-motion visitors just get the photo.
const PASSES = [6, 12, 24, 48, 96];
const PASS_MS = 150;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const RasterPortrait = ({ src, fallback, alt, width, height }) => {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const timers = useRef([]);
  const [pass, setPass] = useState(null); // null = done, showing the photo

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const draw = useCallback((tiles) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    const small = document.createElement('canvas');
    small.width = tiles;
    small.height = Math.round((tiles * height) / width);
    small.getContext('2d').drawImage(img, 0, 0, small.width, small.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  }, [width, height]);

  const run = useCallback(() => {
    if (prefersReducedMotion()) return;
    clearTimers();
    PASSES.forEach((tiles, i) => {
      timers.current.push(
        setTimeout(() => {
          setPass(i);
          draw(tiles);
        }, i * PASS_MS)
      );
    });
    timers.current.push(setTimeout(() => setPass(null), PASSES.length * PASS_MS));
  }, [draw]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return undefined;
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
    return () => {
      img.removeEventListener('load', run);
      clearTimers();
    };
  }, [run]);

  const rendering = pass !== null;

  return (
    <figure className="w-full">
      <div className="relative overflow-hidden rounded-[3px] bg-surface" style={{ aspectRatio: `${width} / ${height}` }}>
        <picture>
          <source srcSet={src} type="image/webp" />
          <img
            ref={imgRef}
            src={fallback}
            alt={alt}
            width={width}
            height={height}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </picture>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          aria-hidden="true"
          // Appear instantly, fade out only at the end, so coarse passes never blend with the photo.
          className={`pointer-events-none absolute inset-0 h-full w-full ${
            rendering ? 'opacity-100' : 'opacity-0 transition-opacity duration-500'
          }`}
        />
      </div>
      <figcaption className="meta mt-3 flex items-baseline justify-between gap-4">
        <span>
          <span className="text-text-secondary">Fig. 1.</span> Me, rasterized coarse to fine.
        </span>
        <button
          type="button"
          onClick={run}
          className="shrink-0 cursor-pointer underline decoration-border underline-offset-4 hover:text-accent hover:decoration-current"
        >
          <span className="num">
            {rendering ? `${PASSES[pass]}×${Math.round((PASSES[pass] * height) / width)} tiles` : 'Replay'}
          </span>
        </button>
      </figcaption>
    </figure>
  );
};

export default RasterPortrait;
