import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, Pin } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_blogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Sort: pinned first, then by date descending
      parsed.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return parseInt(b.id) - parseInt(a.id);
      });
      setPosts(parsed);
    }
  }, []);

  return (
    <section id="blog" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="// Articles & Thoughts"
          title="Blog"
          subtitle="Writing about distributed systems, AI infrastructure, and low-level engineering."
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <Link to={`/blog/${post.id}`} className="block group h-full">
                  <div className="glass-card gradient-border p-8 h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_-15px_var(--color-lavender)]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-mono text-xs tracking-widest text-text-muted">
                        {new Date(parseInt(post.id)).toLocaleDateString()}
                      </span>
                      {post.pinned && <Pin size={16} className="text-lavender" />}
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-lavender transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary text-sm flex-1 line-clamp-3">
                      {post.content.replace(/[#*`_\[\]]/g, '').slice(0, 150)}...
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-lavender font-mono text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))
          ) : (
            <ScrollReveal delay={0.1} className="md:col-span-2 lg:col-span-3">
              <div className="glass-card gradient-border p-12 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-sm tracking-widest uppercase text-lavender font-semibold mb-4">
                  Coming Soon
                </span>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Stay Tuned
                </h3>
                <p className="text-base text-text-secondary max-w-md">
                  I am currently working on documenting my research, explorations in systems engineering, and thoughts on AI infrastructure. Articles will be published here soon.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
