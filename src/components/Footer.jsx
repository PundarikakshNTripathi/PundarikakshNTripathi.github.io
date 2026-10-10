import { person, socialLinks } from '../data/content';
import Logo from './Logo';
import ResumeMenu from './ResumeMenu';

const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-3">
        <Logo size={22} className="mt-0.5 shrink-0" />
        <div className="meta">
          <p className="text-text-secondary">
            © {new Date().getFullYear()} {person.name}
          </p>
          <p>Last updated {person.updated}.</p>
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
          <ResumeMenu trigger="link py-1.5 text-text-muted" place="bottom-full mb-2 left-0 md:left-auto md:right-0" />
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;
