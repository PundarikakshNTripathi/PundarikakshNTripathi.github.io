import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import Mathematics from '@tiptap/extension-mathematics';
import 'katex/dist/katex.min.css';
import '../article.css';
import './writer.css';
import {
  AlignCenter, AlignLeft, AlignRight, ArrowLeft, Asterisk, BetweenHorizontalStart, BetweenVerticalStart, Bold, CaseSensitive,
  Code, Columns3, Eye, EyeOff, Film, Globe, Heading2, Heading3, Heading4, Highlighter, Image, ImagePlay, Info, Italic,
  Keyboard, Link2, List, ListOrdered, Minus, PanelTop, Pilcrow, Quote, RectangleHorizontal, Redo2, Rows3, Settings2,
  Sigma, SquareCode, Strikethrough, Subscript as SubIcon, Superscript as SupIcon, Table, TextQuote, Trash2, Underline,
  Undo2,
} from 'lucide-react';
import { CodeBlock, CtaButton, DropCap, Embed, Figure, Footnote, LinkCard, PullQuote, Callout, Video, emit } from './nodes';
import { lowlight } from './lowlight';
import { SlashCommand } from './slash';
import { imageToDataUrl, pickFile, videoToDataUrl } from './media';
import { canWriteToFolder, downloadPostsJson, publishToFolder, unpublishFromFolder } from './publish';
import { CtaDialog, EmbedDialog, LinkDialog, MathDialog, MediaUrlDialog, Modal, ShortcutsDialog, TextDialog } from './dialogs';
import SettingsPanel from './SettingsPanel';
import { getDraft, newDraft, saveDraft } from '../lib/drafts';
import { findPublished, readingMinutes, slugify } from '../lib/posts';
import { hostOf } from '../lib/embeds';
import { ArticleView } from '../components/BlogView';

/* ---------- Block commands: shared by the toolbar's insert buttons and the "/" menu ---------- */

function blockCommands(actions) {
  return [
    { title: 'Text', hint: 'Plain paragraph', icon: Pilcrow, keywords: 'paragraph', run: (e) => e.chain().focus().setParagraph().run() },
    { title: 'Heading 2', hint: 'Section heading', icon: Heading2, keywords: 'h2 title', run: (e) => e.chain().focus().setHeading({ level: 2 }).run() },
    { title: 'Heading 3', hint: 'Subsection', icon: Heading3, keywords: 'h3', run: (e) => e.chain().focus().setHeading({ level: 3 }).run() },
    { title: 'Heading 4', hint: 'Minor heading', icon: Heading4, keywords: 'h4', run: (e) => e.chain().focus().setHeading({ level: 4 }).run() },
    { title: 'Bulleted list', hint: 'Unordered list', icon: List, keywords: 'ul bullet', run: (e) => e.chain().focus().toggleBulletList().run() },
    { title: 'Numbered list', hint: 'Ordered list', icon: ListOrdered, keywords: 'ol number', run: (e) => e.chain().focus().toggleOrderedList().run() },
    { title: 'Quote', hint: 'Block quote', icon: Quote, keywords: 'blockquote cite', run: (e) => e.chain().focus().toggleBlockquote().run() },
    { title: 'Pull quote', hint: 'Large, set-apart quote', icon: TextQuote, keywords: 'pullquote', run: (e) => e.chain().focus().togglePullQuote().run() },
    { title: 'Callout', hint: 'Boxed note or aside', icon: Info, keywords: 'note aside box warning tip', run: (e) => e.chain().focus().toggleCallout().run() },
    { title: 'Code block', hint: 'Syntax highlighted', icon: SquareCode, keywords: 'code pre snippet', run: (e) => e.chain().focus().toggleCodeBlock().run() },
    { title: 'Equation', hint: 'LaTeX, inline or display', icon: Sigma, keywords: 'math latex katex formula', run: () => actions.math() },
    { title: 'Image', hint: 'Upload a picture', icon: Image, keywords: 'picture photo upload', run: () => actions.image() },
    { title: 'GIF', hint: 'Upload or paste a GIF link', icon: ImagePlay, keywords: 'gif animation', run: () => actions.gif() },
    { title: 'Video', hint: 'Upload a video file', icon: Film, keywords: 'mp4 webm movie', run: () => actions.video() },
    { title: 'Embed or link', hint: 'YouTube, Vimeo, Spotify, link card…', icon: Globe, keywords: 'youtube vimeo spotify loom codepen url bookmark card', run: () => actions.embed() },
    { title: 'Table', hint: '3 × 3 with a header row', icon: Table, keywords: 'grid rows columns', run: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { title: 'Divider', hint: 'Section break', icon: Minus, keywords: 'hr rule separator', run: (e) => e.chain().focus().setHorizontalRule().run() },
    { title: 'Footnote', hint: 'Numbered note at the end', icon: Asterisk, keywords: 'note reference', run: () => actions.footnote() },
    { title: 'Button', hint: 'Call to action', icon: RectangleHorizontal, keywords: 'cta link button', run: () => actions.cta() },
  ];
}

/* ---------- Small pieces ---------- */

const Btn = ({ label, icon: Icon, active, disabled, onClick, children }) => (
  <button
    type="button"
    className={`writer-btn ${active ? 'is-active' : ''}`}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active ?? undefined}
    title={label}
  >
    {Icon ? <Icon size={17} strokeWidth={1.75} aria-hidden="true" /> : children}
  </button>
);

