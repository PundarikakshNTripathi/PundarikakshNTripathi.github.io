import { useEffect, useState } from 'react';
import { findPublished, normalisePost, publishedPosts, sortPosts } from './posts';
import { cloudEnabled, fetchPublishedPost, fetchPublishedPosts } from './supabase';

// Show the build-time snapshot immediately, then swap in the live list from Supabase, so a post
// published a minute ago appears without waiting for the site to rebuild.
export function usePublishedPosts() {
  const [posts, setPosts] = useState(publishedPosts);
  useEffect(() => {
    if (!cloudEnabled) return undefined;
    let alive = true;
    fetchPublishedPosts()
      .then((live) => alive && live && setPosts(sortPosts(live.map(normalisePost))))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return posts;
}

// One post by slug: snapshot first, database second. `undefined` while still looking, `null` if not found.
export function usePublishedPost(slug) {
  const snapshot = findPublished(slug);
  const [state, setState] = useState({ slug, post: snapshot || (cloudEnabled ? undefined : null) });
  useEffect(() => {
    if (!cloudEnabled) return undefined;
    let alive = true;
    fetchPublishedPost(slug)
      // The database is the authority: if it says the post isn't published, it isn't, even if the
      // build-time snapshot still has it. The snapshot is only a fallback for network failures.
      .then((live) => alive && setState({ slug, post: live ? normalisePost(live) : null }))
      .catch(() => alive && setState({ slug, post: snapshot || null }));
    return () => {
      alive = false;
    };
    // snapshot is derived from slug
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return state.slug === slug ? state.post : snapshot || undefined;
}
