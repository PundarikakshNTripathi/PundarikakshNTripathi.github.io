import { person, socialLinks } from '../data/content';
import Logo from './Logo';

// Compile-time constant from vite.config.js (see App.jsx). Keeps the link from appearing on a build
// where /write wouldn't exist anyway.
/* global __WRITER__ */
const WRITER = __WRITER__;

const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-3">
        <Logo size={22} className="mt-0.5 shrink-0" />
        <div className="meta">
          <p className="text-text-secondary">
            © {new Date().getFullYear()} {person.name}
          </p>
          <p>Set in Newsreader and IBM Plex. Last updated {person.updated}.</p>
          <p className="mt-1 max-w-[34rem] text-text-secondary">
            The mark is a loss surface seen from above: gradient descent zigzagging down a narrow valley to its
            minimum.
          </p>
        </div>
      </div>
      <ul className="meta flex flex-wrap gap-x-5 gap-y-1">
        {socialLinks.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer me" className="link inline-block py-1.5 text-text-muted">
              {s.label}
            </a>
          </li>
        ))}
        <li>
          <a href={person.resume} target="_blank" rel="noopener noreferrer" className="link inline-block py-1.5 text-text-muted">
            Résumé
          </a>
        </li>
        {WRITER && (
          <li>
            <a href="/write" className="link inline-block py-1.5 text-text-muted">
              Write
            </a>
          </li>
        )}
      </ul>
    </div>
  </footer>
);

export default Footer;
