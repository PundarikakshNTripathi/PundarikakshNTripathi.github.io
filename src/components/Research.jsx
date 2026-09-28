import { person, projects, research } from '../data/content';
import Section from './Section';

const Research = () => (
  <Section id="research" title="Research">
    <div className="mb-10 max-w-[40rem] border-l-2 border-accent/60 pl-5">
      <p className="font-serif text-[1.5rem] leading-tight text-text-primary">
        <a href={person.lab.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
          {person.lab.name}
        </a>
      </p>
      <p className="meta mt-1">
        {person.lab.role}. <span className="italic">{person.lab.tagline}</span>
      </p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
        An independent lab I started for three kinds of work: the systems that run models, research on the models
        themselves, and mechanistic interpretability. It's early days.
      </p>
      <ul className="meta mt-3 flex flex-wrap gap-x-5" aria-label="Quiet Intelligence elsewhere">
        {person.lab.links.map((l) => (
          <li key={l.label}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="link inline-block py-1 text-text-secondary">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
    <p className="prose-serif max-w-[40rem]">{research.intro}</p>
    <ul className="mt-10 max-w-[40rem] space-y-10">
      {research.questions.map((item) => {
        const project = projects.find((p) => p.id === item.project);
        return (
          <li key={item.q} className="border-l border-border pl-6">
            <div>
              <h3 className="font-serif text-[1.375rem] leading-snug text-text-primary">{item.q}</h3>
              <p className="prose-serif mt-3 max-w-[36rem] text-[1.0625rem]">{item.a}</p>
              {project && (
                <a href={`#project-${project.id}`} className="link meta mt-3 inline-block">
                  See {project.title} below
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  </Section>
);

export default Research;
