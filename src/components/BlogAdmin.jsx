import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import katex from 'katex';
import { Download, Plus, Save, Upload } from 'lucide-react';
import StructuredEditor from './StructuredEditor';
import { allPosts, readDrafts, writeDrafts } from '../lib/posts';

// Jodit's math button renders with the global KaTeX.
window.katex = katex;

// This is a local drafting tool, not a CMS. Drafts are stored in this browser only, so there is
// nothing here to protect with a password. Publishing means exporting posts.json and committing it.
export default function BlogAdmin() {
  const [posts, setPosts] = useState(allPosts);
  const [current, setCurrent] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const flash = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 3000);
  };

  const save = () => {
    const post = { ...current, id: current.id || Date.now().toString() };
    const drafts = readDrafts();
    const next = drafts.some((p) => String(p.id) === String(post.id))
      ? drafts.map((p) => (String(p.id) === String(post.id) ? post : p))
      : [...drafts, post];
    writeDrafts(next);
    setCurrent(post);
    setPosts(allPosts());
    flash('Saved to this browser.');
  };

  const exportAll = () => {
    const data = allPosts().map((p) => {
      const post = { ...p };
      delete post.draft;
      return post;
    });
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error('not a list');
      writeDrafts(data);
      setPosts(allPosts());
      flash(`Imported ${data.length} posts.`);
    } catch {
      flash('That file is not a posts.json export.');
    }
    e.target.value = '';
  };

  const button =
    'inline-flex cursor-pointer items-center gap-2 rounded-[3px] border border-border px-3 py-2 text-[0.875rem] text-text-secondary transition-colors hover:border-accent hover:text-text-primary';

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="link meta">Back to the site</Link>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCurrent({ title: '', pinned: false, blocks: [{ id: Date.now().toString(), type: 'text', content: '' }] })} className={button}>
            <Plus size={16} /> New post
          </button>
          <button type="button" onClick={exportAll} className={button}>
            <Download size={16} /> Export posts.json
          </button>
          <label className={button}>
            <Upload size={16} /> Import
            <input type="file" accept="application/json" onChange={importFile} className="sr-only" />
          </label>
          {current && (
            <button type="button" onClick={save} className={`${button} border-accent text-text-primary`}>
              <Save size={16} /> Save draft
            </button>
          )}
        </div>
      </div>

      <p className="meta mt-6 max-w-[40rem]">
        Drafts live in this browser only. To publish, export posts.json, replace src/data/posts.json with it,
        and push.
      </p>
      <p role="status" aria-live="polite" className="meta mt-2 text-accent">{notice}</p>

      {!current ? (
        <div className="mt-8">
          <h1 className="display text-4xl">Posts</h1>
          <ul className="mt-6 border-t border-border">
            {posts.length === 0 && <li className="py-4 text-text-muted">No posts yet. Start one with New post.</li>}
            {posts.map((post) => (
              <li key={post.id} className="border-b border-border">
                <button type="button" onClick={() => setCurrent({ ...post })} className="w-full cursor-pointer py-4 text-left hover:text-accent">
                  <span className="font-serif text-xl">{post.title || 'Untitled'}</span>
                  <span className="meta ml-3">
                    {post.draft ? 'Draft' : 'Published'}
                    {post.pinned ? ', pinned' : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            value={current.title}
            onChange={(e) => setCurrent({ ...current, title: e.target.value })}
            placeholder="Title"
            aria-label="Post title"
            className="display border-b border-border bg-transparent py-2 text-4xl outline-none focus:border-accent"
          />
          <label className="flex items-center gap-2 text-[0.875rem] text-text-secondary">
            <input type="checkbox" checked={current.pinned || false} onChange={(e) => setCurrent({ ...current, pinned: e.target.checked })} className="accent-[var(--accent)]" />
            Pin to the top of the list
          </label>
          <StructuredEditor blocks={current.blocks} setBlocks={(blocks) => setCurrent({ ...current, blocks })} />
        </div>
      )}
    </div>
  );
}
