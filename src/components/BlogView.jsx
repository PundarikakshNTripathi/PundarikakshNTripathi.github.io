import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import { findPost, postDate } from '../lib/posts';

// Post HTML comes from the editor. Sanitize it before it touches the DOM. DOMPurify drops `target`,
// so links in posts open in the same tab and can't be used for reverse tabnabbing.
const clean = (html) => ({ __html: DOMPurify.sanitize(html || '', { USE_PROFILES: { html: true } }) });

// Only http(s) and same-site image URLs; blocks javascript: and friends.
const safeUrl = (url) => {
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch {
    return '';
  }
};

const Block = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const Tag = block.level === 'h3' ? 'h3' : 'h2';
      return (
        <Tag
          id={`heading-${block.id}`}
          className={`blog-header scroll-mt-24 font-serif text-text-primary ${
            Tag === 'h2' ? 'mt-12 text-[1.875rem]' : 'mt-8 text-[1.4375rem]'
          } leading-tight`}
        >
          {block.content}
        </Tag>
      );
    }
    case 'text':
      return <div className="post-body" dangerouslySetInnerHTML={clean(block.content)} />;
    case 'image': {
      const src = safeUrl(block.url);
      if (!src) return null;
      const align = block.align === 'left' ? 'items-start' : block.align === 'right' ? 'items-end' : 'items-center';
      return (
        <figure className={`my-10 flex flex-col ${align}`}>
          <img src={src} alt={block.alt || block.caption || ''} loading="lazy" referrerPolicy="no-referrer" className="max-h-[600px] w-auto rounded-[3px] border border-border" />
          {block.caption && <figcaption className="meta mt-3 max-w-[36rem]">{block.caption}</figcaption>}
        </figure>
      );
    }
    case 'list': {
      const Tag = block.listType === 'ol' ? 'ol' : 'ul';
      return (
        <Tag className={`post-body my-6 space-y-2 pl-6 ${Tag === 'ol' ? 'list-decimal' : 'list-disc'} marker:text-text-muted`}>
          {block.items?.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={clean(item)} />
          ))}
        </Tag>
      );
    }
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 border-accent pl-6 font-serif text-[1.375rem] italic leading-snug text-text-primary">
          {block.content}
          {block.author && <footer className="meta mt-3 not-italic">{block.author}</footer>}
        </blockquote>
      );
    case 'code':
      return (
        <figure className="my-8 overflow-hidden rounded-[3px] border border-border bg-surface">
          <figcaption className="meta border-b border-border px-4 py-2">{block.language || 'code'}</figcaption>
          <pre className="overflow-x-auto p-4 text-[0.875rem] leading-relaxed">
            <code className="font-mono text-text-primary">{block.content}</code>
          </pre>
        </figure>
      );
    case 'divider':
      return <hr className="my-12 border-border" />;
    default:
      return null;
  }
};

export default function BlogView() {
  const { id } = useParams();
  const post = useMemo(() => findPost(id), [id]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!post) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: '-20% 0px -75% 0px' }
    );
    document.querySelectorAll('.blog-header').forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [post]);

  useEffect(() => {
    document.title = post ? `${post.title} | Pundarikaksh Narayan Tripathi` : 'Post not found';
    return () => {
      document.title = 'Pundarikaksh Narayan Tripathi';
    };
  }, [post]);

  if (!post) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <h1 className="display text-5xl">Post not found.</h1>
        <p className="prose-serif mt-6">
          It may have been renamed or unpublished. <Link to="/#writing" className="link">See all writing</Link>.
        </p>
      </section>
    );
  }

  const toc = post.blocks.filter((b) => b.type === 'header');

  return (
    <div className="mx-auto grid max-w-6xl gap-x-16 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-[minmax(0,42rem)_14rem]">
      <article className="min-w-0">
        <Link to="/#writing" className="link meta">All writing</Link>
        <h1 className="display mt-8 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05]">{post.title}</h1>
        <p className="meta mt-4">
          {postDate(post)}
          {post.draft && <span className="ml-3 text-dot">Draft, visible only on this device</span>}
        </p>
        <div className="prose-serif mt-10 space-y-5">
          {post.blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </div>
      </article>

      {toc.length > 0 && (
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 pt-24">
            <p className="mb-3 text-[0.875rem] font-medium text-text-primary">On this page</p>
            <ul className="border-l border-border text-[0.875rem]">
              {toc.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#heading-${h.id}`}
                    className={`-ml-px block border-l py-1 transition-colors ${h.level === 'h3' ? 'pl-7' : 'pl-4'} ${
                      activeId === `heading-${h.id}`
                        ? 'border-accent text-text-primary'
                        : 'border-transparent text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {h.content}
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
