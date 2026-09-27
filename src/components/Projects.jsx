import { projects } from '../data/content';
import ProjectFigure from './ProjectFigure';
import Section from './Section';

const Results = ({ results, size = 'lg' }) =>
  results.length > 0 && (
    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
      {results.map(([value, label]) => (
        <div key={label} className="flex min-w-0 flex-col-reverse">
          <dt className="meta mt-1">{label}</dt>
          <dd className={`num font-serif leading-none text-text-primary ${size === 'lg' ? 'text-[1.5rem]' : 'text-[1.25rem]'}`}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );

const CodeLink = ({ project }) => (
  <p className="meta mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
    <span>{project.stack}</span>
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="link text-text-secondary">
      Code on GitHub<span className="sr-only">: {project.title}</span>
    </a>
  </p>
);

const Title = ({ project, className }) => (
  <h3 className={`font-serif leading-tight text-text-primary ${className}`}>
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
      {project.title}
    </a>
    {project.status && <span className="ml-3 align-middle font-sans text-[0.8125rem] text-dot">{project.status}</span>}
  </h3>
);

const Featured = ({ project, fig }) => (
  <article
    id={`project-${project.id}`}
    className="grid scroll-mt-24 gap-x-10 gap-y-5 border-b border-border py-10 first:pt-2 sm:grid-cols-[13rem_minmax(0,1fr)]"
  >
    <figure className="max-w-[16rem] sm:max-w-none sm:pt-1">
      <div className="rounded-[3px] border border-border bg-surface/60 p-3">
        <ProjectFigure kind={project.figure} className="block h-auto w-full" />
      </div>
      <figcaption className="meta mt-2">Fig. {fig}</figcaption>
    </figure>
    <div className="min-w-0 max-w-[40rem]">
      <Title project={project} className="text-[1.75rem]" />
      <p className="mt-2 text-[1.0625rem] leading-snug text-text-primary">{project.summary}</p>
      <p className="prose-serif mt-4 text-[1.0625rem]">{project.body}</p>
      <Results results={project.results} />
      <CodeLink project={project} />
    </div>
  </article>
);

const Compact = ({ project }) => (
  <article id={`project-${project.id}`} className="scroll-mt-24 border-t border-border pt-6">
    <div className="flex items-start gap-4">
      <div className="w-[5.5rem] shrink-0 rounded-[3px] border border-border bg-surface/60 p-1.5">
        <ProjectFigure kind={project.figure} className="block h-auto w-full" />
      </div>
      <div className="min-w-0">
        <Title project={project} className="text-[1.375rem]" />
        <p className="mt-1.5 text-[0.9375rem] leading-snug text-text-primary">{project.summary}</p>
      </div>
    </div>
    <p className="prose-serif mt-4 text-[1rem] leading-[1.65]">{project.body}</p>
    <Results results={project.results} size="sm" />
    <CodeLink project={project} />
  </article>
);

const Projects = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <Section id="projects" title="Projects">
      <p className="prose-serif mb-8 max-w-[40rem]">
        Most of these started as a question I couldn't answer by reading. The code is all public, and issues and
        pull requests are welcome.
      </p>
      {featured.map((project, i) => (
        <Featured key={project.id} project={project} fig={i + 2} />
      ))}
      <h3 className="mt-12 mb-6 text-[0.9375rem] font-medium text-text-primary">Also built</h3>
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {rest.map((project) => (
          <Compact key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
