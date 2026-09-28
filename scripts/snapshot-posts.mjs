// Before a build, copy the published posts from Supabase into src/data/posts.json. The site renders
// from that snapshot first (and the RSS feed is built from it), then refreshes from the database live.
// Uses only the public view, so it needs nothing beyond the public anon/publishable key.
// Without Supabase settings, or if the request fails, the existing snapshot is kept.
import { writeFileSync } from 'node:fs'

const url = (process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
const key = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !key) {
  console.log('snapshot-posts: Supabase not configured, keeping src/data/posts.json as is.')
  process.exit(0)
}

try {
  const res = await fetch(`${url}/rest/v1/public_posts?select=id,slug,published,published_at&order=published_at.desc`, {
    headers: { apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}) },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const rows = await res.json()
  const posts = rows.map((r) => ({ ...(r.published || {}), id: r.id, slug: r.slug, date: r.published?.date || r.published_at }))
  writeFileSync('src/data/posts.json', `${JSON.stringify(posts, null, 2)}\n`)
  console.log(`snapshot-posts: wrote ${posts.length} published post(s).`)
} catch (err) {
  console.warn(`snapshot-posts: could not reach Supabase (${err.message}); keeping the existing snapshot.`)
}
