import { projects, research } from '../data/content';
import Section from './Section';

const Research = () => (
  <Section id="research" title="Research">
    <p className="prose-serif max-w-[40rem]">{research.intro}</p>
    <ul className="mt-10 max-w-[40rem] space-y-10">
      {research.questions.map((item) => {
        const project = projects.find((p) => p.id === item.project);
        return (
          <li key={item.q} className="border-l border-border pl-6">
            <div>
              <h3 className="font-serif text-[1.375rem] leading-snug text-text-primary">{item.q}</h3>
              <p className="prose-serif mt-3 text-[1.0625rem]">{item.a}</p>
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