const Sep = () => <span className="writer-sep" aria-hidden="true" />;

const STYLES = [
  ['paragraph', 'Text'],
  ['h2', 'Heading 2'],
  ['h3', 'Heading 3'],
  ['h4', 'Heading 4'],
];

function Toolbar({ editor, actions, onShortcuts }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      style: e.isActive('heading', { level: 2 }) ? 'h2' : e.isActive('heading', { level: 3 }) ? 'h3' : e.isActive('heading', { level: 4 }) ? 'h4' : 'paragraph',
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      highlight: e.isActive('highlight'),
      link: e.isActive('link'),
      sub: e.isActive('subscript'),
      sup: e.isActive('superscript'),
      left: e.isActive({ textAlign: 'left' }),
      center: e.isActive({ textAlign: 'center' }),
      right: e.isActive({ textAlign: 'right' }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      pull: e.isActive('pullQuote'),
      callout: e.isActive('callout'),
      codeBlock: e.isActive('codeBlock'),
      dropcap: !!e.getAttributes('paragraph').dropcap,
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  return (
    <div className="writer-toolbar" role="toolbar" aria-label="Formatting">
      <Btn label="Undo" icon={Undo2} disabled={!s.canUndo} onClick={() => c().undo().run()} />
      <Btn label="Redo" icon={Redo2} disabled={!s.canRedo} onClick={() => c().redo().run()} />
      <Sep />
      <select
        className="writer-select"
        aria-label="Text style"
        value={s.style}
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'paragraph') c().setParagraph().run();
          else c().setHeading({ level: Number(v[1]) }).run();
        }}
      >
        {STYLES.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <Sep />
      <Btn label="Bold" icon={Bold} active={s.bold} onClick={() => c().toggleBold().run()} />
      <Btn label="Italic" icon={Italic} active={s.italic} onClick={() => c().toggleItalic().run()} />
      <Btn label="Underline" icon={Underline} active={s.underline} onClick={() => c().toggleUnderline().run()} />
      <Btn label="Strikethrough" icon={Strikethrough} active={s.strike} onClick={() => c().toggleStrike().run()} />
      <Btn label="Inline code" icon={Code} active={s.code} onClick={() => c().toggleCode().run()} />
      <Btn label="Highlight" icon={Highlighter} active={s.highlight} onClick={() => c().toggleHighlight().run()} />
      <Btn label="Link (Ctrl K)" icon={Link2} active={s.link} onClick={actions.link} />
      <Btn label="Subscript" icon={SubIcon} active={s.sub} onClick={() => c().toggleSubscript().run()} />
      <Btn label="Superscript" icon={SupIcon} active={s.sup} onClick={() => c().toggleSuperscript().run()} />
      <Sep />
      <Btn label="Align left" icon={AlignLeft} active={s.left} onClick={() => c().setTextAlign('left').run()} />
      <Btn label="Align center" icon={AlignCenter} active={s.center} onClick={() => c().setTextAlign('center').run()} />
      <Btn label="Align right" icon={AlignRight} active={s.right} onClick={() => c().setTextAlign('right').run()} />
      <Sep />
      <Btn label="Bulleted list" icon={List} active={s.bullet} onClick={() => c().toggleBulletList().run()} />
      <Btn label="Numbered list" icon={ListOrdered} active={s.ordered} onClick={() => c().toggleOrderedList().run()} />
      <Btn label="Quote" icon={Quote} active={s.quote} onClick={() => c().toggleBlockquote().run()} />
      <Btn label="Pull quote" icon={TextQuote} active={s.pull} onClick={() => c().togglePullQuote().run()} />
      <Btn label="Callout" icon={Info} active={s.callout} onClick={() => c().toggleCallout().run()} />
      <Btn label="Drop cap" icon={CaseSensitive} active={s.dropcap} onClick={() => c().toggleDropCap().run()} />
      <Sep />
      <Btn label="Code block" icon={SquareCode} active={s.codeBlock} onClick={() => c().toggleCodeBlock().run()} />
      <Btn label="Equation" icon={Sigma} onClick={actions.math} />
      <Btn label="Image" icon={Image} onClick={actions.image} />
      <Btn label="GIF" icon={ImagePlay} onClick={actions.gif} />
      <Btn label="Video" icon={Film} onClick={actions.video} />
      <Btn label="Embed or link" icon={Globe} onClick={actions.embed} />
      <Btn label="Table" icon={Table} onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
      <Btn label="Footnote" icon={Asterisk} onClick={actions.footnote} />
      <Btn label="Button" icon={RectangleHorizontal} onClick={actions.cta} />
      <Btn label="Divider" icon={Minus} onClick={() => c().setHorizontalRule().run()} />
      <Sep />
      <Btn label="Keyboard shortcuts" icon={Keyboard} onClick={onShortcuts} />
    </div>
  );
}

