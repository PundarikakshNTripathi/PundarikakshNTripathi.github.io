import { projects } from '../data/content';
import ProjectFigure from './ProjectFigure';
import Section from './Section';

// Results read like a small table in a paper: what was measured, the number, and the setup.
const ResultsTable = ({ results, setup }) =>
  results.length > 0 && (
    <div className="mt-6 max-w-[36rem]">
      <table className="w-full border-t border-border text-[0.9375rem]">
        <tbody>
          {results.map(([label, value]) => (
            <tr key={label} className="border-b border-border">
              <th scope="row" className="py-2 pr-6 text-left font-normal text-text-secondary">
                {label}
              </th>
              <td className="num whitespace-nowrap py-2 text-right font-medium text-text-primary">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {setup && <p className="meta mt-2">{setup}</p>}
    </div>
  );

const CodeLink = ({ project }) => (
  <p className="meta mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
    <span>{project.stack}</span>
    {project.link ? (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="link inline-block py-1 text-text-secondary">
        Code on GitHub<span className="sr-only">: {project.title}</span>
      </a>
    ) : (
      project.linkNote && <span className="italic">{project.linkNote}</span>
    )}
  </p>
);

const Title = ({ project, className }) => (
  <h3 className={`font-serif leading-tight text-text-primary ${className}`}>
    {project.link ? (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
        {project.title}
      </a>
    ) : (
      project.title
    )}
    {project.status && <span className="ml-3 align-middle font-sans text-[0.8125rem] text-dot">{project.status}</span>}
  </h3>
);

const Featured = ({ project, fig }) => (
  <article
    id={`project-${project.id}`}
    className="grid scroll-mt-24 gap-x-10 gap-y-6 border-b border-border py-12 first:pt-2 md:grid-cols-[17rem_minmax(0,1fr)]"
  >
    <figure className="order-last max-w-[20rem] md:order-none md:max-w-none md:pt-1">
      <div className="rounded-[3px] border border-border bg-surface/60 p-4">
        <ProjectFigure kind={project.figure} className="block h-auto w-full" />
      </div>
      <figcaption className="meta mt-3">
        <span className="text-text-secondary">Fig. {fig}.</span> {project.caption}
      </figcaption>
    </figure>
    <div className="min-w-0 max-w-[40rem]">
      <Title project={project} className="text-[1.875rem]" />
      <p className="mt-2 font-serif text-[1.1875rem] italic leading-snug text-text-primary">{project.summary}</p>
      <p className="prose-serif mt-4 max-w-[36rem] text-[1.0625rem]">{project.body}</p>
      <ResultsTable results={project.results} setup={project.setup} />
      <CodeLink project={project} />
    </div>
  </article>
);

const Compact = ({ project }) => (
  <article id={`project-${project.id}`} className="scroll-mt-24 border-t border-border pt-6">
    <Title project={project} className="text-[1.5rem]" />
    <p className="mt-1.5 font-serif text-[1.0625rem] italic leading-snug text-text-primary">{project.summary}</p>
    <p className="prose-serif mt-3 text-[1rem] leading-[1.65]">{project.body}</p>
    {project.results.map(([label, value]) => (
      <p key={label} className="mt-4 text-[0.9375rem] text-text-secondary">
        {label}: <span className="num font-medium text-text-primary">{value}</span>
      </p>
    ))}
    <CodeLink project={project} />
  </article>
);

const Projects = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <Section id="projects" title="Projects">
      <p className="prose-serif mb-8 max-w-[40rem]">
        Most of these started as a question I couldn't answer by reading. The code is all public, the numbers
        below come from the benchmark scripts in each repo, and issues and pull requests are welcome.
      </p>
      {featured.map((project, i) => (
        <Featured key={project.id} project={project} fig={i + 2} />
      ))}
      <h3 className="subhead mt-14 mb-6">Also built</h3>
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {rest.map((project) => (
          <Compact key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
