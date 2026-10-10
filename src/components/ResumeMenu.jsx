import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { person } from '../data/content';

// One "Résumé" control that opens a short list of role-specific versions. A disclosure (button plus
// list of plain links) rather than an ARIA menu: each option is an ordinary link to a PDF.
// `trigger` styles the button; `place` positions the list (the footer opens it upward).
const ResumeMenu = ({ label = 'Résumé', trigger, place = 'top-full mt-2 left-0' }) => {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const button = useRef(null);
  const panel = useRef(null);
  const [shift, setShift] = useState(0);
  const id = useId();

  // Where the trigger wraps near a screen edge (the footer on a phone), slide the list back inside
  // the viewport with a 16px gutter instead of letting it cause a sideways scroll.
  useLayoutEffect(() => {
    if (!open || !panel.current) return;
    const { left, right } = panel.current.getBoundingClientRect();
    const gutter = 16;
    const vw = document.documentElement.clientWidth;
    if (right > vw - gutter) setShift(vw - gutter - right);
    else if (left < gutter) setShift(gutter - left);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative inline-block">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setShift(0);
          setOpen((o) => !o);
        }}
        className={`inline-flex cursor-pointer items-center gap-2 ${trigger}`}
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 10 6" className={`h-[0.4em] w-[0.65em] transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div
          ref={panel}
          id={id}
          style={shift ? { transform: `translateX(${shift}px)` } : undefined}
          className={`absolute z-40 w-[min(19rem,calc(100vw-2.5rem))] rounded-[3px] border border-border bg-bg-primary py-1.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] ${place}`}
        >
          <ul>
            {person.resumes.map((r) => (
              <li key={r.id}>
                <a
                  href={r.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 transition-colors hover:bg-surface focus-visible:bg-surface"
                >
                  <span className="block text-[0.9375rem] text-text-primary">{r.label}</span>
                  <span className="block text-[0.8125rem] text-text-muted">{r.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeMenu;
