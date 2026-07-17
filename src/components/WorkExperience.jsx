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
          <div className="glass-card gradient-border p-8 h-full flex flex-col items-start justify-center min-h-[250px]">
            <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-text-primary">
                  Machine Learning Engineering Intern
                </h3>
                <p className="text-lavender font-medium mt-1 text-lg"><a href="https://flyrank.com" target="_blank" rel="noopener noreferrer" className="hover:underline">FlyRank</a> • Remote</p>
              </div>
              <span className="font-mono text-sm tracking-widest text-text-muted font-semibold bg-bg-secondary px-4 py-2 rounded-full whitespace-nowrap">
                July 2026 – Present
              </span>
            </div>
            <ul className="text-base text-text-secondary max-w-4xl list-disc pl-5 space-y-3 marker:text-lavender">
              <li>Architecting a scalable predictive ranking pipeline utilizing DuckDB and scikit-learn to process multi-gigabyte, enterprise search datasets for content discoverability.</li>
              <li>Designing robust model evaluation frameworks with strict data leakage controls, culminating in the deployment of a reproducible, public-facing content recommendation system.</li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WorkExperience;
