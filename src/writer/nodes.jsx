/* eslint-disable react-refresh/only-export-components -- TipTap extensions are defined next to their node views by design. */
import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { hostOf } from '../lib/embeds';
import { LANGUAGES } from './lowlight';

// Node views ask the Writer to open a dialog through a window event, so dialogs live in one place.
export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(`writer:${name}`, { detail }));

const Caption = ({ value, onChange, placeholder = 'Add a caption (optional)' }) => (
  <input
    className="writer-caption"
    value={value || ''}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Caption"
  />
);

const WidthPicker = ({ value, onChange }) => (
  <div className="writer-node-tools" contentEditable={false}>
    {[
      ['normal', 'Column'],
      ['wide', 'Wide'],
      ['full', 'Full'],
    ].map(([key, label]) => (
      <button key={key} type="button" className={value === key ? 'is-active' : ''} onClick={() => onChange(key)}>
        {label}
      </button>
    ))}
  </div>
);

/* ---------- Image and GIF, with caption, alt text and width ---------- */

const FigureView = ({ node, updateAttributes, selected, deleteNode }) => (
  <NodeViewWrapper as="figure" data-type="figure" data-width={node.attrs.width} className={selected ? 'is-selected' : ''}>
    <div className="writer-media" contentEditable={false} data-drag-handle>
      <img src={node.attrs.src} alt={node.attrs.alt} />
      {selected && (
        <div className="writer-media-bar">
          <WidthPicker value={node.attrs.width} onChange={(width) => updateAttributes({ width })} />
          <button type="button" onClick={() => emit('alt', { alt: node.attrs.alt, set: (alt) => updateAttributes({ alt }) })}>
            {node.attrs.alt ? 'Edit alt text' : 'Add alt text'}
          </button>
          <button type="button" onClick={deleteNode}>Remove</button>
        </div>
      )}
    </div>
    <Caption value={node.attrs.caption} onChange={(caption) => updateAttributes({ caption })} />
  </NodeViewWrapper>
);

export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null }, alt: { default: '' }, caption: { default: '' }, width: { default: 'normal' } };
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="figure"]',
        priority: 1000,
        getAttrs: (el) => ({
          src: el.querySelector('img')?.getAttribute('src'),
          alt: el.querySelector('img')?.getAttribute('alt') || '',
          caption: el.querySelector('figcaption')?.textContent || '',
          width: el.getAttribute('data-width') || 'normal',
        }),
      },
      { tag: 'img[src]', getAttrs: (el) => ({ src: el.getAttribute('src'), alt: el.getAttribute('alt') || '' }) },
    ];
  },
  renderHTML({ node }) {
    const { src, alt, caption, width } = node.attrs;
    return ['figure', { 'data-type': 'figure', 'data-width': width }, ['img', { src, alt }], ...(caption ? [['figcaption', {}, caption]] : [])];
  },
  addCommands() {
    return { setFigure: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }) };
  },
  addNodeView() {
    return ReactNodeViewRenderer(FigureView);
  },
});

/* ---------- Uploaded or linked video files ---------- */

const VideoView = ({ node, updateAttributes, selected, deleteNode }) => (
  <NodeViewWrapper as="figure" data-type="video" data-width={node.attrs.width} className={selected ? 'is-selected' : ''}>
    <div className="writer-media" contentEditable={false} data-drag-handle>
      <video src={node.attrs.src} controls playsInline preload="metadata" />
      {selected && (
        <div className="writer-media-bar">
          <WidthPicker value={node.attrs.width} onChange={(width) => updateAttributes({ width })} />
          <button type="button" onClick={deleteNode}>Remove</button>
        </div>
      )}
    </div>
    <Caption value={node.attrs.caption} onChange={(caption) => updateAttributes({ caption })} />
  </NodeViewWrapper>
);

export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null }, caption: { default: '' }, width: { default: 'normal' } };
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="video"]',
        priority: 1000,
        getAttrs: (el) => ({
          src: el.querySelector('video')?.getAttribute('src'),
          caption: el.querySelector('figcaption')?.textContent || '',
          width: el.getAttribute('data-width') || 'normal',
        }),
      },
    ];
  },
  renderHTML({ node }) {
    const { src, caption, width } = node.attrs;
    return [
      'figure',
      { 'data-type': 'video', 'data-width': width },
      ['video', { src, controls: 'true', playsinline: 'true', preload: 'metadata' }],
      ...(caption ? [['figcaption', {}, caption]] : []),
    ];
  },
  addCommands() {
    return { setVideo: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }) };
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});

/* ---------- Provider embeds: YouTube, Vimeo, Spotify, Loom, CodePen ---------- */

const frameStyle = (attrs) => (attrs.height ? { height: `${attrs.height}px` } : { aspectRatio: attrs.aspect || '16 / 9' });

