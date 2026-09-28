import { useEffect, useMemo, useRef, useState } from 'react';
import katex from 'katex';
import { X } from 'lucide-react';
import { classifyUrl, isHttpUrl } from '../lib/embeds';

// One accessible modal built on <dialog>: focus is trapped, Escape closes, focus returns afterwards.
export function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`writer-dialog ${wide ? 'is-wide' : ''}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
    >
      <div className="writer-dialog-inner">
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

const Field = ({ label, hint, children }) => (
  <label className="writer-field">
    <span>{label}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>
);

const Actions = ({ children }) => <div className="writer-dialog-actions">{children}</div>;

export function LinkDialog({ initial, onSubmit, onRemove, onClose }) {
  const [href, setHref] = useState(initial.href || '');
  const valid = isHttpUrl(href) || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:');
  return (
    <Modal title={initial.href ? 'Edit link' : 'Add link'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit(href.trim());
        }}
      >
        <Field label="URL" hint="Links to other sites open in a new tab.">
          <input autoFocus value={href} onChange={(e) => setHref(e.target.value)} placeholder="https://" inputMode="url" />
        </Field>
        <Actions>
          {initial.href && (
            <button type="button" className="is-quiet" onClick={onRemove}>
              Remove link
            </button>
          )}
          <button type="submit" disabled={!valid}>
            {initial.href ? 'Update' : 'Add link'}
          </button>
        </Actions>
      </form>
    </Modal>
  );
}

// Paste any URL and choose how it appears: embedded, as a link card, or as a plain link.
export function EmbedDialog({ onSubmit, onClose }) {
  const [url, setUrl] = useState('');
  const kind = useMemo(() => (isHttpUrl(url) ? classifyUrl(url) : null), [url]);
  const [mode, setMode] = useState('auto');
  const options = kind
    ? [
        ...(kind.kind !== 'link' ? [['auto', kind.kind === 'embed' ? `Embed the ${kind.provider} player` : `Show the ${kind.kind}`]] : []),
        ['card', 'Link card, with a title and a short description'],
        ['plain', 'Plain link, inline in the text'],
      ]
    : [];
  const chosen = options.some(([m]) => m === mode) ? mode : options[0]?.[0];
  return (
    <Modal title="Embed or link" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (kind) onSubmit(kind, chosen);
        }}
      >
        <Field label="URL" hint="YouTube, Vimeo, Spotify, Loom and CodePen embed as players. Image and video file links show inline. Anything else becomes a card or a link.">
          <input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" inputMode="url" />
        </Field>
        {kind && (
          <fieldset className="writer-choices">
            <legend>Show it as</legend>
            {options.map(([m, label]) => (
              <label key={m}>
                <input type="radio" name="mode" value={m} checked={chosen === m} onChange={() => setMode(m)} />
                {label}
              </label>
            ))}
          </fieldset>
        )}
        <Actions>
          <button type="submit" disabled={!kind}>
            Insert
          </button>
        </Actions>
      </form>
    </Modal>
  );
}

export function MediaUrlDialog({ title, hint, onSubmit, onClose }) {
  const [url, setUrl] = useState('');
  return (
    <Modal title={title} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isHttpUrl(url)) onSubmit(url.trim());
        }}
      >
        <Field label="URL" hint={hint}>
          <input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" inputMode="url" />
        </Field>
        <Actions>
          <button type="submit" disabled={!isHttpUrl(url)}>
            Insert
          </button>
        </Actions>
      </form>
    </Modal>
  );
}

export function MathDialog({ initial, onSubmit, onRemove, onClose }) {
  const [latex, setLatex] = useState(initial.latex || '');
  const [display, setDisplay] = useState(initial.kind === 'block');
  const preview = useMemo(() => {
    try {
      return { html: katex.renderToString(latex || '\\;', { displayMode: display, throwOnError: true }) };
    } catch (err) {
      return { error: err.message.replace(/^KaTeX parse error: /, '') };
    }
  }, [latex, display]);
  return (
    <Modal title={initial.pos != null ? 'Edit equation' : 'Insert equation'} onClose={onClose} wide>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (latex.trim() && !preview.error) onSubmit(latex.trim(), display ? 'block' : 'inline');
        }}
      >
        <Field label="LaTeX" hint="KaTeX syntax. In the text you can also type $$x^2$$ for inline math or $$$…$$$ for a display equation.">
          <textarea
            autoFocus
            rows={4}
            className="font-mono"
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder={'\\mathcal{L}(\\theta) = -\\sum_i y_i \\log p_\\theta(x_i)'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) e.currentTarget.form.requestSubmit();
            }}
          />
        </Field>
        {initial.pos == null && (
          <label className="writer-check">
            <input type="checkbox" checked={display} onChange={(e) => setDisplay(e.target.checked)} />
            Display equation, on its own line
          </label>
        )}
        <div className="writer-math-preview" aria-live="polite">
          {preview.error ? <p className="writer-error">{preview.error}</p> : <div dangerouslySetInnerHTML={{ __html: preview.html }} />}
        </div>
        <Actions>
          {onRemove && (
            <button type="button" className="is-quiet" onClick={onRemove}>
              Delete equation
            </button>
          )}
          <button type="submit" disabled={!latex.trim() || !!preview.error}>
            {initial.pos != null ? 'Update' : 'Insert'}
          </button>
        </Actions>
      </form>
    </Modal>
  );
}

export function TextDialog({ title, label, hint, initial = '', multiline, submitLabel = 'Save', onSubmit, onRemove, removeLabel, onClose }) {
  const [value, setValue] = useState(initial);
  const Input = multiline ? 'textarea' : 'input';
  return (
    <Modal title={title} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value.trim());
        }}
      >
        <Field label={label} hint={hint}>
          <Input autoFocus rows={multiline ? 4 : undefined} value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Actions>
          {onRemove && (
            <button type="button" className="is-quiet" onClick={onRemove}>
              {removeLabel || 'Remove'}
            </button>
          )}
          <button type="submit">{submitLabel}</button>
        </Actions>
      </form>
    </Modal>
  );
}

export function CtaDialog({ initial, onSubmit, onRemove, onClose }) {
  const [label, setLabel] = useState(initial.label || 'Read more');
  const [href, setHref] = useState(initial.href || '');
  const valid = label.trim() && (isHttpUrl(href) || href.startsWith('/') || href.startsWith('mailto:'));
  return (
    <Modal title="Button" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit({ label: label.trim(), href: href.trim() });
        }}
      >
        <Field label="Label">
          <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="Link">
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="https:// or /path or mailto:" />
        </Field>
        <Actions>
          {onRemove && (
            <button type="button" className="is-quiet" onClick={onRemove}>
              Remove button
            </button>
          )}
          <button type="submit" disabled={!valid}>
            Save
          </button>
        </Actions>
      </form>
    </Modal>
  );
}

const SHORTCUTS = [
  ['Bold, italic, underline', 'Ctrl B, Ctrl I, Ctrl U'],
  ['Strikethrough', 'Ctrl Shift S'],
  ['Inline code', 'Ctrl E'],
  ['Highlight', 'Ctrl Shift H'],
  ['Link', 'Ctrl K'],
  ['Heading 2, 3, 4', 'Ctrl Alt 2, 3, 4'],
  ['Bulleted, numbered list', 'Ctrl Shift 8, Ctrl Shift 7'],
  ['Quote', 'Ctrl Shift B'],
  ['Code block', 'Ctrl Alt C'],
  ['Insert any block', '/'],
  ['Save now', 'Ctrl S'],
  ['Preview', 'Ctrl Shift P'],
  ['Undo, redo', 'Ctrl Z, Ctrl Shift Z'],
];

const MARKDOWN = [
  ['## Heading', 'Heading 2 (### for 3)'],
  ['- or *', 'Bulleted list'],
  ['1.', 'Numbered list'],
  ['>', 'Quote'],
  ['```', 'Code block'],
  ['---', 'Divider'],
  ['**bold**, *italic*, `code`', 'Inline formatting'],
  ['$$x^2$$', 'Inline math'],
];

export function ShortcutsDialog({ onClose }) {
  return (
    <Modal title="Keyboard shortcuts" onClose={onClose} wide>
      <div className="writer-shortcuts">
        <table>
          <caption>Commands (Cmd on a Mac)</caption>
          <tbody>
            {SHORTCUTS.map(([what, keys]) => (
              <tr key={what}>
                <th scope="row">{what}</th>
                <td>
                  <kbd>{keys}</kbd>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <caption>Markdown as you type</caption>
          <tbody>
            {MARKDOWN.map(([md, what]) => (
              <tr key={md}>
                <th scope="row">
                  <kbd>{md}</kbd>
                </th>
                <td>{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
