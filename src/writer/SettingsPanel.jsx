import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { imageToDataUrl, pickFile } from './media';
import { isHttpUrl } from '../lib/embeds';
import { slugify } from '../lib/posts';

// Post settings: URL, SEO description, tags, date, pinning and the cover image.
export default function SettingsPanel({ draft, onChange, onClose, onUnpublish, flash }) {
  const ref = useRef(null);
  const [tags, setTags] = useState((draft.tags || []).join(', '));
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const setCover = (patch) => onChange({ cover: { src: '', alt: '', caption: '', ...draft.cover, ...patch } });
  const date = (draft.date || new Date().toISOString()).slice(0, 10);
  const description = draft.description || '';

  return (
    <dialog
      ref={ref}
      className="writer-drawer"
      aria-label="Post settings"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="writer-drawer-inner">
        <header>
          <h2>Post settings</h2>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <X size={18} />
          </button>
        </header>

        <section>
          <h3>Cover image</h3>
          {draft.cover?.src ? (
            <>
              <img src={draft.cover.src} alt="" className="writer-cover-thumb" />
              <label className="writer-field">
                <span>Alt text</span>
                <input value={draft.cover.alt || ''} onChange={(e) => setCover({ alt: e.target.value })} />
              </label>
              <label className="writer-field">
                <span>Caption</span>
                <input value={draft.cover.caption || ''} onChange={(e) => setCover({ caption: e.target.value })} />
              </label>
              <button type="button" className="is-quiet" onClick={() => onChange({ cover: null })}>
                Remove cover
              </button>
            </>
          ) : (
            <div className="writer-cover-add">
              <button
                type="button"
                onClick={async () => {
                  const file = await pickFile('image/png,image/jpeg,image/webp,image/gif,image/avif');
                  if (!file) return;
                  try {
                    setCover({ src: await imageToDataUrl(file) });
                  } catch (err) {
                    flash(err.message, 'error');
                  }
                }}
              >
                Upload an image
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isHttpUrl(coverUrl)) setCover({ src: coverUrl });
                }}
              >
                <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="or paste an image URL" aria-label="Cover image URL" />
              </form>
            </div>
          )}
        </section>

        <section>
          <h3>Details</h3>
          <label className="writer-field">
            <span>URL</span>
            <div className="writer-slug">
              <span>/blog/</span>
              <input value={draft.slug || ''} onChange={(e) => onChange({ slug: slugify(e.target.value) })} placeholder={slugify(draft.title) || 'post-url'} />
            </div>
          </label>
          <label className="writer-field">
            <span>Description</span>
            <textarea rows={3} maxLength={200} value={description} onChange={(e) => onChange({ description: e.target.value })} />
            <small>Shown in the post list and in link previews. {200 - description.length} characters left.</small>
          </label>
          <label className="writer-field">
            <span>Tags</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onBlur={() => onChange({ tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5) })}
              placeholder="CUDA, inference, notes"
            />
            <small>Comma separated, up to five.</small>
          </label>
          <label className="writer-field">
            <span>Publish date</span>
            <input type="date" value={date} onChange={(e) => e.target.value && onChange({ date: new Date(`${e.target.value}T09:00:00`).toISOString() })} />
          </label>
          <label className="writer-check">
            <input type="checkbox" checked={!!draft.pinned} onChange={(e) => onChange({ pinned: e.target.checked })} />
            Pin to the top of the list
          </label>
        </section>

        {onUnpublish && (
          <section>
            <h3>Unpublish</h3>
            <p className="writer-dialog-text">Removes this post from src/data/posts.json. The draft stays here.</p>
            <button type="button" className="is-quiet" onClick={onUnpublish}>
              Unpublish post
            </button>
          </section>
        )}
      </div>
    </dialog>
  );
}
