import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';
import { techStack } from '../data/content';

const About = () => {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Philosophy"
          title="Engineering at the Edge"
          subtitle="Stripping away abstractions to understand how massive models scale across hardware."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left — Manifesto */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card gradient-border p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-lavender" />
                <span className="font-mono text-xs tracking-widest uppercase text-lavender/70">
                  The Approach
                </span>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  I operate at the{' '}
                  <span className="text-text-primary font-medium">lower levels of the stack</span>{' '}
                  — engineering manual autograd graphs and ZeRO optimizer sharding
                  to internalize the linear algebra constraints that govern distributed training.
                </p>
                <p>
                  This means understanding{' '}
                  <span className="text-lavender">memory management</span>,{' '}
                  <span className="text-pink">hardware intrinsics</span>{' '}
                  (SIMD/AVX2), and{' '}
                  <span className="text-mauve">mathematical optimization</span>{' '}
                  — not as abstractions, but as the fundamental primitives
                  that define computational throughput.
                </p>
                <p>
                  Concurrently building the{' '}
                  <span className="text-text-primary font-medium">
                    backend infrastructure required for production
                  </span>{' '}
                  — bridging research and development in both foundational
                  mathematical AI and high-performance computing.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Stack */}
          <ScrollReveal delay={0.2}>
            <div className="glass-card gradient-border p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-pink" />
                <span className="font-mono text-xs tracking-widest uppercase text-pink/70">
                  Core Stack
                </span>
              </div>

              <div className="space-y-4">
                {techStack.map((tech, i) => (
                  <div
                    key={tech}
                    className="group flex items-center gap-4 p-3 rounded-lg hover:bg-lavender/5 transition-colors"
                  >
                    <span className="font-mono text-xs text-text-muted w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    <span className="font-mono text-sm font-medium text-text-primary group-hover:text-lavender transition-colors">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative element */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-mono text-xs text-text-muted">
                  <span className="text-lavender">fn</span>{' '}
                  <span className="text-pink">build</span>
                  {'() -> '}
                  <span className="text-mauve">System</span>
                  {' { /* ship it */ }'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