// Medium-style menu on selected text.
function SelectionMenu({ editor, actions }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      highlight: e.isActive('highlight'),
      link: e.isActive('link'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      quote: e.isActive('blockquote'),
    }),
  });
  const c = () => editor.chain().focus();
  return (
    <BubbleMenu
      editor={editor}
      pluginKey="selectionMenu"
      shouldShow={({ editor: e, state }) => {
        const { empty, from, to } = state.selection;
        if (empty || from === to) return false;
        if (e.isActive('codeBlock') || e.isActive('table')) return false;
        return !state.selection.node;
      }}
      className="writer-bubble"
    >
      <Btn label="Bold" icon={Bold} active={s.bold} onClick={() => c().toggleBold().run()} />
      <Btn label="Italic" icon={Italic} active={s.italic} onClick={() => c().toggleItalic().run()} />
      <Btn label="Underline" icon={Underline} active={s.underline} onClick={() => c().toggleUnderline().run()} />
      <Btn label="Strikethrough" icon={Strikethrough} active={s.strike} onClick={() => c().toggleStrike().run()} />
      <Btn label="Inline code" icon={Code} active={s.code} onClick={() => c().toggleCode().run()} />
      <Btn label="Highlight" icon={Highlighter} active={s.highlight} onClick={() => c().toggleHighlight().run()} />
      <Btn label="Link" icon={Link2} active={s.link} onClick={actions.link} />
      <Sep />
      <Btn label="Heading 2" icon={Heading2} active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()} />
      <Btn label="Heading 3" icon={Heading3} active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()} />
      <Btn label="Quote" icon={Quote} active={s.quote} onClick={() => c().toggleBlockquote().run()} />
      <Btn label="Inline equation from selection" icon={Sigma} onClick={actions.mathFromSelection} />
      <Btn label="Footnote" icon={Asterisk} onClick={actions.footnote} />
    </BubbleMenu>
  );
}

function TableMenu({ editor }) {
  const c = () => editor.chain().focus();
  return (
    <BubbleMenu editor={editor} pluginKey="tableMenu" shouldShow={({ editor: e }) => e.isActive('table')} className="writer-bubble" options={{ placement: 'top' }}>
      <Btn label="Add row below" icon={Rows3} onClick={() => c().addRowAfter().run()} />
      <Btn label="Add column right" icon={Columns3} onClick={() => c().addColumnAfter().run()} />
      <Btn label="Delete row" icon={BetweenHorizontalStart} onClick={() => c().deleteRow().run()} />
      <Btn label="Delete column" icon={BetweenVerticalStart} onClick={() => c().deleteColumn().run()} />
      <Btn label="Toggle header row" icon={PanelTop} onClick={() => c().toggleHeaderRow().run()} />
      <Sep />
      <Btn label="Delete table" icon={Trash2} onClick={() => c().deleteTable().run()} />
    </BubbleMenu>
  );
}

/* ---------- The editor ---------- */

