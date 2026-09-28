import { getSetting, setSetting } from '../lib/drafts';
import { extractMedia } from './media';
import published from '../data/posts.json';

// Publishing is a local operation: the writer runs on the author's machine, and "publish" means
// writing the post and its media into the repository folder. Commit and push to make it live.
// Chrome and Edge support writing to a folder; other browsers get a download instead.

export const canWriteToFolder = () => typeof window.showDirectoryPicker === 'function';

const toPublic = (draft) => {
  const post = { ...draft };
  delete post.updated;
  post.updated = new Date().toISOString();
  return post;
};

async function repoFolder() {
  let dir = await getSetting('repoDir');
  if (dir && (await dir.queryPermission({ mode: 'readwrite' })) !== 'granted') {
    if ((await dir.requestPermission({ mode: 'readwrite' })) !== 'granted') dir = null;
  }
  if (!dir) {
    dir = await window.showDirectoryPicker({ id: 'portfolio-repo', mode: 'readwrite' });
    await setSetting('repoDir', dir);
  }
  // Make sure this really is the site repo before writing anything.
  try {
    const data = await (await dir.getDirectoryHandle('src')).getDirectoryHandle('data');
    await data.getFileHandle('posts.json');
    return { dir, data };
  } catch {
    await setSetting('repoDir', null);
    throw new Error('That folder is not the portfolio repository. Pick the folder that contains package.json and src/data/posts.json.');
  }
}

async function readPosts(data) {
  const file = await (await data.getFileHandle('posts.json')).getFile();
  const posts = JSON.parse((await file.text()) || '[]');
  return Array.isArray(posts) ? posts : [];
}

async function writeJson(data, posts) {
  const writable = await (await data.getFileHandle('posts.json')).createWritable();
  await writable.write(`${JSON.stringify(posts, null, 2)}\n`);
  await writable.close();
}

export async function publishToFolder(draft) {
  const { dir, data } = await repoFolder();
  const { post, files } = await extractMedia(toPublic(draft));
  if (files.size) {
    const media = await (await (await dir.getDirectoryHandle('public')).getDirectoryHandle('blog', { create: true })).getDirectoryHandle('media', { create: true });
    for (const [path, blob] of files) {
      const w = await (await media.getFileHandle(path.split('/').pop(), { create: true })).createWritable();
      await w.write(blob);
      await w.close();
    }
  }
  const posts = (await readPosts(data)).filter((p) => String(p.id) !== String(post.id));
  posts.push(post);
  await writeJson(data, posts);
  return { post, mediaCount: files.size, folder: dir.name };
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
