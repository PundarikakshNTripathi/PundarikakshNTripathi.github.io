import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { FRAME_ORIGINS } from './src/lib/embeds.js'

// GitHub Pages can't send response headers, so the Content-Security-Policy ships as a <meta> tag.
// Inline scripts (the theme bootstrap in index.html) are allowed by hash, computed at build time.
// Dev mode is left alone because Vite's HMR needs inline scripts.
const csp = () => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
        .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`)
      const policy = [
        "default-src 'self'",
        `script-src 'self' ${hashes.join(' ')}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "media-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://api.emailjs.com",
        // Only the embed providers the editor supports (src/lib/embeds.js).
        `frame-src ${FRAME_ORIGINS.join(' ')}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ].join('; ')
      return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`)
    },
  },
})

// RSS feed of published posts, written to dist/feed.xml at build time.
const SITE = 'https://pundarikakshntripathi.github.io'
const xml = (s = '') => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])
const rss = () => ({
  name: 'rss-feed',
  apply: 'build',
  generateBundle() {
    const posts = JSON.parse(readFileSync('src/data/posts.json', 'utf8'))
      .filter((p) => p.title && p.html && /^[a-z0-9-]+$/.test(p.slug || ''))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    const items = posts.map((p) => {
      const url = `${SITE}/blog/${p.slug}`
      const html = p.html
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/\s(href|src)="(?!https?:|\/|mailto:)[^"]*"/gi, '')
        .replace(/\son\w+="[^"]*"/gi, '')
        .replace(/(src|href)="\//g, `$1="${SITE}/`)
        .replaceAll(']]>', ']]]]><![CDATA[>')
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${p.description || p.subtitle ? `<description>${xml(p.description || p.subtitle)}</description>` : ''}
      ${(p.tags || []).map((t) => `<category>${xml(t)}</category>`).join('')}
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`
    })
    this.emitFile({
      type: 'asset',
      fileName: 'feed.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pundarikaksh N. Tripathi: Writing</title>
    <link>${SITE}/#writing</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes on ML systems, low-bit inference, causal inference and interpretability.</description>
    <language>en</language>
${items.join('\n')}
  </channel>
</rss>
`,
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), csp(), rss()],
})
