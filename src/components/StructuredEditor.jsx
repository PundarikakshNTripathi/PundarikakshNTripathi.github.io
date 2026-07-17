import React, { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Trash2, Image as ImageIcon, Type, List, Hash, Quote, Code, Minus, ArrowUp, ArrowDown } from 'lucide-react';

export default function StructuredEditor({ blocks, setBlocks }) {
  const addBlock = (type) => {
    const newBlock = { id: Date.now().toString(), type, content: '' };
    if (type === 'image') {
      newBlock.url = '';
      newBlock.caption = '';
      newBlock.alt = '';
      newBlock.align = 'center';
    }
    if (type === 'list') {
      newBlock.listType = 'ul';
      newBlock.items = [''];
    }
    if (type === 'header') {
      newBlock.level = 'h2';
      newBlock.align = 'left';
    }
    if (type === 'code') {
      newBlock.language = 'javascript';
    }
    if (type === 'quote') {
      newBlock.author = '';
    }
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setBlocks(newBlocks);
  };

  // Full Jodit config with all Substack/Medium features
  const joditConfig = {
    readonly: false,
    theme: 'dark',
    minHeight: 300,
    toolbarAdaptive: false,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', 'eraser', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'math', 'copyformat', 'fullsize'
    ],
    style: { background: 'rgba(255, 255, 255, 0.03)', color: '#fff' }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      {blocks.map((block, index) => (
        <div key={block.id} className="glass-card p-5 flex flex-col gap-4 relative group border border-border/50 hover:border-lavender transition-all">
          <div className="absolute -left-12 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => moveBlock(index, -1)} disabled={index === 0} className="p-2 bg-bg-secondary text-text-muted hover:text-lavender rounded disabled:opacity-30">
              <ArrowUp size={16} />
            </button>
            <button onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="p-2 bg-bg-secondary text-text-muted hover:text-lavender rounded disabled:opacity-30">
              <ArrowDown size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
            <div className="flex items-center gap-2 text-lavender font-bold text-xs uppercase tracking-widest">
              {block.type === 'header' && <Hash size={14} />}
              {block.type === 'text' && <Type size={14} />}
              {block.type === 'image' && <ImageIcon size={14} />}
              {block.type === 'list' && <List size={14} />}
              {block.type === 'quote' && <Quote size={14} />}
              {block.type === 'code' && <Code size={14} />}
              {block.type === 'divider' && <Minus size={14} />}
              {block.type} Block
            </div>
            <button onClick={() => removeBlock(block.id)} className="text-text-muted hover:text-pink transition-colors">
              <Trash2 size={16} />
            </button>
          </div>

          {block.type === 'header' && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <select 
                  value={block.level} 
                  onChange={e => updateBlock(block.id, { level: e.target.value })}
                  className="bg-bg-secondary text-text-primary rounded px-3 py-2 border border-border outline-none focus:border-lavender"
                >
                  <option value="h1">Title (H1)</option>
                  <option value="h2">Section (H2)</option>
                  <option value="h3">Sub-section (H3)</option>
                  <option value="h4">Heading (H4)</option>
                </select>
                <select 
                  value={block.align} 
                  onChange={e => updateBlock(block.id, { align: e.target.value })}
                  className="bg-bg-secondary text-text-primary rounded px-3 py-2 border border-border outline-none focus:border-lavender"
                >
                  <option value="left">Left Align</option>
                  <option value="center">Center Align</option>
                  <option value="right">Right Align</option>
                </select>
              </div>
              <input 
                type="text" 
                value={block.content}
                onChange={e => updateBlock(block.id, { content: e.target.value })}
                placeholder="Enter header text..."
                className="w-full bg-bg-secondary text-text-primary px-4 py-3 rounded border border-border outline-none focus:border-lavender font-bold text-lg"
              />
            </div>
          )}

          {block.type === 'text' && (
            <div className="text-text-primary">
              <JoditEditor
                value={block.content}
                config={joditConfig}
                onBlur={newContent => updateBlock(block.id, { content: newContent })}
              />
            </div>
          )}

          {block.type === 'image' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={block.url || ''}
                  onChange={e => updateBlock(block.id, { url: e.target.value })}
                  placeholder="Image URL (or base64 format)..."
                  className="bg-bg-secondary text-text-primary px-4 py-2 rounded border border-border outline-none focus:border-lavender"
                />
                <select 
                  value={block.align} 
                  onChange={e => updateBlock(block.id, { align: e.target.value })}
                  className="bg-bg-secondary text-text-primary rounded px-4 py-2 border border-border outline-none focus:border-lavender"
                >
                  <option value="left">Left Align Image</option>
                  <option value="center">Center Align Image</option>
                  <option value="right">Right Align Image</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={block.caption || ''}
                  onChange={e => updateBlock(block.id, { caption: e.target.value })}
                  placeholder="Visible Caption (e.g. Figure 1: ...)"
                  className="bg-bg-secondary text-text-primary px-4 py-2 rounded border border-border outline-none focus:border-lavender text-sm"
                />
                <input 
                  type="text" 
                  value={block.alt || ''}
                  onChange={e => updateBlock(block.id, { alt: e.target.value })}
                  placeholder="Alt Text (for accessibility/SEO)..."
                  className="bg-bg-secondary text-text-primary px-4 py-2 rounded border border-border outline-none focus:border-lavender text-sm"
                />
              </div>
              {block.url && (
                <div className={`flex justify-${block.align === 'center' ? 'center' : block.align === 'right' ? 'end' : 'start'} mt-4`}>
                  <img src={block.url} alt={block.alt || 'Preview'} className="max-h-80 object-contain rounded-lg border border-border" />
                </div>
              )}
            </div>
          )}

          {block.type === 'list' && (
            <div className="flex flex-col gap-4">
              <select 
                value={block.listType} 
                onChange={e => updateBlock(block.id, { listType: e.target.value })}
                className="w-48 bg-bg-secondary text-text-primary rounded px-3 py-2 border border-border outline-none focus:border-lavender"
              >
                <option value="ul">Bullet Points</option>
                <option value="ol">Numbered List</option>
              </select>
              <div className="flex flex-col gap-2">
                {(block.items || []).map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <span className="text-lavender font-mono">{block.listType === 'ol' ? `${i + 1}.` : '•'}</span>
                    <input 
                      type="text" 
                      value={item}
                      onChange={e => {
                        const newItems = [...block.items];
                        newItems[i] = e.target.value;
                        updateBlock(block.id, { items: newItems });
                      }}
                      placeholder={`List item ${i + 1}...`}
                      className="flex-1 bg-bg-secondary text-text-primary px-4 py-2 rounded border border-border outline-none focus:border-lavender"
                    />
                    <button onClick={() => {
                      const newItems = block.items.filter((_, idx) => idx !== i);
                      updateBlock(block.id, { items: newItems.length ? newItems : [''] });
                    }} className="text-text-muted hover:text-pink p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => updateBlock(block.id, { items: [...block.items, ''] })} className="text-sm font-bold text-lavender hover:text-pink self-start mt-2 px-4 py-2 border border-lavender/30 rounded transition-colors">
                  + Add Item
                </button>
              </div>
            </div>
          )}

          {block.type === 'quote' && (
            <div className="flex flex-col gap-3">
              <textarea 
                value={block.content}
                onChange={e => updateBlock(block.id, { content: e.target.value })}
                placeholder="Enter blockquote text..."
                className="w-full bg-bg-secondary text-text-primary px-4 py-3 rounded border border-border outline-none focus:border-lavender resize-none h-24 italic"
              />
              <input 
                type="text" 
                value={block.author || ''}
                onChange={e => updateBlock(block.id, { author: e.target.value })}
                placeholder="Quote Author (optional)..."
                className="w-1/2 bg-bg-secondary text-text-primary px-4 py-2 rounded border border-border outline-none focus:border-lavender text-sm"
              />
            </div>
          )}

          {block.type === 'code' && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 items-center">
                <span className="text-sm text-text-muted">Language:</span>
                <input 
                  type="text" 
                  value={block.language || 'javascript'}
                  onChange={e => updateBlock(block.id, { language: e.target.value })}
                  placeholder="e.g., python, cpp, bash..."
                  className="w-48 bg-bg-secondary text-text-primary px-3 py-1.5 rounded border border-border outline-none focus:border-lavender font-mono text-sm"
                />
              </div>
              <textarea 
                value={block.content}
                onChange={e => updateBlock(block.id, { content: e.target.value })}
                placeholder="Paste code snippet here..."
                className="w-full bg-[#1e1e1e] text-lavender font-mono px-4 py-4 rounded border border-border outline-none focus:border-lavender resize-y h-40 text-sm"
              />
            </div>
          )}

          {block.type === 'divider' && (
            <div className="w-full border-t-2 border-dashed border-border/50 my-4 flex items-center justify-center">
              <span className="bg-bg-card px-4 text-xs text-text-muted -mt-2">Section Divider</span>
            </div>
          )}
        </div>
      ))}

      <div className="sticky bottom-6 z-10 mx-auto w-full max-w-4xl bg-bg-card/95 backdrop-blur border border-border p-4 rounded-2xl shadow-2xl flex flex-wrap justify-center gap-3">
        <button onClick={() => addBlock('header')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><Hash size={16} /> Header</button>
        <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><Type size={16} /> Rich Text</button>
        <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><ImageIcon size={16} /> Image</button>
        <button onClick={() => addBlock('list')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><List size={16} /> List</button>
        <button onClick={() => addBlock('quote')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><Quote size={16} /> Quote</button>
        <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><Code size={16} /> Code</button>
        <button onClick={() => addBlock('divider')} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-lavender hover:text-bg-primary text-text-primary font-bold rounded-lg transition-colors"><Minus size={16} /> Divider</button>
      </div>
    </div>
  );
}
