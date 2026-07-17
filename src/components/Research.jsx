import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const Research = () => {
  return (
    <section id="research" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Academic"
          title="Research and Publications"
          subtitle="Advancing the frontiers of Artificial Intelligence through academic inquiry."
        />
        
        <ScrollReveal delay={0.1}>
          <div className="glass-card gradient-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
            <span className="font-mono text-xs tracking-widest uppercase text-pink/70 mb-4">
              In Progress
            </span>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Active Research Endeavors
            </h3>
            <p className="text-base text-text-secondary max-w-xl">
              I am a dual-aligned researcher exploring both mathematical, architectural frontier AI, as well as AI infrastructure, HPC, and low-level systems engineering. Publications and formal papers detailing these explorations will be updated here soon.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Research;
