import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArticleBody from './ArticleBody';
import { formatDate, readingMinutes } from '../lib/posts';
import { usePublishedPost } from '../lib/usePosts';
import { person } from '../data/content';

// Plain share links: no third-party scripts, nothing loads until someone clicks.
function ShareRow({ post }) {
  const [copied, setCopied] = useState(false);
  const url = `https://pundarikakshntripathi.github.io/blog/${post.slug}`;
  const text = encodeURIComponent(post.title);
  return (
    <div className="meta mt-14 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-6">
      <span className="text-text-secondary">Share</span>
      <button
        type="button"
        className="link cursor-pointer py-1"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt('Copy this link', url);
          }
        }}
      >
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <a className="link py-1" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?text=${text}&url=${encodeURIComponent(url)}`}>
        X
      </a>
      <a className="link py-1" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>
        LinkedIn
      </a>
      <a className="link py-1 sm:ml-auto" href="/feed.xml">
        RSS
      </a>
    </div>
  );
}

// A published post. Also used by the editor's preview through `post` + `preview`.
export function ArticleView({ post, preview = false }) {
  const [toc, setToc] = useState([]);
  const [active, setActive] = useState('');
  const onToc = useCallback((items) => setToc(items), []);

  useEffect(() => {
    if (!toc.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-20% 0px -75% 0px' }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="mx-auto grid max-w-6xl gap-x-16 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[minmax(0,42rem)_13rem]">
      <article className="min-w-0">
        {!preview && (
          <Link to="/#writing" className="link meta">
            All writing
          </Link>
        )}
        {post.tags?.length > 0 && <p className="meta mt-8 text-accent">{post.tags.join(', ')}</p>}
        <h1 className={`display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] ${post.tags?.length ? 'mt-2' : 'mt-8'}`}>
          {post.title || 'Untitled'}
        </h1>
        {post.subtitle && (
          <p className="mt-4 font-serif text-[1.375rem] italic leading-snug text-text-secondary">{post.subtitle}</p>
        )}
        <p className="meta mt-6 border-b border-border pb-6">
          {person.name}. {formatDate(post.date)}. {readingMinutes(post.html)} min read.
        </p>
        {post.cover?.src && (
          <figure className="mt-10">
            <img src={post.cover.src} alt={post.cover.alt || ''} className="w-full rounded-[3px] border border-border" />
            {post.cover.caption && <figcaption className="meta mt-2">{post.cover.caption}</figcaption>}
          </figure>
        )}
        <ArticleBody html={post.html} onToc={onToc} className="mt-10" />
        {!preview && <ShareRow post={post} />}
      </article>

      {toc.length > 1 && (
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 pt-40">
            <p className="subhead mb-3 text-[1rem]">On this page</p>
            <ul className="border-l border-border text-[0.875rem]">
              {toc.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`-ml-px block border-l py-1 transition-colors ${h.level === 'h3' ? 'pl-7' : 'pl-4'} ${
                      active === h.id ? 'border-accent text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}

export default function BlogView() {
  const { id } = useParams();
  const post = usePublishedPost(id);

  useEffect(() => {
    if (post === undefined) return undefined;
    document.title = post ? `${post.title} | ${person.name}` : 'Post not found';
    return () => {
      document.title = person.name;
    };
  }, [post]);

  if (post === undefined) return <div className="min-h-[60vh]" aria-busy="true" />;
  if (!post) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <h1 className="display text-5xl">Post not found.</h1>
        <p className="prose-serif mt-6">
          It may have been renamed or unpublished.{' '}
          <Link to="/#writing" className="link">
            See all writing
          </Link>
          .
        </p>
      </section>
    );
  }
  return <ArticleView post={post} />;
}
