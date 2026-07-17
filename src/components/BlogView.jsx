import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft } from 'lucide-react';

export default function BlogView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('portfolio_blogs');
    if (saved) {
      const posts = JSON.parse(saved);
      const found = posts.find(p => p.id === id);
      if (found) setPost(found);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-text-primary">Post not found</h1>
        <Link to="/" className="text-lavender hover:underline flex items-center gap-2"><ArrowLeft size={18} /> Return home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-lavender mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Portfolio
      </Link>
      
      <article className="prose prose-invert prose-lg max-w-none prose-pre:bg-[#1E1E1E] prose-pre:border prose-pre:border-border">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">{post.title}</h1>
        <div className="text-sm text-text-muted mb-12 font-mono">
          Published on {new Date(parseInt(post.id)).toLocaleDateString()}
        </div>
        
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-bg-secondary px-1.5 py-0.5 rounded text-lavender font-mono text-sm" {...props}>
                  {children}
                </code>
              )
            },
            img: ({node, ...props}) => <img className="rounded-xl border border-border shadow-lg" {...props} />,
            a: ({node, ...props}) => <a className="text-lavender hover:text-pink transition-colors no-underline border-b border-lavender/30 hover:border-pink" target="_blank" rel="noopener noreferrer" {...props} />
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
