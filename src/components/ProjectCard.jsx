import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const accentMap = {
  lavender: {
    dot: 'bg-lavender',
    tag: 'text-lavender bg-lavender/8 border-lavender/12',
    hover: 'group-hover:text-lavender',
    glow: 'group-hover:shadow-[0_0_40px_rgba(196,167,231,0.08)]',
  },
  pink: {
    dot: 'bg-pink',
    tag: 'text-pink bg-pink/8 border-pink/12',
    hover: 'group-hover:text-pink',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,194,231,0.08)]',
  },
  mauve: {
    dot: 'bg-mauve',
    tag: 'text-mauve bg-mauve/8 border-mauve/12',
    hover: 'group-hover:text-mauve',
    glow: 'group-hover:shadow-[0_0_40px_rgba(203,166,247,0.08)]',
  },
  peach: {
    dot: 'bg-peach',
    tag: 'text-peach bg-peach/8 border-peach/12',
    hover: 'group-hover:text-peach',
    glow: 'group-hover:shadow-[0_0_40px_rgba(250,179,135,0.08)]',
  },
};

const ProjectCard = ({ project, index }) => {
  const accent = accentMap[project.accentColor] || accentMap.lavender;
  const IconComponent = project.Icon;

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group glass-card gradient-border p-6 sm:p-8 flex flex-col h-full cursor-pointer ${accent.glow}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      id={`project-${project.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-bg-secondary border border-border`}>
            {IconComponent && (
              <IconComponent size={18} className={`text-text-muted ${accent.hover} transition-colors`} />
            )}
          </div>
          <div>
            <h3 className={`font-mono text-lg font-bold text-text-primary ${accent.hover} transition-colors`}>
              {project.title}
            </h3>
            <span className="font-mono text-[10px] tracking-wider uppercase text-text-muted">
              {project.category}
            </span>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="text-text-muted group-hover:text-text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-6">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-medium border ${accent.tag} transition-colors`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  );
};

export default ProjectCard;
