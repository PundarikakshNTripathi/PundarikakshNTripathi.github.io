import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import { projects } from '../data/content';

const Projects = () => {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Research & Systems"
          title="Architecting at the Frontier"
          subtitle="Building high-performance systems and algorithms that bridge mathematical theory and production scale."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Bottom decorative */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="font-mono text-xs text-text-muted px-3 py-1 rounded-full border border-border bg-bg-card/30">
              Select Open Source Contributions
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Projects;
