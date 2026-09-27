// A page section: title in the left rail on wide screens, stacked above content on narrow ones.
const Section = ({ id, title, children, className = '' }) => (
  <section id={id} aria-labelledby={`${id}-title`} className={`border-t rule py-16 sm:py-20 ${className}`}>
    <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-6 px-5 sm:px-8 lg:grid-cols-[10rem_minmax(0,1fr)]">
      <h2 id={`${id}-title`} className="section-title lg:sticky lg:top-24 lg:self-start">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </div>
  </section>
);

export default Section;
