import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const WorkExperience = () => {
  return (
    <section id="experience" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Professional"
          title="Work Experience"
          subtitle="Applying systems engineering and AI research in professional environments."
        />
        
        <ScrollReveal delay={0.1}>
          <div className="glass-card gradient-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
            <span className="font-mono text-xs tracking-widest uppercase text-lavender/70 mb-4">
              Coming Soon
            </span>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Seeking Opportunities
            </h3>
            <p className="text-base text-text-secondary max-w-md">
              Currently open to Software Engineering, ML Engineering, and Systems Research roles where I can contribute to high-performance distributed AI infrastructure.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WorkExperience;
