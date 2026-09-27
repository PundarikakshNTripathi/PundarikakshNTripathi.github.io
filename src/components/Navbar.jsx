import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { navItems, person } from '../data/content';
import { getTheme, setTheme } from '../lib/theme';
import Logo from './Logo';

const useActiveSection = (enabled) => {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!enabled) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === 'top' ? '' : entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ['top', ...navItems.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [enabled]);
  return active;
};

const ThemeToggle = ({ className = '' }) => {
  const [theme, setThemeState] = useState(getTheme);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
        setThemeState(next);
      }}
      className={`cursor-pointer rounded p-2 text-text-muted transition-colors hover:text-text-primary ${className}`}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
    </button>
  );
};

const Navbar = () => {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(onHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hash links work from any route: on home they scroll, elsewhere they navigate home first.
  const href = (id) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open ? 'border-border bg-bg-primary/90 backdrop-blur-md' : 'border-transparent bg-bg-primary'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3" aria-label={`${person.name}, home`}>
          <Logo size={28} />
          <span className="hidden font-serif text-[1.0625rem] text-text-primary sm:inline">P. N. Tripathi</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`relative rounded px-3 py-2 text-[0.9375rem] transition-colors ${
                    active === item.id ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-dot transition-opacity ${
                      active === item.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
          <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
          <ThemeToggle />
        </div>

        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer rounded p-2 text-text-muted hover:text-text-primary"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-border px-5 pb-4 pt-2 md:hidden">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={href(item.id)}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-3 font-serif text-xl text-text-primary last:border-0"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Navbar;
