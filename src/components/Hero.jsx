import { hero, person, socialLinks } from '../data/content';
import RasterPortrait from './RasterPortrait';

const Hero = () => (
  <section id="top" aria-label="Introduction" className="pb-16 pt-10 sm:pb-20 sm:pt-16">
    <div className="mx-auto grid max-w-6xl items-end gap-x-16 gap-y-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="rise min-w-0">
        <h1 className="display text-[clamp(2.75rem,7.5vw,5.75rem)] leading-[0.98]">
          <span className="block">{person.firstName}</span>
          <span className="block">{person.lastName}</span>
        </h1>
        <p className="mt-5 font-serif text-[1.25rem] italic text-text-secondary sm:text-[1.4375rem]">
          Independent AI and ML systems researcher, {person.location}.
        </p>

        <p className="prose-serif mt-10 max-w-[36rem] text-[1.3125rem] leading-[1.6] text-text-primary sm:text-[1.4375rem]">
          {hero.lead}
        </p>

        <dl className="mt-10 grid max-w-[36rem] gap-y-2 border-l-2 border-accent/60 pl-5 text-[0.9375rem]">
          {hero.now.map((row) => (
            <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-x-3">
              <dt className="text-text-muted">{row.label}</dt>
              <dd className="text-text-secondary">{row.text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={person.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-[3px] bg-text-primary px-4 py-2.5 text-[0.9375rem] font-medium text-bg-primary transition-colors hover:bg-accent"
          >
            Résumé (PDF)
          </a>
          <a href={`mailto:${person.email}`} className="link text-[0.9375rem]">
            {person.email}
          </a>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 text-[0.9375rem]" aria-label="Elsewhere">
          {socialLinks.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer me" className="link inline-block py-1.5 text-text-secondary">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-[18rem] sm:max-w-[20rem]">
        <RasterPortrait
          src="/portrait.webp"
          fallback="/portrait.jpg"
          alt="Portrait of Pundarikaksh Narayan Tripathi"
          width={640}
          height={800}
        />
      </div>
    </div>
  </section>
);

export default Hero;
