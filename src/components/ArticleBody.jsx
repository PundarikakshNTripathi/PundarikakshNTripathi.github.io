import { useLayoutEffect, useMemo, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '../article.css';
import hljs from 'highlight.js/lib/common';
import { sanitizePostHtml } from '../lib/sanitize';
import { slugify } from '../lib/posts';
import { LANGUAGES } from '../writer/lowlight';

const LANGUAGE_NAMES = Object.fromEntries(LANGUAGES);

// Renders post HTML for readers (and the editor's preview): sanitize, then enhance in place:
// KaTeX for math, highlight.js for code, numbered footnotes, heading anchors and a copy button.
// React renders an empty container and this effect owns its children, so a re-render can never
// overwrite the enhanced DOM with the raw HTML again.
const ArticleBody = ({ html, onToc, className = '' }) => {
  const ref = useRef(null);
  const clean = useMemo(() => sanitizePostHtml(html), [html]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.innerHTML = clean;

    root.querySelectorAll('[data-type="inline-math"], [data-type="block-math"]').forEach((el) => {
      const latex = el.getAttribute('data-latex') || '';
      try {
        katex.render(latex, el, { displayMode: el.dataset.type === 'block-math', throwOnError: false, output: 'htmlAndMathml' });
      } catch {
        el.textContent = latex;
      }
    });

    root.querySelectorAll('pre > code').forEach((code) => {
      const pre = code.parentElement;
      hljs.highlightElement(code);
      const lang = (code.className.match(/language-([\w+#-]+)/) || [])[1];
      const bar = document.createElement('div');
      bar.className = 'code-bar';
      const label = document.createElement('span');
      label.textContent = lang && lang !== 'plaintext' ? (Object.hasOwn(LANGUAGE_NAMES, lang) ? LANGUAGE_NAMES[lang] : lang) : 'Code';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = 'Copy';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copy.textContent = 'Copied';
          setTimeout(() => (copy.textContent = 'Copy'), 1500);
        } catch {
          copy.textContent = 'Press Ctrl+C';
        }
      });
      bar.append(label, copy);
      pre.before(bar);
    });

    const notes = [...root.querySelectorAll('sup[data-type="footnote"]')];
    if (notes.length) {
      const list = document.createElement('ol');
      notes.forEach((sup, i) => {
        const n = i + 1;
        const text = sup.getAttribute('data-note') || '';
        sup.textContent = '';
        const a = document.createElement('a');
        a.href = `#fn-${n}`;
        a.id = `fnref-${n}`;
        a.textContent = n;
        a.setAttribute('aria-label', `Footnote ${n}`);
        sup.append(a);
        const li = document.createElement('li');
        li.id = `fn-${n}`;
        li.textContent = `${text} `;
        const back = document.createElement('a');
        back.href = `#fnref-${n}`;
        back.textContent = '↩';
        back.setAttribute('aria-label', `Back to footnote ${n} in the text`);
        li.append(back);
        list.append(li);
      });
      const section = document.createElement('section');
      section.className = 'footnotes';
      section.setAttribute('aria-label', 'Footnotes');
      section.append(list);
      root.append(section);
    }

    const toc = [];
    const used = new Set();
    root.querySelectorAll('h2, h3').forEach((h) => {
      let id = slugify(h.textContent) || 'section';
      while (used.has(id)) id += '-';
      used.add(id);
      h.id = id;
      toc.push({ id, text: h.textContent, level: h.tagName.toLowerCase() });
    });
    onToc?.(toc);
  }, [clean, onToc]);

  return <div ref={ref} className={`article ${className}`} />;
};

export default ArticleBody;
