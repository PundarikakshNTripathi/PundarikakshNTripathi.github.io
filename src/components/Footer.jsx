import { socialLinks, navItems } from '../data/content';

// Custom SVG icons for social platforms (lucide-react no longer exports brand icons)
const LinkedInIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const XIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const footerIcons = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  'x-twitter': XIcon,
};

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-lavender to-pink flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-bg-primary">P</span>
              </div>
              <span className="font-mono text-sm font-semibold text-text-primary">
                Pundarikaksh N. Tripathi
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI & HPC Researcher building systems at the intersection of
              foundational AI research and high-performance computing.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-text-muted mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="text-sm text-text-secondary hover:text-lavender transition-colors cursor-pointer"
                    id={`footer-nav-${item.id}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-text-muted mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.slice(0, 3).map((link) => {
                const IconComp = footerIcons[link.id];
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-border bg-bg-card/50 text-text-secondary hover:text-lavender hover:border-lavender/30 transition-all"
                    id={`footer-social-${link.id}`}
                    aria-label={link.label}
                  >
                    {IconComp && <IconComp size={16} />}
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              Reach out on any platform above.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Pundarikaksh Narayan Tripathi
          </p>
          <p className="font-mono text-xs text-text-muted">
            Built with{' '}
            <span className="text-lavender">React</span>{' '}&{' '}
            <span className="text-pink">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
