import { useState, useEffect, useMemo, useRef } from 'react';
import JoditEditor from 'jodit-react';
import katex from "katex";
import "katex/dist/katex.min.css";
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';

window.katex = katex;

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const editor = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_blogs');
    if (saved) setPosts(JSON.parse(saved));
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Write your blog post here...',
    theme: 'dark',
    minHeight: 500,
    style: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
    },
  }), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (hashHex === import.meta.env.VITE_ADMIN_HASH) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid password');
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
    <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto flex flex-col h-screen pb-6">
      <div className="flex items-center justify-between mb-6 shrink-0">
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
        <div className="grid gap-4 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Manage Posts</h2>
          {posts.map(post => (
            <div key={post.id} onClick={() => setCurrentPost(post)} className="glass-card p-4 cursor-pointer hover:border-lavender border border-transparent transition-colors">
              <h3 className="font-bold text-text-primary">{post.title || 'Untitled'}</h3>
              <span className="text-sm text-text-muted">{new Date(parseInt(post.id)).toLocaleDateString()} {post.pinned && '• Pinned'}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <input 
            type="text" 
            value={currentPost.title}
            onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
            placeholder="Post Title..."
            className="text-4xl font-bold bg-transparent border-b border-border p-2 outline-none text-text-primary shrink-0"
          />
          <label className="flex items-center gap-2 text-sm text-text-secondary shrink-0">
            <input type="checkbox" checked={currentPost.pinned || false} onChange={e => setCurrentPost({...currentPost, pinned: e.target.checked})} className="accent-lavender" />
            Pin this post
          </label>
          <div className="flex-1 overflow-y-auto bg-bg-secondary/50 rounded-lg text-text-primary">
            <JoditEditor
              ref={editor}
              value={currentPost.content || ''}
              config={config}
              onBlur={newContent => setCurrentPost({...currentPost, content: newContent})}
            />
          </div>
        </div>
      )}
    </div>
  );
}
