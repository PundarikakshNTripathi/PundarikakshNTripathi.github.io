import { AuthClient } from '@supabase/auth-js';
import { PostgrestClient } from '@supabase/postgrest-js';
import { StorageClient } from '@supabase/storage-js';
import { SUPABASE_KEY, SUPABASE_URL } from '../lib/supabase';
import { slugify } from '../lib/posts';

// The writer's connection to Supabase. Loaded only on /write, never by readers.
//
// Security notes:
// - The session lives in sessionStorage, so it ends when the tab closes and no long-lived token sits in
//   localStorage on the shared github.io origin.
// - Writes need a user listed in blog_admins who has passed TOTP two-factor (aal2); the database
//   enforces that (supabase/schema.sql), this file only drives the flow.

export const auth = new AuthClient({
  url: `${SUPABASE_URL}/auth/v1`,
  headers: { apikey: SUPABASE_KEY },
  storageKey: 'pnt-writer-auth',
  storage: window.sessionStorage,
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false,
});

const token = async () => {
  const { data } = await auth.getSession();
  if (!data.session) throw new Error('Your session ended. Sign in again.');
  return data.session.access_token;
};

const db = async () =>
  new PostgrestClient(`${SUPABASE_URL}/rest/v1`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${await token()}` },
  });

const storage = async () =>
  new StorageClient(`${SUPABASE_URL}/storage/v1`, { apikey: SUPABASE_KEY, Authorization: `Bearer ${await token()}` });

const fail = (error, fallback) => {
  if (!error) return;
  // Row-level security rejections come back as 401/403 or "permission denied".
  if (error.code === '42501' || /permission|row-level|JWT/i.test(error.message || '')) {
    throw new Error("The database refused this change. Make sure you're signed in with two-factor and listed in blog_admins.");
  }
  if (error.code === '23505') throw new Error('Another post already uses that URL. Change the slug in Settings.');
  throw new Error(error.message || fallback);
};

/* ---------- Sign-in and two-factor ---------- */

// Where the current session stands: 'signed-out', 'enroll' (no TOTP factor yet), 'verify' (needs a code) or 'ready'.
export async function authState() {
  const { data } = await auth.getSession();
  if (!data.session) return { step: 'signed-out' };
  const { data: aal } = await auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === 'aal2') return { step: 'ready', email: data.session.user.email };
  const { data: factors } = await auth.mfa.listFactors();
  const totp = factors?.totp?.find((f) => f.status === 'verified');
  return totp ? { step: 'verify', factorId: totp.id } : { step: 'enroll' };
}

export async function signIn(email, password) {
  const { error } = await auth.signInWithPassword({ email, password });
  if (error) throw new Error(/invalid/i.test(error.message) ? 'That email and password don’t match.' : error.message);
}

export async function startEnrollment() {
  // Clear half-finished enrollments so a reload doesn't pile up unverified factors.
  const { data: factors } = await auth.mfa.listFactors();
  for (const f of factors?.all || []) if (f.status !== 'verified') await auth.mfa.unenroll({ factorId: f.id });
  const { data, error } = await auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Portfolio writer' });
  if (error) throw new Error(error.message);
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

export async function verifyCode(factorId, code) {
  const { error } = await auth.mfa.challengeAndVerify({ factorId, code: code.replace(/\s/g, '') });
  if (error) throw new Error(/invalid|expired/i.test(error.message) ? 'That code didn’t work. Codes change every 30 seconds; try the current one.' : error.message);
}

export const signOut = () => auth.signOut();

/* ---------- Posts ---------- */

const DRAFT_FIELDS = ['title', 'subtitle', 'description', 'tags', 'cover', 'html', 'pinned', 'date'];
const pick = (post) => Object.fromEntries(DRAFT_FIELDS.map((k) => [k, post[k] ?? null]));

// Turn a row into the editor's draft shape. `published` tells the UI whether there's a live version.
const toDraft = (row) => ({
  ...row.draft,
  tags: row.draft?.tags || [],
  html: row.draft?.html || '',
  title: row.draft?.title || '',
  subtitle: row.draft?.subtitle || '',
  description: row.draft?.description || '',
  id: row.id,
  slug: row.slug,
  updated: row.updated_at,
  isPublished: !!row.published,
  publishedAt: row.published_at,
  hasUnpublishedChanges: !!row.published && JSON.stringify(row.published) !== JSON.stringify(row.draft),
});

export async function listPosts() {
  const { data, error } = await (await db()).from('posts').select('id,slug,draft,published,published_at,updated_at').order('updated_at', { ascending: false });
  fail(error, 'Could not load posts.');
  return data.map(toDraft);
}

export async function getPost(id) {
  const { data, error } = await (await db()).from('posts').select('id,slug,draft,published,published_at,updated_at').eq('id', id).maybeSingle();
  fail(error, 'Could not load the post.');
  return data ? toDraft(data) : null;
}

export async function createPost() {
  const slug = `draft-${Date.now().toString(36)}`;
  const draft = { title: '', subtitle: '', description: '', tags: [], cover: null, html: '', pinned: false, date: new Date().toISOString() };
  const { data, error } = await (await db()).from('posts').insert({ slug, draft }).select('id,slug,draft,published,published_at,updated_at').single();
  fail(error, 'Could not create a post.');
  return toDraft(data);
}

// Autosave: only the draft changes. The live version stays as it was until you publish.
export async function saveDraft(post) {
  const slug = slugify(post.slug || post.title) || undefined;
  const patch = { draft: pick(post), ...(slug ? { slug } : {}) };
  const { error } = await (await db()).from('posts').update(patch).eq('id', post.id);
  fail(error, 'Could not save.');
}

export async function publishPost(post) {
  const slug = slugify(post.slug || post.title);
  if (!slug) throw new Error('Give the post a title or a URL before publishing.');
  const live = pick(post);
  const current = await getPost(post.id);
  const { error } = await (await db())
    .from('posts')
    .update({ slug, draft: live, published: live, published_at: current?.publishedAt || new Date().toISOString() })
    .eq('id', post.id);
  fail(error, 'Could not publish.');
  return slug;
}

export async function unpublishPost(id) {
  const { error } = await (await db()).from('posts').update({ published: null, published_at: null }).eq('id', id);
  fail(error, 'Could not unpublish.');
}

export async function deletePost(id) {
  const { error } = await (await db()).from('posts').delete().eq('id', id);
  fail(error, 'Could not delete.');
}

/* ---------- Media ---------- */

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/avif': 'avif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov', 'video/ogg': 'ogv' };

// Files are named by content hash, so re-uploading the same image reuses it.
export async function uploadMedia(blob) {
  const ext = EXT[blob.type];
  if (!ext) throw new Error('Only PNG, JPEG, GIF, WebP, AVIF and MP4/WebM/MOV/Ogg video can be uploaded.');
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  const hash = [...new Uint8Array(digest)].slice(0, 10).map((b) => b.toString(16).padStart(2, '0')).join('');
  const now = new Date();
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${hash}.${ext}`;
  const bucket = (await storage()).from('blog-media');
  const { error } = await bucket.upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: true });
  if (error && !/exists/i.test(error.message)) fail(error, 'Upload failed.');
  return bucket.getPublicUrl(path).data.publicUrl;
}
