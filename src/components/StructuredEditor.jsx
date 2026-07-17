import React, { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Plus, Trash2, Image as ImageIcon, Type, List, Hash, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function StructuredEditor({ blocks, setBlocks }) {
  const addBlock = (type) => {
    const newBlock = { id: Date.now().toString(), type, content: '', align: 'left' };
    if (type === 'image') newBlock.caption = '';
    if (type === 'list') newBlock.items = [''];
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const joditConfig = {
    readonly: false,
    theme: 'dark',
    minHeight: 200,
    toolbarAdaptive: false,
    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'link', 'align', '|', 'math'],
    style: { background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {blocks.map((block, index) => (
        <div key={block.id} className="glass-card p-4 flex flex-col gap-3 relative group">
          <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-text-muted hover:text-pink opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={18} />
          </button>
          
          <div className="flex items-center gap-2 mb-2 text-lavender font-bold text-sm uppercase tracking-wider">
            {block.type === 'header' && <Hash size={16} />}
            {block.type === 'text' && <Type size={16} />}
            {block.type === 'image' && <ImageIcon size={16} />}
            {block.type === 'list' && <List size={16} />}
            {block.type} Block
          </div>

          {block.type === 'header' && (
            <div className="flex gap-2">
              <select 
                value={block.level || 'h2'} 
                onChange={e => updateBlock(block.id, { level: e.target.value })}
                className="bg-bg-secondary text-text-primary rounded p-2 border border-border"
              >
                <option value="h2">Section (H2)</option>
                <option value="h3">Sub-section (H3)</option>
              </select>
              <input 
                type="text" 
                value={block.content}
                onChange={e => updateBlock(block.id, { content: e.target.value })}
                placeholder="Enter section title..."
                className="flex-1 bg-bg-secondary text-text-primary p-2 rounded border border-border outline-none focus:border-lavender"
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
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={block.url || ''}
                onChange={e => updateBlock(block.id, { url: e.target.value })}
                placeholder="Image URL (or base64)..."
                className="bg-bg-secondary text-text-primary p-2 rounded border border-border outline-none focus:border-lavender"
              />
              <input 
                type="text" 
                value={block.caption || ''}
                onChange={e => updateBlock(block.id, { caption: e.target.value })}
                placeholder="Image caption..."
                className="bg-bg-secondary text-text-primary p-2 rounded border border-border outline-none focus:border-lavender text-sm"
              />
              {block.url && <img src={block.url} alt="Preview" className="max-h-64 object-contain rounded mt-2 border border-border" />}
            </div>
          )}

          {block.type === 'list' && (
            <div className="flex flex-col gap-2">
              {(block.items || []).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-lavender">•</span>
                  <input 
                    type="text" 
                    value={item}
                    onChange={e => {
                      const newItems = [...block.items];
                      newItems[i] = e.target.value;
                      updateBlock(block.id, { items: newItems });
                    }}
                    placeholder={`Point ${i + 1}...`}
                    className="flex-1 bg-bg-secondary text-text-primary p-2 rounded border border-border outline-none focus:border-lavender"
                  />
                  <button onClick={() => {
                    const newItems = block.items.filter((_, idx) => idx !== i);
                    updateBlock(block.id, { items: newItems.length ? newItems : [''] });
                  }} className="text-text-muted hover:text-pink"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => updateBlock(block.id, { items: [...block.items, ''] })} className="text-sm text-lavender hover:underline self-start mt-1">
                + Add Point
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={() => addBlock('header')} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-card text-text-primary rounded border border-border transition-colors"><Hash size={16} /> Add Section Header</button>
        <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-card text-text-primary rounded border border-border transition-colors"><Type size={16} /> Add Text Content</button>
        <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-card text-text-primary rounded border border-border transition-colors"><ImageIcon size={16} /> Add Image</button>
        <button onClick={() => addBlock('list')} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-card text-text-primary rounded border border-border transition-colors"><List size={16} /> Add Points</button>
      </div>
    </div>
  );
}
