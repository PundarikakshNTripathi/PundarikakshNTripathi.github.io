import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_blogs');
    if (saved) setPosts(JSON.parse(saved));
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple mock auth for client-side
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    }
  };

  const savePost = () => {
    let updated;
    if (currentPost.id) {
      updated = posts.map(p => p.id === currentPost.id ? currentPost : p);
    } else {
      currentPost.id = Date.now().toString();
      updated = [...posts, currentPost];
    }
    setPosts(updated);
    localStorage.setItem('portfolio_blogs', JSON.stringify(updated));
    alert('Saved successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <form onSubmit={handleLogin} className="glass-card p-8 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Admin Login</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 rounded bg-bg-secondary text-text-primary" placeholder="Password..." />
          <button type="submit" className="px-4 py-2 bg-lavender text-bg-primary rounded font-bold hover:bg-lavender/90">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto flex flex-col h-screen pb-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-2 text-text-secondary hover:text-lavender transition-colors">
          <ArrowLeft size={20} /> Back to Site
        </Link>
        <div className="flex gap-4">
          <button onClick={() => setCurrentPost({ title: '', content: '', pinned: false })} className="flex items-center gap-2 px-4 py-2 rounded border border-border hover:border-lavender transition-colors">
            <Plus size={18} /> New Post
          </button>
          {currentPost && (
            <button onClick={savePost} className="flex items-center gap-2 px-4 py-2 bg-lavender text-bg-primary rounded font-bold hover:bg-lavender/90 transition-colors">
              <Save size={18} /> Save
            </button>
          )}
        </div>
      </div>

      {!currentPost ? (
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Manage Posts</h2>
          {posts.map(post => (
            <div key={post.id} onClick={() => setCurrentPost(post)} className="glass-card p-4 cursor-pointer hover:border-lavender border border-transparent transition-colors">
              <h3 className="font-bold text-text-primary">{post.title || 'Untitled'}</h3>
              <span className="text-sm text-text-muted">{new Date(parseInt(post.id)).toLocaleDateString()} {post.pinned && '• Pinned'}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 grid md:grid-cols-2 gap-6 overflow-hidden">
          <div className="flex flex-col gap-4 overflow-y-auto">
            <input 
              type="text" 
              value={currentPost.title}
              onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
              placeholder="Post Title..."
              className="text-2xl font-bold bg-transparent border-b border-border p-2 outline-none text-text-primary"
            />
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={currentPost.pinned || false} onChange={e => setCurrentPost({...currentPost, pinned: e.target.checked})} className="accent-lavender" />
              Pin this post
            </label>
            <textarea 
              value={currentPost.content}
              onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
              placeholder="Write in Markdown... Supports LaTeX equations: $E=mc^2$ or $$E=mc^2$$, Code Snippets, and image embedding ![](url)"
              className="flex-1 bg-bg-secondary/50 p-4 rounded-lg resize-none outline-none font-mono text-sm text-text-secondary"
            />
          </div>
          <div className="glass-card p-6 overflow-y-auto prose prose-invert max-w-none prose-pre:bg-[#1E1E1E] prose-pre:border prose-pre:border-border">
            <h1 className="text-3xl font-bold mb-6 text-text-primary">{currentPost.title}</h1>
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
              {currentPost.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
