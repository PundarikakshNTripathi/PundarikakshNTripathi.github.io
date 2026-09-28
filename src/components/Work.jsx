import { timeline, work } from '../data/content';
import Section from './Section';

const Work = () => (
  <Section id="work" title="Work">
    {work.map((job) => (
      <article key={job.id} className="max-w-[40rem]">
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="font-serif text-[1.5rem] leading-snug text-text-primary">
            {job.role},{' '}
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="link">
              {job.org}
            </a>
          </h3>
          <p className="meta">
            {job.period}. {job.where}.
          </p>
        </header>
        <div className="prose-serif mt-4 max-w-[36rem] text-[1.0625rem]">
          {job.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </article>
    ))}

    <h3 className="subhead mt-16 mb-5">Along the way</h3>
    <ol className="max-w-[40rem] border-t border-border">
      {timeline.map((item) => (
        <li
          key={`${item.when}-${item.title}`}
          className="grid gap-x-8 gap-y-1 border-b border-border py-4 sm:grid-cols-[6rem_minmax(0,1fr)]"
        >
          <span className="meta pt-0.5">{item.when}</span>
          <div>
            <p className="text-text-primary">{item.title}</p>
            <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-text-secondary">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

export default Work;
