import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import { projects } from '../data/content';

const Projects = () => {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Infrastructure"
          title="Core Systems"
          subtitle="Hardcore systems engineering — from SIMD-accelerated inference to distributed training frameworks."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
