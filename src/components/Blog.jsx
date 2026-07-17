import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const Blog = () => {
  return (
    <section id="blog" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Articles & Thoughts"
          title="Blog"
          subtitle="Writing about distributed systems, AI infrastructure, and low-level engineering."
        />
        
        <ScrollReveal delay={0.1}>
          <div className="glass-card gradient-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
            <span className="font-mono text-sm tracking-widest uppercase text-lavender font-semibold mb-4">
              Coming Soon
            </span>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Stay Tuned
            </h3>
            <p className="text-base text-text-secondary max-w-md">
              I am currently working on documenting my research, explorations in systems engineering, and thoughts on AI infrastructure. Articles will be published here soon.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Blog;
