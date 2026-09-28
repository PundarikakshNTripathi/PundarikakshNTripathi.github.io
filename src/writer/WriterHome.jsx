import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Plus, Trash2 } from 'lucide-react';
import { deleteDraft, listDrafts, migrateLegacyDrafts } from '../lib/drafts';
import { formatDate, normalisePost, publishedPosts, readingMinutes } from '../lib/posts';

// /write: drafts in this browser, and published posts that can be opened for editing.
export default function WriterHome() {
  const [drafts, setDrafts] = useState(null);
  const published = publishedPosts();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = 'Writer';
    (async () => {
      await migrateLegacyDrafts(normalisePost);
      setDrafts(await listDrafts());
    })();
    return () => meta.remove();
  }, []);

  const publishedIds = new Set(published.map((p) => String(p.id)));

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="meta">Writer</p>
          <h1 className="display mt-1 text-[2.75rem] leading-none">Posts</h1>
        </div>
        <Link to="/write/new" className="writer-primary">
          <Plus size={16} aria-hidden="true" /> New post
        </Link>
      </div>
      <p className="meta mt-4 max-w-[40rem]">
        Drafts are saved in this browser as you type. Publishing writes the post into the site repository; commit and
        push to put it live.
      </p>

      <h2 className="subhead mt-12">Drafts</h2>
      {drafts === null ? (
        <p className="meta mt-4">Loading…</p>
      ) : drafts.length === 0 ? (
        <p className="meta mt-4">No drafts yet.</p>
      ) : (
        <ul className="mt-4 max-w-[48rem] border-t border-border">
          {drafts.map((d) => (
            <li key={d.id} className="flex items-center gap-4 border-b border-border py-4">
              <Link to={`/write/${d.id}`} className="min-w-0 flex-1">
                <span className="block truncate font-serif text-[1.375rem] text-text-primary hover:text-accent">{d.title || 'Untitled draft'}</span>
                <span className="meta">
                  Edited {formatDate(d.updated || d.date)}. {readingMinutes(d.html || '')} min read
                  {publishedIds.has(String(d.id)) ? '. Published version exists.' : '.'}
                </span>
              </Link>
              <button
                type="button"
                className="writer-ghost"
                aria-label={`Delete draft ${d.title || 'Untitled'}`}
                onClick={async () => {
                  if (!window.confirm(`Delete the draft “${d.title || 'Untitled'}”? This can't be undone.`)) return;
                  await deleteDraft(d.id);
                  setDrafts(await listDrafts());
                }}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="subhead mt-12">Published</h2>
      {published.length === 0 ? (
        <p className="meta mt-4">Nothing published yet.</p>
      ) : (
        <ul className="mt-4 max-w-[48rem] border-t border-border">
          {published.map((p) => (
            <li key={p.id} className="flex items-center gap-4 border-b border-border py-4">
              <Link to={`/blog/${p.slug}`} className="min-w-0 flex-1">
                <span className="block truncate font-serif text-[1.375rem] text-text-primary hover:text-accent">{p.title}</span>
                <span className="meta">
                  {formatDate(p.date)}. {readingMinutes(p.html)} min read.
                </span>
              </Link>
              <Link to={`/write/${p.id}`} className="writer-ghost">
                <PenLine size={16} aria-hidden="true" /> Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