const EmbedView = ({ node, updateAttributes, selected, deleteNode }) => (
  <NodeViewWrapper as="figure" data-type="embed" data-provider={node.attrs.provider} className={selected ? 'is-selected' : ''}>
    <div className="writer-media" contentEditable={false} data-drag-handle>
      <div className="embed-frame" style={frameStyle(node.attrs)}>
        <iframe src={node.attrs.src} title={`${node.attrs.provider} embed`} style={{ pointerEvents: selected ? 'auto' : 'none' }} allow="fullscreen; picture-in-picture" />
      </div>
      {selected && (
        <div className="writer-media-bar">
          <span className="writer-media-note">{node.attrs.provider}</span>
          <button type="button" onClick={deleteNode}>Remove</button>
        </div>
      )}
    </div>
    <Caption value={node.attrs.caption} onChange={(caption) => updateAttributes({ caption })} />
  </NodeViewWrapper>
);

export const Embed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      url: { default: null },
      provider: { default: '' },
      aspect: { default: '16 / 9' },
      height: { default: null },
      caption: { default: '' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="embed"]',
        priority: 1000,
        getAttrs: (el) => {
          const frame = el.querySelector('.embed-frame');
          return {
            src: el.querySelector('iframe')?.getAttribute('src'),
            url: el.getAttribute('data-url'),
            provider: el.getAttribute('data-provider') || '',
            aspect: frame?.style.aspectRatio || null,
            height: frame?.style.height ? parseInt(frame.style.height, 10) : null,
            caption: el.querySelector('figcaption')?.textContent || '',
          };
        },
      },
    ];
  },
  renderHTML({ node }) {
    const a = node.attrs;
    const style = a.height ? `height: ${a.height}px` : `aspect-ratio: ${a.aspect || '16 / 9'}`;
    return [
      'figure',
      { 'data-type': 'embed', 'data-provider': a.provider, 'data-url': a.url },
      [
        'div',
        { class: 'embed-frame', style },
        ['iframe', { src: a.src, title: `${a.provider} embed`, allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write', frameborder: '0' }],
      ],
      ...(a.caption ? [['figcaption', {}, a.caption]] : []),
    ];
  },
  addCommands() {
    return { setEmbed: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }) };
  },
  addNodeView() {
    return ReactNodeViewRenderer(EmbedView);
  },
});

/* ---------- Link cards: a URL shown as a bookmark rather than inline text ---------- */

const LinkCardView = ({ node, updateAttributes, selected, deleteNode }) => (
  <NodeViewWrapper className={`link-card-edit ${selected ? 'is-selected' : ''}`} data-drag-handle>
    <div className="link-card" contentEditable={false}>
      <span className="link-card-text">
        <input className="link-card-title" value={node.attrs.title} placeholder="Title" onChange={(e) => updateAttributes({ title: e.target.value })} />
        <input
          className="link-card-desc"
          value={node.attrs.description}
          placeholder="A line about what's on the other side (optional)"
          onChange={(e) => updateAttributes({ description: e.target.value })}
        />
        <span className="link-card-host">{hostOf(node.attrs.url)}</span>
      </span>
    </div>
    {selected && (
      <div className="writer-media-bar" contentEditable={false}>
        <button type="button" onClick={() => emit('card-image', { set: (image) => updateAttributes({ image }), image: node.attrs.image })}>
          {node.attrs.image ? 'Change image' : 'Add image'}
        </button>
        <button type="button" onClick={deleteNode}>Remove</button>
      </div>
    )}
  </NodeViewWrapper>
);

export const LinkCard = Node.create({
  name: 'linkCard',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { url: { default: '' }, title: { default: '' }, description: { default: '' }, image: { default: '' } };
  },
  parseHTML() {
    return [
      {
        tag: 'a[data-type="link-card"]',
        priority: 1000,
        getAttrs: (el) => ({
          url: el.getAttribute('href'),
          title: el.querySelector('.link-card-title')?.textContent || '',
          description: el.querySelector('.link-card-desc')?.textContent || '',
          image: el.querySelector('img')?.getAttribute('src') || '',
        }),
      },
    ];
  },
  renderHTML({ node }) {
    const { url, title, description, image } = node.attrs;
    return [
      'a',
      { 'data-type': 'link-card', class: 'link-card', href: url },
      [
        'span',
        { class: 'link-card-text' },
        ['strong', { class: 'link-card-title' }, title || hostOf(url)],
        ...(description ? [['span', { class: 'link-card-desc' }, description]] : []),
        ['span', { class: 'link-card-host' }, hostOf(url)],
      ],
      ...(image ? [['img', { src: image, alt: '' }]] : []),
    ];
  },
  addCommands() {
    return { setLinkCard: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }) };
  },
  addNodeView() {
    return ReactNodeViewRenderer(LinkCardView);
  },
});

