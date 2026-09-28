import { Link } from 'react-router-dom';
import { excerpt, formatDate, publishedPosts, readingMinutes } from '../lib/posts';
import Section from './Section';

const Writing = () => {
  const posts = publishedPosts();
  return (
    <Section id="writing" title="Writing">
      {posts.length === 0 ? (
        <div className="max-w-[40rem]">
          <p className="prose-serif">
            Long-form notes on what I'm building and reading: kernels, low-bit inference, causal inference, and
            what goes on inside trained networks. I keep notes while I build, and the ones that hold up will end up
            here as proper write-ups.
          </p>
          <p className="meta mt-4">
            No posts yet. <a href="/feed.xml" className="link">Subscribe with RSS</a> to get them when they land.
          </p>
        </div>
      ) : (
        <ul className="max-w-[40rem] border-t border-border">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-border">
              <Link to={`/blog/${post.slug}`} className="group block py-6">
                <span className="meta block">
                  {formatDate(post.date)}. {readingMinutes(post.html)} min read
                  {post.tags?.length ? `. ${post.tags.join(', ')}` : ''}
                </span>
                <span className="mt-1.5 block font-serif text-[1.5rem] leading-snug text-text-primary group-hover:text-accent">
                  {post.title || 'Untitled'}
                </span>
                {post.subtitle && (
                  <span className="mt-1 block font-serif text-[1.0625rem] italic text-text-secondary">{post.subtitle}</span>
                )}
                <span className="mt-2 block text-[0.9375rem] leading-relaxed text-text-secondary">{excerpt(post)}</span>
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <a href="/feed.xml" className="link meta">Subscribe with RSS</a>
          </li>
        </ul>
      )}
    </Section>
  );
};

export default Writing;
