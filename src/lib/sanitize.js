import DOMPurify from 'dompurify';
import { isAllowedFrameSrc } from './embeds';

// Post HTML is sanitized before it is rendered anywhere, including the editor preview.
// Iframes survive only when they point at an allowlisted embed provider; links get safe rels;
// media URLs must be http(s), same-site, or inline data from the editor.

const SAFE_MEDIA = /^(https?:|\/|data:image\/|data:video\/|blob:)/i;

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
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      if (/^https?:/i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
    if (['IMG', 'VIDEO', 'SOURCE'].includes(node.tagName)) {
      const src = node.getAttribute('src');
      if (src && !SAFE_MEDIA.test(src)) node.removeAttribute('src');
      if (node.tagName === 'IMG') {
        node.setAttribute('loading', 'lazy');
        node.setAttribute('referrerpolicy', 'no-referrer');
      }
    }
    if (node.tagName === 'IFRAME') {
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
  });
}