// Title and subtitle grow with their text.
const autosize = (el) => {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
};

// TipTap extensions are created once, but shortcuts and the "/" menu need the current actions.
// They read them from this object when they fire. Only one editor is mounted at a time.
const bus = { actions: {}, commands: [] };

function useAutosave(draft, html) {
  const [status, setStatus] = useState('saved');
  const first = useRef(true);
  const latest = useRef({ draft, html });
  useEffect(() => {
    latest.current = { draft, html };
  }, [draft, html]);

  const saveNow = useCallback(async () => {
    setStatus('saving');
    try {
      await saveDraft({ ...latest.current.draft, html: latest.current.html });
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    setStatus('unsaved');
    const t = setTimeout(saveNow, 700);
    return () => clearTimeout(t);
  }, [draft, html, saveNow]);

  return [status, saveNow];
}

function Editor({ initial }) {
  const [draft, setDraft] = useState(initial);
  const [html, setHtml] = useState(initial.html || '');
  const [dialog, setDialog] = useState(null);
  const [preview, setPreview] = useState(false);
  const [settings, setSettings] = useState(false);
  const [notice, setNotice] = useState(null);
  const [status, saveNow] = useAutosave(draft, html);
  const titleRef = useRef(null);
  const slugTouched = useRef(!!initial.slug && initial.slug !== slugify(initial.title));

  const update = (patch) =>
    setDraft((d) => {
      const next = { ...d, ...patch };
      if ('title' in patch && !slugTouched.current) next.slug = slugify(patch.title);
      return next;
    });

  const flash = (text, tone = 'ok') => {
    setNotice({ text, tone });
    setTimeout(() => setNotice(null), tone === 'error' ? 8000 : 4000);
  };

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: false,
        link: { openOnClick: false, autolink: true, linkOnPaste: true, defaultProtocol: 'https' },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => (node.type.name === 'heading' ? 'Heading' : 'Start writing, or type / to insert a block'),
      }),
      CharacterCount,
      Typography,
      Highlight,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TableKit.configure({ table: { resizable: false } }),
      Mathematics.configure({
        inlineOptions: { onClick: (node, pos) => emit('math', { kind: 'inline', latex: node.attrs.latex, pos }) },
        blockOptions: { onClick: (node, pos) => emit('math', { kind: 'block', latex: node.attrs.latex, pos }) },
        katexOptions: { throwOnError: false },
      }),
      CodeBlock.configure({ lowlight, defaultLanguage: 'plaintext' }),
      Figure,
      Video,
      Embed,
      LinkCard,
      PullQuote,
      Callout,
      Footnote,
      CtaButton,
      DropCap,
      // A function, not the object: configure() deep-copies plain options.
      SlashCommand.configure({ items: () => bus.commands }),
      Extension.create({
        name: 'writerKeys',
        addKeyboardShortcuts: () => ({
          'Mod-k': () => {
            bus.actions.link();
            return true;
          },
          'Mod-s': () => {
            bus.actions.save();
            return true;
          },
          'Mod-Shift-p': () => {
            bus.actions.preview();
            return true;
          },
        }),
      }),
    ],
    []
  );

  const insertFile = useCallback(async (editor, file, pos) => {
    try {
      if (file.type.startsWith('image/')) {
        const src = await imageToDataUrl(file);
        const node = { type: 'figure', attrs: { src, alt: '', caption: '', width: 'normal' } };
        if (pos != null) editor.chain().focus().insertContentAt(pos, node).run();
        else editor.chain().focus().insertContent(node).run();
      } else if (file.type.startsWith('video/')) {
        const src = await videoToDataUrl(file);
        editor.chain().focus().insertContent({ type: 'video', attrs: { src, caption: '', width: 'normal' } }).run();
      }
    } catch (err) {
      flash(err.message, 'error');
    }
  }, []);

  const editorRef = useRef(null);
  const editor = useEditor({
    extensions,
    content: initial.html || '',
    immediatelyRender: true,
    onUpdate: ({ editor: e }) => setHtml(e.getHTML()),
    editorProps: {
      attributes: { class: 'article writer-content', 'aria-label': 'Post body', spellcheck: 'true' },
      handlePaste: (view, event) => {
        const file = [...(event.clipboardData?.files || [])].find((f) => /^(image|video)\//.test(f.type));
        if (file) {
          insertFile(editorRef.current, file);
          return true;
        }
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        if (moved) return false;
        const file = [...(event.dataTransfer?.files || [])].find((f) => /^(image|video)\//.test(f.type));
        if (!file) return false;
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertFile(editorRef.current, file, pos);
        return true;
      },
    },
  });
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Everything the toolbar, "/" menu, shortcuts and node views can ask for.
  const actions = useMemo(() => editor && {
    save: () => saveNow().then(() => flash('Saved.')),
    preview: () => setPreview((p) => !p),
    link: () => setDialog({ type: 'link', href: editor.getAttributes('link').href || '' }),
    embed: () => setDialog({ type: 'embed' }),
    math: () => setDialog({ type: 'math', kind: 'inline', latex: '' }),
    mathFromSelection: () => {
      const { from, to } = editor.state.selection;
      setDialog({ type: 'math', kind: 'inline', latex: editor.state.doc.textBetween(from, to), replace: { from, to } });
    },
    footnote: () => setDialog({ type: 'footnote', note: '' }),
    cta: () => setDialog({ type: 'cta', label: 'Read more', href: '' }),
    image: async () => {
      const file = await pickFile('image/png,image/jpeg,image/webp,image/gif,image/avif');
      if (file) insertFile(editor, file);
    },
    gif: () => setDialog({ type: 'gif' }),
    video: async () => {
      const file = await pickFile('video/mp4,video/webm,video/ogg,video/quicktime');
      if (file) insertFile(editor, file);
    },
  }, [editor, insertFile, saveNow]);

  // Extensions and keyboard shortcuts read the latest actions at the moment they fire.
  useEffect(() => {
    bus.actions = actions || {};
    bus.commands = actions ? blockCommands(actions) : [];
  }, [actions]);

  // Node views and math nodes open dialogs through window events.
  useEffect(() => {
    const on = (name, fn) => {
      const h = (e) => fn(e.detail);
      window.addEventListener(`writer:${name}`, h);
      return () => window.removeEventListener(`writer:${name}`, h);
    };
    const offs = [
      on('math', (d) => setDialog({ type: 'math', ...d })),
      on('footnote', (d) => setDialog({ type: 'footnote', ...d })),
      on('cta', (d) => setDialog({ type: 'cta', ...d })),
      on('alt', (d) => setDialog({ type: 'alt', ...d })),
      on('card-image', (d) => setDialog({ type: 'card-image', ...d })),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  const close = () => {
    setDialog(null);
    editor?.commands.focus();
  };

  const words = useEditorState({ editor, selector: ({ editor: e }) => e?.storage.characterCount.words() ?? 0 });

  const publish = async (mode) => {
    await saveNow();
    const post = { ...draft, html, slug: draft.slug || slugify(draft.title) || draft.id };
    if (!post.title.trim()) {
      flash('Give the post a title before publishing.', 'error');
      return;
    }
    try {
      if (mode === 'folder') {
        const r = await publishToFolder(post);
        flash(`Published to ${r.folder}/src/data/posts.json${r.mediaCount ? ` with ${r.mediaCount} media file${r.mediaCount > 1 ? 's' : ''}` : ''}. Commit and push to put it live.`);
      } else {
        downloadPostsJson(post);
        flash('Downloaded posts.json. Replace src/data/posts.json with it, then commit and push.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') flash(err.message, 'error');
    }
  };

  const unpublish = async () => {
    try {
      await unpublishFromFolder(draft.id);
      flash('Removed from posts.json. Commit and push to take it down.');
    } catch (err) {
      if (err.name !== 'AbortError') flash(err.message, 'error');
    }
  };

  if (!editor || !actions) return null;

  const statusText = { saved: 'Saved', saving: 'Saving…', unsaved: 'Editing', error: 'Could not save' }[status];

  return (
    <div className="writer">
      <header className="writer-header">
        <div className="writer-header-inner">
          <Link to="/write" className="writer-back">
            <ArrowLeft size={16} aria-hidden="true" /> Posts
          </Link>
          <p className="writer-status" aria-live="polite">
            <span className={status === 'error' ? 'text-dot' : ''}>{statusText}</span>
            <span className="hidden sm:inline">
              {' '}
              · {words.toLocaleString()} words · {readingMinutes(html)} min read
            </span>
          </p>
          <div className="writer-header-actions">
            <button type="button" className="writer-ghost" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>
              {preview ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              <span className="hidden sm:inline">{preview ? 'Edit' : 'Preview'}</span>
            </button>
            <button type="button" className="writer-ghost" onClick={() => setSettings(true)}>
              <Settings2 size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button type="button" className="writer-primary" onClick={() => setDialog({ type: 'publish' })}>
              Publish
            </button>
          </div>
        </div>
        {!preview && <Toolbar editor={editor} actions={actions} onShortcuts={() => setDialog({ type: 'shortcuts' })} />}
      </header>

      {notice && (
        <p role="status" className={`writer-notice ${notice.tone === 'error' ? 'is-error' : ''}`}>
          {notice.text}
        </p>
      )}

      {preview ? (
        <ArticleView post={{ ...draft, html }} preview />
      ) : (
        <div className="writer-page">
          <div className="writer-cover">
            {draft.cover?.src ? (
              <figure>
                <img src={draft.cover.src} alt={draft.cover.alt || ''} />
                <button type="button" className="writer-ghost" onClick={() => setSettings(true)}>
                  Edit cover
                </button>
              </figure>
            ) : (
              <button type="button" className="writer-add-cover" onClick={() => setSettings(true)}>
                <Image size={15} aria-hidden="true" /> Add a cover image
              </button>
            )}
          </div>
          <textarea
            ref={(el) => {
              titleRef.current = el;
              autosize(el);
            }}
            className="writer-title"
            rows={1}
            value={draft.title}
            placeholder="Title"
            aria-label="Title"
            onChange={(e) => {
              update({ title: e.target.value.replace(/\n/g, ' ') });
              autosize(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.writer-subtitle')?.focus();
              }
            }}
          />
          <textarea
            ref={autosize}
            className="writer-subtitle"
            rows={1}
            value={draft.subtitle}
            placeholder="Add a subtitle"
            aria-label="Subtitle"
            onChange={(e) => {
              update({ subtitle: e.target.value.replace(/\n/g, ' ') });
              autosize(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                editor.commands.focus('start');
              }
            }}
          />
          <EditorContent editor={editor} />
          <SelectionMenu editor={editor} actions={actions} />
          <TableMenu editor={editor} />
        </div>
      )}

      {settings && (
        <SettingsPanel
          draft={draft}
          onChange={(patch) => {
            if ('slug' in patch) slugTouched.current = true;
            update(patch);
          }}
          onClose={() => setSettings(false)}
          onUnpublish={canWriteToFolder() ? unpublish : null}
          flash={flash}
        />
      )}

      {dialog?.type === 'link' && (
        <LinkDialog
          initial={dialog}
          onClose={close}
          onRemove={() => {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setDialog(null);
          }}
          onSubmit={(href) => {
            const chain = editor.chain().focus().extendMarkRange('link');
            if (editor.state.selection.empty && !editor.isActive('link')) {
              chain.insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] }).run();
            } else {
              chain.setLink({ href }).run();
            }
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'embed' && (
        <EmbedDialog
          onClose={close}
          onSubmit={(k, mode) => {
            const chain = editor.chain().focus();
            if (mode === 'plain') {
              chain.insertContent({ type: 'text', text: k.url, marks: [{ type: 'link', attrs: { href: k.url } }] }).run();
            } else if (mode === 'card') {
              chain.setLinkCard({ url: k.url, title: hostOf(k.url), description: '' }).run();
            } else if (k.kind === 'embed') {
              chain.setEmbed({ src: k.src, url: k.url, provider: k.provider, aspect: k.aspect, height: k.height }).run();
            } else if (k.kind === 'image') {
              chain.setFigure({ src: k.url, alt: '', caption: '', width: 'normal' }).run();
            } else if (k.kind === 'video') {
              chain.setVideo({ src: k.url, caption: '', width: 'normal' }).run();
            }
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'gif' && (
        <MediaUrlDialog
          title="Insert a GIF"
          hint="Paste a link to a .gif file (on GIPHY, use “Copy GIF link”), or close this and use Image to upload one."
          onClose={close}
          onSubmit={(url) => {
            editor.chain().focus().setFigure({ src: url, alt: '', caption: '', width: 'normal' }).run();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'math' && (
        <MathDialog
          initial={dialog}
          onClose={close}
          onRemove={dialog.pos != null ? () => {
            editor.chain().focus().setNodeSelection(dialog.pos).deleteSelection().run();
            setDialog(null);
          } : null}
          onSubmit={(latex, kind) => {
            const chain = editor.chain().focus();
            if (dialog.pos != null) {
              chain.setNodeSelection(dialog.pos);
              if (dialog.kind === 'block') chain.updateBlockMath({ latex });
              else chain.updateInlineMath({ latex });
            } else {
              if (dialog.replace) chain.deleteRange(dialog.replace);
              if (kind === 'block') chain.insertBlockMath({ latex });
              else chain.insertInlineMath({ latex });
            }
            chain.run();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'footnote' && (
        <TextDialog
          title={dialog.set ? 'Edit footnote' : 'Add footnote'}
          label="Note"
          hint="Footnotes are numbered automatically and listed at the end of the post."
          multiline
          initial={dialog.note}
          submitLabel={dialog.set ? 'Save' : 'Add footnote'}
          onClose={close}
          onRemove={dialog.remove ? () => {
            dialog.remove();
            setDialog(null);
          } : null}
          removeLabel="Delete footnote"
          onSubmit={(note) => {
            if (dialog.set) dialog.set(note);
            else if (note) editor.chain().focus().insertFootnote(note).run();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'cta' && (
        <CtaDialog
          initial={dialog}
          onClose={close}
          onRemove={dialog.remove ? () => {
            dialog.remove();
            setDialog(null);
          } : null}
          onSubmit={(attrs) => {
            if (dialog.set) dialog.set(attrs);
            else editor.chain().focus().setCtaButton(attrs).run();
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'alt' && (
        <TextDialog
          title="Alt text"
          label="Describe the image for people who can't see it"
          hint="Screen readers read this aloud. Leave it empty only for purely decorative images."
          multiline
          initial={dialog.alt}
          onClose={close}
          onSubmit={(alt) => {
            dialog.set(alt);
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'card-image' && (
        <TextDialog
          title="Card image"
          label="Image URL"
          hint="An https:// link to a thumbnail for the card. Leave empty to remove it."
          initial={dialog.image}
          onClose={close}
          onSubmit={(image) => {
            dialog.set(/^https?:\/\//.test(image) ? image : '');
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === 'shortcuts' && <ShortcutsDialog onClose={close} />}
      {dialog?.type === 'publish' && (
        <PublishDialog
          onClose={close}
          onPublish={(mode) => {
            setDialog(null);
            publish(mode);
          }}
        />
      )}
    </div>
  );
}

function PublishDialog({ onPublish, onClose }) {
  const folder = canWriteToFolder();
  return (
    <Modal title="Publish" onClose={onClose}>
      <p className="writer-dialog-text">
        This site is static, so publishing writes the post into the repository. After that, commit and push, and
        GitHub Pages puts it live.
      </p>
      <div className="writer-publish-options">
        <button type="button" disabled={!folder} onClick={() => onPublish('folder')}>
          <strong>Write to the site folder</strong>
          <span>
            {folder
              ? 'Updates src/data/posts.json and saves images and videos to public/blog/media. You pick the repo folder once.'
              : 'Needs Chrome or Edge, which can write to a folder on your computer.'}
          </span>
        </button>
        <button type="button" onClick={() => onPublish('download')}>
          <strong>Download posts.json</strong>
          <span>For any browser. Media stays inline in the file, which can make it large.</span>
        </button>
      </div>
    </Modal>
  );
}


/* ---------- Route: load (or create) the draft, then show the editor ---------- */

export default function Writer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (id === 'new') {
        const d = newDraft();
        await saveDraft(d);
        navigate(`/write/${d.id}`, { replace: true });
        return;
      }
      let d = await getDraft(id);
      if (!d) {
        // Editing a published post: start a draft from it, with the same id so publishing replaces it.
        const p = findPublished(id);
        if (p) {
          d = { ...newDraft(), ...p, id: String(p.id) };
          await saveDraft(d);
        }
      }
      if (!alive) return;
      if (d) setDraft(d);
      else setMissing(true);
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    document.title = 'Writer';
    return () => {
      document.title = 'Pundarikaksh Narayan Tripathi';
    };
  }, []);

  if (missing) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24">
        <h1 className="display text-4xl">That draft isn't here.</h1>
        <p className="prose-serif mt-4">
          Drafts are stored in the browser they were written in. <Link to="/write" className="link">See your posts</Link>.
        </p>
      </section>
    );
  }
  if (!draft) return <div className="min-h-[60vh]" />;
  return <Editor key={draft.id} initial={draft} />;
}
