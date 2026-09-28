import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PenLine, Plus, Trash2 } from 'lucide-react';
import { deleteDraft, listDrafts, migrateLegacyDrafts } from '../lib/drafts';
import { formatDate, normalisePost, publishedPosts, readingMinutes } from '../lib/posts';
import { mode } from './store';
import WriterGate from './WriterGate';
import './writer.css';

const status = (p) =>
  p.isPublished ? (p.hasUnpublishedChanges ? 'Published, with unpublished changes' : 'Published') : 'Draft';

function CloudPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setPosts(await (await import('./cloud')).listPosts());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    import('./cloud')
      .then((c) => c.listPosts())
      .then(setPosts)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      {error && <p className="writer-error mt-6">{error}</p>}
      {posts === null && !error ? (
        <p className="meta mt-6">Loading…</p>
      ) : posts?.length === 0 ? (
        <p className="meta mt-6">No posts yet. Start one with New post.</p>
      ) : (
        <ul className="mt-6 max-w-[48rem] border-t border-border">
          {posts?.map((p) => (
            <li key={p.id} className="flex items-center gap-4 border-b border-border py-4">
              <Link to={`/write/${p.id}`} className="min-w-0 flex-1">
                <span className="block truncate font-serif text-[1.375rem] text-text-primary hover:text-accent">{p.title || 'Untitled'}</span>
                <span className="meta">
                  {status(p)}. Edited {formatDate(p.updated)}. {readingMinutes(p.html)} min read.
                </span>
              </Link>
              {p.isPublished && (
                <Link to={`/blog/${p.slug}`} className="writer-ghost">
                  View
                </Link>
              )}
              <button
                type="button"
                className="writer-ghost"
                aria-label={`Delete ${p.title || 'Untitled'}`}
                onClick={async () => {
                  if (!window.confirm(`Delete “${p.title || 'Untitled'}” for good? This removes the live post too and can't be undone.`)) return;
                  try {
                    await (await import('./cloud')).deletePost(p.id);
                    load();
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="writer-ghost mt-10"
        onClick={async () => {
          await (await import('./cloud')).signOut();
          navigate('/');
        }}
      >
        <LogOut size={16} aria-hidden="true" /> Sign out
      </button>
    </>
  );
}

function LocalPosts() {
  const [drafts, setDrafts] = useState(null);
  const published = publishedPosts();
  const publishedIds = new Set(published.map((p) => String(p.id)));

  useEffect(() => {
    (async () => {
      await migrateLegacyDrafts(normalisePost);
      setDrafts(await listDrafts());
    })();
  }, []);

  return (
    <>
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
    </>
  );
}

// /write: every post, and the way into a new one.
export default function WriterHome() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = 'Writer';
    return () => meta.remove();
  }, []);

  return (
    <WriterGate>
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
          {mode === 'cloud'
            ? 'Drafts save to the database as you type. Publishing puts a post live straight away; the live version only changes when you publish again.'
            : 'Local mode: drafts are saved in this browser, and publishing writes into the site repository. Commit and push to put posts live.'}
        </p>
        {mode === 'cloud' ? <CloudPosts /> : <LocalPosts />}
      </div>
    </WriterGate>
  );
}
