import { cloudEnabled } from '../lib/supabase';
import * as local from '../lib/drafts';
import { findPublished } from '../lib/posts';
import { assertVideo, dataUrlToBlob, imageToDataUrl, videoToDataUrl } from './media';

// One interface for where posts live. With Supabase configured (the live site), drafts, published posts
// and media are in the database and Storage. Without it (local dev), drafts stay in IndexedDB and
// publishing writes into the repository folder, as before.
export const mode = cloudEnabled ? 'cloud' : 'local';

const cloud = () => import('./cloud');

export async function loadPost(id) {
  if (mode === 'cloud') {
    const c = await cloud();
    return id === 'new' ? c.createPost() : c.getPost(id);
  }
  if (id === 'new') {
    const d = local.newDraft();
    await local.saveDraft(d);
    return d;
  }
  let d = await local.getDraft(id);
  if (!d) {
    // Editing a published post: start a draft from it, with the same id so publishing replaces it.
    const p = findPublished(id);
    if (p) {
      d = { ...local.newDraft(), ...p, id: String(p.id) };
      await local.saveDraft(d);
    }
  }
  return d || null;
}

export async function savePost(post) {
  if (mode === 'cloud') return (await cloud()).saveDraft(post);
  return local.saveDraft(post);
}

// Image files are resized first (see media.js); in cloud mode the result is uploaded and the editor
// gets a Storage URL instead of an inline data URL.
export async function imageSrc(file) {
  const dataUrl = await imageToDataUrl(file);
  if (mode !== 'cloud') return dataUrl;
  return (await cloud()).uploadMedia(dataUrlToBlob(dataUrl));
}

export async function videoSrc(file) {
  if (mode !== 'cloud') return videoToDataUrl(file);
  assertVideo(file);
  return (await cloud()).uploadMedia(file);
}
