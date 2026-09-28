import published from '../data/posts.json';

// Published posts ship with the site in src/data/posts.json. Drafts live in the author's browser
// (see lib/drafts.js) and only reach this file when they're published from /write.
//
// Post shape:
//   { id, slug, title, subtitle, description, tags[], date (ISO), updated, pinned,
//     cover: { src, alt, caption } | null, html }

const escapeHtml = (s = '') => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Posts from the old block editor stored `blocks`; convert them to HTML once.
function blocksToHtml(blocks = []) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'header': {
          const tag = ['h2', 'h3', 'h4'].includes(b.level) ? b.level : 'h2';
          return `<${tag}>${escapeHtml(b.content)}</${tag}>`;
        }
        case 'text':
          return b.content || '';
        case 'image':
          return `<figure data-type="figure" data-width="normal"><img src="${escapeHtml(b.url)}" alt="${escapeHtml(b.alt || '')}"><figcaption>${escapeHtml(b.caption || '')}</figcaption></figure>`;
        case 'list': {
          const tag = b.listType === 'ol' ? 'ol' : 'ul';
          return `<${tag}>${(b.items || []).map((i) => `<li><p>${i}</p></li>`).join('')}</${tag}>`;
        }
        case 'quote':
          return `<blockquote><p>${escapeHtml(b.content)}</p></blockquote>`;
        case 'code':
          return `<pre><code class="language-${escapeHtml(b.language || 'plaintext')}">${escapeHtml(b.content)}</code></pre>`;
        case 'divider':
          return '<hr>';
        default:
          return '';
      }
    })
    .join('');
}

export function normalisePost(post) {
  const p = { ...post };
  if (!p.html && p.blocks) p.html = blocksToHtml(p.blocks);
  if (!p.html && typeof p.content === 'string') p.html = p.content;
  if (!p.date) p.date = new Date(Number(p.id) || Date.now()).toISOString();
  if (!p.slug) p.slug = slugify(p.title) || String(p.id);
  delete p.blocks;
  delete p.content;
  return p;
}

export const sortPosts = (posts) =>
  [...posts].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date) - new Date(a.date);
  });

// The snapshot bundled at build time (src/data/posts.json). With Supabase configured, the build refreshes
// it from the database, and the live pages then update from the database directly (lib/usePosts.js).
export function publishedPosts() {
  return sortPosts(published.map(normalisePost));
}

export function findPublished(slugOrId) {
  return publishedPosts().find((p) => p.slug === slugOrId || String(p.id) === String(slugOrId)) || null;
}

export function slugify(title = '') {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Plain text from post HTML. DOMParser documents are inert: no scripts run and no resources load.
export function textOf(html = '') {
  const spaced = html.replace(/<\/(p|li|h\d|blockquote|div|figcaption|pre)>/gi, ' $&');
  return (new DOMParser().parseFromString(spaced, 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim();
}

export function wordCount(html) {
  const text = textOf(html);
  return text ? text.split(' ').length : 0;
}

export const readingMinutes = (html) => Math.max(1, Math.round(wordCount(html) / 230));

export function excerpt(post, length = 180) {
  if (post.description) return post.description;
  const text = textOf(post.html);
  return text.length > length ? `${text.slice(0, length).replace(/\s\S*$/, '')}…` : text;
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
