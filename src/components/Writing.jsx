import { Link } from 'react-router-dom';
import { allPosts, excerpt, postDate } from '../lib/posts';
import Section from './Section';

const Writing = () => {
  const posts = allPosts();
  return (
    <Section id="writing" title="Writing">
      {posts.length === 0 ? (
        <p className="prose-serif max-w-[40rem]">
          Nothing published yet. I keep notes while I build, and the ones that hold up will end up here as
          proper write-ups.
        </p>
      ) : (
        <ul className="max-w-[40rem] border-t border-border">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-border">
              <Link to={`/blog/${post.id}`} className="group grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <span className="meta pt-1">
                  {postDate(post)}
                  {post.draft && <span className="block text-dot">Draft, only on this device</span>}
                </span>
                <span>
                  <span className="block font-serif text-[1.3125rem] leading-snug text-text-primary group-hover:text-accent">
                    {post.title || 'Untitled'}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-text-secondary">{excerpt(post)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default Writing;