/* ---------- Pull quote and callout ---------- */

export const PullQuote = Node.create({
  name: 'pullQuote',
  group: 'block',
  content: 'inline*',
  defining: true,
  parseHTML() {
    return [{ tag: 'aside[data-type="pull-quote"]', priority: 1000 }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['aside', mergeAttributes(HTMLAttributes, { 'data-type': 'pull-quote', class: 'pull-quote' }), 0];
  },
  addCommands() {
    return {
      togglePullQuote: () => ({ commands, editor }) =>
        editor.isActive(this.name) ? commands.setParagraph() : commands.setNode(this.name),
    };
  },
});

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'paragraph+',
  defining: true,
  addAttributes() {
    return {
      kind: {
        default: 'note',
        parseHTML: (el) => el.getAttribute('data-kind') || 'note',
        renderHTML: (attrs) => ({ 'data-kind': attrs.kind }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'aside[data-type="callout"]', priority: 1000 }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['aside', mergeAttributes(HTMLAttributes, { 'data-type': 'callout', class: 'callout' }), 0];
  },
  addCommands() {
    return {
      toggleCallout: (kind = 'note') => ({ commands, editor }) =>
        editor.isActive(this.name) ? commands.lift(this.name) : commands.wrapIn(this.name, { kind }),
    };
  },
});

/* ---------- Footnotes: an inline marker that carries its own note text ---------- */

const FootnoteView = ({ node, updateAttributes, deleteNode }) => (
  <NodeViewWrapper as="sup" className="footnote-marker" data-type="footnote">
    <button
      type="button"
      title={node.attrs.note || 'Empty footnote'}
      onClick={() => emit('footnote', { note: node.attrs.note, set: (note) => updateAttributes({ note }), remove: deleteNode })}
    >
      ✱
    </button>
  </NodeViewWrapper>
);

export const Footnote = Node.create({
  name: 'footnote',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return { note: { default: '', parseHTML: (el) => el.getAttribute('data-note') || '' } };
  },
  parseHTML() {
    return [{ tag: 'sup[data-type="footnote"]', priority: 1000 }];
  },
  renderHTML({ node }) {
    return ['sup', { 'data-type': 'footnote', 'data-note': node.attrs.note }, '*'];
  },
  addCommands() {
    return { insertFootnote: (note) => ({ commands }) => commands.insertContent({ type: this.name, attrs: { note } }) };
  },
  addNodeView() {
    return ReactNodeViewRenderer(FootnoteView);
  },
});

/* ---------- Call-to-action button ---------- */

const CtaView = ({ node, updateAttributes, deleteNode, selected }) => (
  <NodeViewWrapper className={`cta ${selected ? 'is-selected' : ''}`} data-drag-handle>
    <button
      type="button"
      className="cta-button"
      onClick={() => emit('cta', { label: node.attrs.label, href: node.attrs.href, set: updateAttributes, remove: deleteNode })}
    >
      {node.attrs.label || 'Button'}
    </button>
  </NodeViewWrapper>
);

export const CtaButton = Node.create({
  name: 'ctaButton',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { href: { default: '' }, label: { default: 'Read more' } };
  },
  parseHTML() {
    return [
      {
        tag: 'p[data-type="cta"]',
        priority: 1000,
        getAttrs: (el) => ({ href: el.querySelector('a')?.getAttribute('href') || '', label: el.textContent.trim() }),
      },
    ];
  },
  renderHTML({ node }) {
    return ['p', { 'data-type': 'cta', class: 'cta' }, ['a', { href: node.attrs.href, class: 'cta-button' }, node.attrs.label]];
  },
  addCommands() {
    return { setCtaButton: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs }) };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CtaView);
  },
});

/* ---------- Drop cap: a class on a paragraph ---------- */

export const DropCap = Extension.create({
  name: 'dropCap',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          dropcap: {
            default: false,
            parseHTML: (el) => el.classList.contains('has-dropcap'),
            renderHTML: (attrs) => (attrs.dropcap ? { class: 'has-dropcap' } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      toggleDropCap: () => ({ editor, commands }) =>
        commands.updateAttributes('paragraph', { dropcap: !editor.getAttributes('paragraph').dropcap }),
    };
  },
});

/* ---------- Code block with a language picker ---------- */

const CodeBlockView = ({ node, updateAttributes }) => (
  <NodeViewWrapper className="code-block">
    <div className="code-bar" contentEditable={false}>
      <select value={node.attrs.language || 'plaintext'} onChange={(e) => updateAttributes({ language: e.target.value })} aria-label="Code language">
        {LANGUAGES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
    <pre>
      <NodeViewContent as="code" className={`language-${node.attrs.language || 'plaintext'}`} />
    </pre>
  </NodeViewWrapper>
);

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
});
