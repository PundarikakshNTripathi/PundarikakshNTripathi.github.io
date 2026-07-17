import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import StructuredEditor from './StructuredEditor';

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

  const handleNewPost = () => {
    setCurrentPost({ 
      title: '', 
      pinned: false,
      blocks: [{ id: Date.now().toString(), type: 'text', content: '' }]
    });
  };

  const savePost = () => {
    let updated;
    const postToSave = { ...currentPost };
    // Always store as structured blocks now
    if (postToSave.id) {
      updated = posts.map(p => p.id === postToSave.id ? postToSave : p);
    } else {
      postToSave.id = Date.now().toString();
      updated = [...posts, postToSave];
    }
    setPosts(updated);
    localStorage.setItem('portfolio_blogs', JSON.stringify(updated));
    alert('Saved successfully!');
  };

  const openPost = (post) => {
    // Legacy support: convert old string content to blocks
    if (post.content && typeof post.content === 'string' && !post.blocks) {
      post.blocks = [{ id: Date.now().toString(), type: 'text', content: post.content }];
      delete post.content;
    }
    if (!post.blocks) post.blocks = [];
    setCurrentPost(post);
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
          <button onClick={handleNewPost} className="flex items-center gap-2 px-4 py-2 rounded border border-border hover:border-lavender transition-colors">
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
            <div key={post.id} onClick={() => openPost({...post})} className="glass-card p-4 cursor-pointer hover:border-lavender border border-transparent transition-colors">
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
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <StructuredEditor 
              blocks={currentPost.blocks} 
              setBlocks={blocks => setCurrentPost({ ...currentPost, blocks })} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
