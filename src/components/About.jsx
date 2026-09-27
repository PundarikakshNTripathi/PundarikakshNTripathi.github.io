import { Fragment } from 'react';
import { interests, person, story, toolbox } from '../data/content';
import Section from './Section';

// Turns "text{note:id} more text" into text with a numbered reference, and collects the notes
// in order so they can be printed in the margin (wide screens) or under the paragraph (narrow).
const withNotes = (text, counter) => {
  const parts = text.split(/\{note:(\w+)\}/);
  const notes = [];
  const nodes = parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    counter.n += 1;
    notes.push({ id: part, n: counter.n });
    return (
      <sup key={i} className="note-ref" id={`ref-${part}`}>
        <a href={`#note-${part}`} aria-label={`Note ${counter.n}`}>
          {counter.n}
        </a>
      </sup>
    );
  });
  return { nodes, notes };
};

const About = () => {
  const counter = { n: 0 };
  return (
    <Section id="about" title="About">
      <div className="prose-serif space-y-5">
        {story.paragraphs.map((text, i) => {
          const { nodes, notes } = withNotes(text, counter);
          return (
            <div key={i} className="grid gap-x-10 xl:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]">
              <p className="max-w-[40rem]">{nodes}</p>
              {notes.length > 0 && (
                <aside className="mt-3 xl:mt-1">
                  {notes.map((note) => (
                    <p key={note.id} id={`note-${note.id}`} className="sidenote max-w-[40rem] xl:max-w-[15rem]">
                      <span className="num mr-1.5 text-dot">{note.n}</span>
                      {story.notes[note.id]}
                    </p>
                  ))}
                </aside>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-14 grid max-w-[52rem] gap-x-12 gap-y-10 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-[0.9375rem] font-medium text-text-primary">What I read and think about</h3>
          <ul className="space-y-1.5 text-[0.9375rem] text-text-secondary">
            {interests.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-text-muted" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-[0.9375rem] font-medium text-text-primary">Tools I reach for</h3>
          <dl className="space-y-2 text-[0.9375rem]">
            {toolbox.map((row) => (
              <div key={row.group}>
                <dt className="inline text-text-muted">{row.group}: </dt>
                <dd className="inline text-text-secondary">{row.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="meta mt-10">Last updated {person.updated}.</p>
    </Section>
  );
};

export default About;
