/* eslint-disable react-refresh/only-export-components -- TipTap extensions are defined next to their node views by design. */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';

// Type "/" at the start of a line (or after a space) to insert any block by name.
// `items()` returns blockCommands() from Writer.jsx, so the toolbar and this menu share one list.

const SlashMenu = forwardRef(({ items, command }, ref) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  useEffect(() => setIndex(0), [items]);
  // Keep the highlighted block visible while moving through the list with the arrow keys.
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowDown') {
        setIndex((i) => (i + 1) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === 'ArrowUp') {
        setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === 'Enter') {
        if (items[index]) command(items[index]);
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return <div className="slash-menu"><p className="slash-empty">No block with that name</p></div>;
  }
  return (
    <div ref={listRef} className="slash-menu" role="listbox" aria-label="Insert a block">
      {items.map((item, i) => (
        <button
          key={item.title}
          type="button"
          role="option"
          aria-selected={i === index}
          className={i === index ? 'is-active' : ''}
          onMouseEnter={() => setIndex(i)}
          onMouseDown={(e) => {
            e.preventDefault();
            command(item);
          }}
        >
          {item.icon && <item.icon size={16} strokeWidth={1.75} aria-hidden="true" />}
          <span>
            <span className="slash-title">{item.title}</span>
            <span className="slash-hint">{item.hint}</span>
          </span>
        </button>
      ))}
    </div>
  );
});
SlashMenu.displayName = 'SlashMenu';

const place = (el, rect) => {
  if (!el || !rect) return;
  const r = rect();
  if (!r) return;
  const below = r.bottom + 8;
  const fitsBelow = below + 320 < window.innerHeight;
  el.style.left = `${Math.min(r.left, window.innerWidth - 300)}px`;
  el.style.top = fitsBelow ? `${below}px` : `${Math.max(8, r.top - 328)}px`;
};

export const SlashCommand = Extension.create({
  name: 'slashCommand',
  addOptions() {
    return { items: () => [] };
  },
  addProseMirrorPlugins() {
    const all = this.options.items;
    return [
      Suggestion({
        editor: this.editor,
        pluginKey: new PluginKey('slashCommand'),
        char: '/',
        allowSpaces: false,
        startOfLine: false,
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          return $from.parent.type.name !== 'codeBlock';
        },
        items: ({ query }) => {
          const q = query.toLowerCase();
          return all().filter((c) => c.title.toLowerCase().includes(q) || (c.keywords || '').includes(q));
        },
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();
          props.run(editor);
        },
        render: () => {
          let renderer;
          let host;
          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, { props, editor: props.editor });
              host = document.createElement('div');
              host.className = 'slash-host';
              host.append(renderer.element);
              document.body.append(host);
              place(host, props.clientRect);
            },
            onUpdate: (props) => {
              renderer.updateProps(props);
              place(host, props.clientRect);
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                host?.remove();
                return true;
              }
              return renderer.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              host?.remove();
              renderer?.destroy();
            },
          };
        },
      }),
    ];
  },
});
