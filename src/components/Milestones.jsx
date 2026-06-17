import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';
import { milestones } from '../data/content';

const accentClasses = {
  lavender: {
    metric: 'text-lavender',
    border: 'border-lavender/20',
    bg: 'bg-lavender/5',
    dot: 'bg-lavender',
  },
  pink: {
    metric: 'text-pink',
    border: 'border-pink/20',
    bg: 'bg-pink/5',
    dot: 'bg-pink',
  },
  peach: {
    metric: 'text-peach',
    border: 'border-peach/20',
    bg: 'bg-peach/5',
    dot: 'bg-peach',
  },
};

const Milestones = () => {
  return (
    <section id="milestones" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Recognition"
          title="Achievements, Leadership and Collaboration"
          subtitle="Demonstrating impact through competitive hacking, community building, and leading initiatives."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {milestones.map((milestone, i) => {
            const accent = accentClasses[milestone.accentColor] || accentClasses.lavender;
            const IconComponent = milestone.Icon;

            return (
              <ScrollReveal key={milestone.id} delay={i * 0.1}>
                <div className="group glass-card gradient-border p-8 h-full flex flex-col cursor-default">
                  {/* Icon & Category */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${accent.bg} border ${accent.border} transition-colors duration-300 group-hover:bg-opacity-20`}>
                      {IconComponent && (
                        <IconComponent size={18} className={`${accent.metric} transition-transform duration-300 group-hover:scale-110`} />
                      )}
                    </div>
                    <span className="font-mono text-xs tracking-wider text-text-muted uppercase">
                      Achievement
                    </span>
                  </div>

                  {/* Metric */}
                  {milestone.metric && (
                    <div className="mb-4">
                      <span className={`font-mono text-4xl font-bold ${accent.metric} transition-all duration-300 group-hover:drop-shadow-[0_0_15px_currentColor]`}>
                        {milestone.metric}
                      </span>
                      {milestone.metricLabel && (
                        <span className="block font-mono text-xs text-text-muted mt-1 tracking-wider uppercase transition-colors duration-300 group-hover:text-text-secondary">
                          {milestone.metricLabel}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed flex-1">
                    {milestone.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Milestones;
