import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import katex from "katex";
import "katex/dist/katex.min.css";
import { ArrowLeft, Menu, X } from 'lucide-react';

window.katex = katex;

export default function BlogView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('portfolio_blogs');
    if (saved) {
      const posts = JSON.parse(saved);
      const found = posts.find(p => p.id === id);
      if (found) {
        // Legacy support
        if (found.content && typeof found.content === 'string' && !found.blocks) {
          found.blocks = [{ id: 'legacy', type: 'text', content: found.content }];
        }
        setPost(found);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!post?.blocks) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const headers = document.querySelectorAll('.blog-header');
    headers.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-text-primary">Post not found</h1>
        <Link to="/" className="text-lavender hover:underline flex items-center gap-2"><ArrowLeft size={18} /> Return home</Link>
      </div>
    );
  }

  const toc = post.blocks?.filter(b => b.type === 'header') || [];

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-20 flex gap-12 relative">
      <div className="flex-1 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-lavender mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Portfolio
        </Link>
        
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">{post.title}</h1>
          <div className="text-sm text-text-muted mb-12 font-mono border-b border-border pb-8">
            Published on {new Date(parseInt(post.id)).toLocaleDateString()}
          </div>
          
          <div className="flex flex-col gap-6">
            {post.blocks?.map((block) => {
              switch (block.type) {
                case 'header':
                  const Tag = block.level || 'h2';
                  return (
                    <Tag 
                      key={block.id} 
                      id={`heading-${block.id}`}
                      className="blog-header scroll-mt-32 text-text-primary font-bold mt-8 mb-4"
                      style={{ fontSize: Tag === 'h2' ? '2rem' : '1.5rem' }}
                    >
                      {block.content}
                    </Tag>
                  );
                
                case 'text':
                  return (
                    <div 
                      key={block.id}
                      className="text-text-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  );

                case 'image':
                  const alignClass = block.align === 'center' ? 'mx-auto' : block.align === 'right' ? 'ml-auto' : 'mr-auto';
                  return (
                    <figure key={block.id} className={`my-8 flex flex-col ${block.align === 'center' ? 'items-center' : block.align === 'right' ? 'items-end' : 'items-start'}`}>
                      <img 
                        src={block.url} 
                        alt={block.alt || block.caption || 'Blog image'} 
                        className={`rounded-xl border border-border shadow-lg max-h-[600px] w-auto ${alignClass} object-cover`}
                      />
                      {block.caption && (
                        <figcaption className="text-sm text-text-muted mt-3 italic text-center w-full max-w-2xl">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );

                case 'list':
                  const ListTag = block.listType === 'ol' ? 'ol' : 'ul';
                  return (
                    <ListTag key={block.id} className={`${block.listType === 'ol' ? 'list-decimal pl-6' : 'list-none pl-4'} space-y-3 my-6 text-text-secondary`}>
                      {block.items?.map((item, i) => (
                        <li key={i} className="leading-relaxed relative">
                          {block.listType !== 'ol' && <span className="absolute -left-4 text-pink mt-1.5 opacity-80">•</span>}
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ListTag>
                  );

                case 'quote':
                  return (
                    <blockquote key={block.id} className="border-l-4 border-lavender pl-6 my-8 italic text-xl text-text-secondary">
                      "{block.content}"
                      {block.author && <footer className="mt-4 text-sm font-bold text-lavender">— {block.author}</footer>}
                    </blockquote>
                  );

                case 'code':
                  return (
                    <div key={block.id} className="my-8 rounded-xl overflow-hidden border border-border/50">
                      <div className="bg-[#1e1e1e] border-b border-white/10 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-mono text-white/50">{block.language || 'code'}</span>
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        </div>
                      </div>
                      <pre className="p-6 bg-[#0d0d0d] overflow-x-auto text-sm">
                        <code className={`language-${block.language || 'javascript'} text-[#c4a7e7] font-mono leading-relaxed`}>
                          {block.content}
                        </code>
                      </pre>
                    </div>
                  );

                case 'divider':
                  return <hr key={block.id} className="my-12 border-border/50" />;

                default:
                  return null;
              }
            })}
          </div>
        </article>
      </div>

      {/* Sidebar TOC Desktop */}
      {toc.length > 0 && (
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 glass-card p-6 rounded-xl">
            <h3 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm">Table of Contents</h3>
            <ul className="flex flex-col gap-3 text-sm">
              {toc.map(header => (
                <li key={header.id} className={header.level === 'h3' ? 'ml-4' : ''}>
                  <a 
                    href={`#heading-${header.id}`} 
                    className={`transition-colors block py-1 ${activeId === `heading-${header.id}` ? 'text-pink font-bold' : 'text-text-muted hover:text-lavender'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`heading-${header.id}`).scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {header.content}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}

      {/* Mobile TOC Button */}
      {toc.length > 0 && (
        <button 
          onClick={() => setTocOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-bg-card border border-border p-3 rounded-full shadow-lg text-text-primary z-40"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile TOC Overlay */}
      {tocOpen && (
        <div className="fixed inset-0 bg-bg-primary/95 backdrop-blur z-50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-xl text-text-primary">Table of Contents</h3>
            <button onClick={() => setTocOpen(false)} className="text-text-primary p-2">
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col gap-6 overflow-y-auto">
            {toc.map(header => (
              <li key={header.id} className={header.level === 'h3' ? 'ml-4' : ''}>
                <a 
                  href={`#heading-${header.id}`} 
                  className={`text-lg transition-colors block ${activeId === `heading-${header.id}` ? 'text-pink font-bold' : 'text-text-secondary'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTocOpen(false);
                    document.getElementById(`heading-${header.id}`).scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {header.content}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
