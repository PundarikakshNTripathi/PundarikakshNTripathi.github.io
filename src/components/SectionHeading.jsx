import ScrollReveal from './ScrollReveal';

const SectionHeading = ({ label, title, subtitle, align = 'center' }) => {
  const alignClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
  };

  return (
    <ScrollReveal className={`flex flex-col gap-4 mb-16 ${alignClasses[align]}`}>
      {label && (
        <span className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-lavender/80">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight gradient-text">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
};

export default SectionHeading;
