import DOMPurify from 'dompurify';
import { isAllowedFrameSrc } from './embeds';

// Post HTML is sanitized before it is rendered anywhere, including the editor preview.
// Iframes survive only when they point at an allowlisted embed provider; links get safe rels;
// media URLs must be http(s), same-site, or inline data from the editor.

const SAFE_MEDIA = /^(https?:|\/|data:image\/(png|jpe?g|gif|webp|avif);|data:video\/|blob:)/i;
const IFRAME_ALLOW = 'autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';

// Inline styles are limited to what the editor itself writes: text alignment on text blocks and the
// size of embed frames. Anything else (position, z-index, backgrounds) could cover the page.
function keepSafeStyle(node) {
  const style = node.getAttribute('style');
  if (!style) return;
  const allowed = node.classList?.contains('embed-frame') ? ['aspect-ratio', 'height'] : ['text-align'];
  const kept = style
    .split(';')
    .map((d) => d.trim())
    .filter((d) => {
      const [prop, value = ''] = d.split(':').map((x) => x.trim().toLowerCase());
      return allowed.includes(prop) && /^[\w\s./%-]+$/.test(value);
    });
  if (kept.length) node.setAttribute('style', kept.join('; '));
  else node.removeAttribute('style');
}

let hooked = false;
function installHooks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe' && !isAllowedFrameSrc(node.getAttribute('src') || '')) {
      node.remove();
    }
  });
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    keepSafeStyle(node);
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      if (/^https?:/i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
    if (['IMG', 'VIDEO', 'AUDIO', 'SOURCE', 'TRACK'].includes(node.tagName)) {
      const src = node.getAttribute('src');
      if (src && !SAFE_MEDIA.test(src)) node.removeAttribute('src');
      const poster = node.getAttribute('poster');
      if (poster && !SAFE_MEDIA.test(poster)) node.removeAttribute('poster');
      if (node.tagName === 'IMG') {
        node.setAttribute('loading', 'lazy');
        node.setAttribute('referrerpolicy', 'no-referrer');
      }
    }
    if (node.tagName === 'IFRAME') {
      node.setAttribute('allow', IFRAME_ALLOW);
      node.removeAttribute('name');
      node.setAttribute('loading', 'lazy');
      node.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-presentation');
    }
  });
}

export function sanitizePostHtml(html) {
  installHooks();
  return DOMPurify.sanitize(html || '', {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'controls', 'playsinline', 'loop', 'muted', 'poster'],
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
    FORBID_ATTR: ['srcset', 'download', 'ping'],
    // Prefix author ids/names so they can't clobber globals or the generated footnote anchors.
    SANITIZE_NAMED_PROPS: true,
  });
}
