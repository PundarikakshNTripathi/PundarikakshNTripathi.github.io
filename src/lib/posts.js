import published from '../data/posts.json';

// Published posts ship with the site (src/data/posts.json). Drafts written in /admin live in this
// browser's localStorage only, so they're visible on the device that wrote them and nowhere else.
// To publish, export from /admin and commit the file as src/data/posts.json.
const DRAFTS_KEY = 'portfolio_blogs';

export function readDrafts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeDrafts(posts) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(posts));
}

// Old posts stored a single markdown/HTML string; newer ones store blocks.
export function normalise(post) {
  if (post.blocks) return post;
  return { ...post, blocks: [{ id: 'legacy', type: 'text', content: post.content || '' }] };
}

export function allPosts() {
  const byId = new Map(published.map((p) => [String(p.id), { ...normalise(p), draft: false }]));
  readDrafts().forEach((p) => {
    if (!byId.has(String(p.id))) byId.set(String(p.id), { ...normalise(p), draft: true });
  });
  return [...byId.values()].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return Number(b.id) - Number(a.id);
  });
}

export function findPost(id) {
  return allPosts().find((p) => String(p.id) === String(id)) || null;
}

// Plain-text excerpt. DOMParser documents are inert: no scripts run and no resources load.
export function excerpt(post, length = 180) {
  const html = post.blocks
    .filter((b) => b.type === 'text')
    .map((b) => b.content)
    .join(' ');
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > length ? `${clean.slice(0, length).replace(/\s\S*$/, '')}…` : clean;
}

export const postDate = (post) =>
  new Date(Number(post.id)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
