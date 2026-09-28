// Supabase connection details come from build-time env (see .env.example). Both values are public by
// design: row-level security in supabase/schema.sql decides what anyone can read or write.
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const cloudEnabled = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(SUPABASE_URL) && SUPABASE_KEY.length > 20;

// Legacy anon keys are JWTs and also go in Authorization; new publishable keys only go in apikey.
export const anonHeaders = () => ({
  apikey: SUPABASE_KEY,
  ...(SUPABASE_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SUPABASE_KEY}` } : {}),
});

// A published row from the public_posts view, shaped like the rest of the site expects.
export const fromRow = (row) => ({
  ...(row.published || {}),
  id: row.id,
  slug: row.slug,
  date: row.published?.date || row.published_at,
});

// Readers never load the Supabase client: two plain GETs against the public view are enough.
export async function fetchPublishedPosts() {
  if (!cloudEnabled) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_posts?select=id,slug,published,published_at&order=published_at.desc`, {
    headers: anonHeaders(),
  });
  if (!res.ok) throw new Error(`Posts request failed (${res.status})`);
  return (await res.json()).map(fromRow);
}

export async function fetchPublishedPost(slug) {
  if (!cloudEnabled || !/^[a-z0-9-]+$/.test(slug)) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_posts?select=id,slug,published,published_at&slug=eq.${slug}&limit=1`, {
    headers: anonHeaders(),
  });
  if (!res.ok) throw new Error(`Post request failed (${res.status})`);
  const [row] = await res.json();
  return row ? fromRow(row) : null;
}
