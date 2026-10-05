import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { person } from '../data/content';

const FEED = 'https://pundarikakshntripathi.github.io/feed.xml';

// Opening feed.xml directly shows the browser's raw XML tree, so the "Subscribe" links land here
// instead: what the feed is, its address, and one-click adds for the common readers.
const READERS = [
  { label: 'Feedly', url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(FEED)}` },
  { label: 'Inoreader', url: `https://www.inoreader.com/?add_feed=${encodeURIComponent(FEED)}` },
  { label: 'NewsBlur', url: `https://www.newsblur.com/?url=${encodeURIComponent(FEED)}` },
];

export default function Subscribe() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = `Subscribe | ${person.name}`;
    return () => {
      document.title = person.name;
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FEED);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy the feed address', FEED);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <Link to="/#writing" className="link meta">
        All writing
      </Link>
      <h1 className="display mt-8 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05]">Subscribe</h1>
      <div className="prose-serif mt-6 max-w-[40rem] space-y-5">
        <p>
          New posts go out through an RSS feed. Add it to a feed reader and each write-up shows up there when it is
          published. There is no mailing list and nothing to sign up for.
        </p>
      </div>

      <div className="mt-10 max-w-[40rem]">
        <p className="subhead mb-3 text-[1rem]">Feed address</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4">
          <code className="min-w-0 break-all text-[0.9375rem] text-text-primary">{FEED}</code>
          <button type="button" className="link meta cursor-pointer py-1 sm:ml-auto" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="meta mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-text-secondary">Add to</span>
          {READERS.map((r) => (
            <a key={r.label} className="link py-1" target="_blank" rel="noopener noreferrer" href={r.url}>
              {r.label}
            </a>
          ))}
          <a className="link py-1 sm:ml-auto" href="/feed.xml">
            View the raw feed
          </a>
        </p>
        <p className="meta mt-10 text-text-muted">
          Never used one? A feed reader collects new posts from the sites you follow in one place. Feedly and
          Inoreader both have free web and phone apps; paste the address above into either.
        </p>
      </div>
    </section>
  );
}
