import { getSetting, setSetting } from '../lib/drafts';
import { extractMedia } from './media';
import published from '../data/posts.json';
import { slugify } from '../lib/posts';

// Publishing is a local operation: the writer runs on the author's machine, and "publish" means
// writing the post and its media into the repository folder. Commit and push to make it live.
// Chrome and Edge support writing to a folder; other browsers get a download instead.

export const canWriteToFolder = () => typeof window.showDirectoryPicker === 'function';

const toPublic = (draft) => {
  const post = { ...draft };
  post.slug = slugify(post.slug || post.title) || String(post.id);
  post.updated = new Date().toISOString();
  return post;
};

// Only the two folders publishing writes to are remembered: src/data and public/blog/media.
// The repository root handle is used once, to find them, and never stored.
async function writable(handle) {
  if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') return true;
  return (await handle.requestPermission({ mode: 'readwrite' })) === 'granted';
}

async function repoFolder() {
  const saved = await getSetting('publishDirs');
  if (saved?.data && saved?.media && (await writable(saved.data)) && (await writable(saved.media))) return saved;
  const root = await window.showDirectoryPicker({ id: 'portfolio-repo', mode: 'readwrite' });
  let data;
  try {
    data = await (await root.getDirectoryHandle('src')).getDirectoryHandle('data');
    await data.getFileHandle('posts.json');
    await root.getFileHandle('package.json');
  } catch {
    throw new Error('That folder is not the portfolio repository. Pick the folder that contains package.json and src/data/posts.json.');
  }
  const media = await (await (await root.getDirectoryHandle('public')).getDirectoryHandle('blog', { create: true })).getDirectoryHandle('media', { create: true });
  const dirs = { data, media, name: root.name };
  await setSetting('publishDirs', dirs);
  return dirs;
}

async function readPosts(data) {
  const file = await (await data.getFileHandle('posts.json')).getFile();
  const posts = JSON.parse((await file.text()) || '[]');
  return Array.isArray(posts) ? posts : [];
}

async function writeJson(data, posts) {
  const out = await (await data.getFileHandle('posts.json')).createWritable();
  await out.write(`${JSON.stringify(posts, null, 2)}\n`);
  await out.close();
}

export async function publishToFolder(draft) {
  const { data, media, name } = await repoFolder();
  const { post, files } = await extractMedia(toPublic(draft));
  if (files.size) {
    for (const [path, blob] of files) {
      const w = await (await media.getFileHandle(path.split('/').pop(), { create: true })).createWritable();
      await w.write(blob);
      await w.close();
    }
  }
  const posts = (await readPosts(data)).filter((p) => String(p.id) !== String(post.id));
  posts.push(post);
  await writeJson(data, posts);
  return { post, mediaCount: files.size, folder: name };
}

export async function unpublishFromFolder(id) {
  const { data } = await repoFolder();
  const posts = (await readPosts(data)).filter((p) => String(p.id) !== String(id));
  await writeJson(data, posts);
}

// Fallback: a posts.json with this post merged in and its media kept inline.
export function downloadPostsJson(draft) {
  const post = toPublic(draft);
  const posts = published.filter((p) => String(p.id) !== String(post.id)).concat(post);
  const url = URL.createObjectURL(new Blob([`${JSON.stringify(posts, null, 2)}\n`], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
