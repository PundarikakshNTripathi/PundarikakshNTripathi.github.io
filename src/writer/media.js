// Turning files into something a draft can hold. While drafting, media lives inline as data URLs
// (in IndexedDB); publishing writes each one out as a real file under public/blog/media.

export const LIMITS = { image: 12 * 1024 * 1024, video: 60 * 1024 * 1024 };
const MAX_WIDTH = 2000;

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

// Large photos are scaled to 2000px wide and re-encoded; GIFs and SVGs are kept as-is
// so animation and vectors survive.
export async function imageToDataUrl(file) {
  if (file.size > LIMITS.image) throw new Error(`That image is ${(file.size / 1048576).toFixed(1)} MB. The limit is 12 MB.`);
  if (/gif|svg/.test(file.type)) return readAsDataUrl(file);
  const bitmap = await createImageBitmap(file);
  if (bitmap.width <= MAX_WIDTH && file.size < 1.5 * 1048576) return readAsDataUrl(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/webp', 0.86);
}

export async function videoToDataUrl(file) {
  if (file.size > LIMITS.video) throw new Error(`That video is ${(file.size / 1048576).toFixed(1)} MB. The limit is 60 MB; for longer videos, upload to YouTube or Vimeo and embed the link.`);
  return readAsDataUrl(file);
}

export const pickFile = (accept) =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] || null);
    input.click();
  });

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov', 'video/ogg': 'ogv' };

// Decoded by hand rather than with fetch(), so the site's CSP never has to allow data: connections.
function dataUrlToBlob(dataUrl) {
  const [head, body] = dataUrl.split(',', 2);
  const type = (head.match(/^data:([^;,]+)/) || [])[1] || 'application/octet-stream';
  const bytes = head.includes(';base64') ? Uint8Array.from(atob(body), (c) => c.charCodeAt(0)) : new TextEncoder().encode(decodeURIComponent(body));
  return new Blob([bytes], { type });
}

async function dataUrlToFile(dataUrl) {
  const blob = dataUrlToBlob(dataUrl);
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  const hash = [...new Uint8Array(digest)].slice(0, 6).map((b) => b.toString(16).padStart(2, '0')).join('');
  return { blob, name: `${hash}.${EXT[blob.type] || 'bin'}` };
}

// Pulls every inline data URL out of a post. Returns the post with /blog/media/... paths and the files to write.
export async function extractMedia(post) {
  const files = new Map();
  const swap = async (url) => {
    if (!url?.startsWith('data:')) return url;
    const { blob, name } = await dataUrlToFile(url);
    const path = `/blog/media/${post.slug}-${name}`;
    files.set(path, blob);
    return path;
  };
  const doc = new DOMParser().parseFromString(post.html || '', 'text/html');
  for (const el of doc.querySelectorAll('img[src^="data:"], video[src^="data:"]')) el.setAttribute('src', await swap(el.getAttribute('src')));
  const cover = post.cover?.src ? { ...post.cover, src: await swap(post.cover.src) } : post.cover;
  return { post: { ...post, html: doc.body.innerHTML, cover }, files };
}
