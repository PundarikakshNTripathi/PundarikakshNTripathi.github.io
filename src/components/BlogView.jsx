import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import katex from "katex";
import "katex/dist/katex.min.css";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { ArrowLeft } from 'lucide-react';

window.katex = katex;
window.hljs = hljs;

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
      
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">{post.title}</h1>
        <div className="text-sm text-text-muted mb-12 font-mono">
          Published on {new Date(parseInt(post.id)).toLocaleDateString()}
        </div>
        
        {/* Render Quill HTML safely */}
        <div 
          className="ql-editor p-0"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
