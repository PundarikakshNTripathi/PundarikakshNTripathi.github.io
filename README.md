# pundarikakshntripathi.github.io

My personal site: who I am, what I'm building, and eventually what I've written.
It's a small React app built with Vite and Tailwind, deployed to GitHub Pages.

## Editing

Almost everything you read on the site lives in [`src/data/content.js`](src/data/content.js):
the intro, the About story and its sidenotes, work, research questions, projects and the timeline.
Components only decide how it looks.

- **Projects** take a `figure` key that picks a small schematic drawn in
  [`ProjectFigure.jsx`](src/components/ProjectFigure.jsx). Set `featured: true` to give one the large layout.
- **Sidenotes** in the About story are written inline as `{note:id}` and defined in `story.notes`.
- **"Last updated"** is `person.updated`. Change it when the content changes.

## Writing posts

The site has its own editor, built on TipTap (ProseMirror). It runs only on your machine: start
`npm run dev` and open <http://localhost:5173/write>. It isn't part of the production build, so nothing on
the public site can reach it. It works like Substack's or Medium's:

- **Formatting**: a toolbar plus a menu on selected text for headings, bold, italic, underline,
  strikethrough, inline code, highlight, links (Ctrl K), sub/superscript, alignment, lists, quotes,
  pull quotes, callouts and drop caps. Markdown shortcuts work as you type (`##`, `-`, `>`, ```` ``` ````, `---`).
- **Blocks**: type `/` for the block menu. It has equations (KaTeX, inline and display, with a live
  preview), syntax-highlighted code blocks, images and GIFs with captions, alt text and width, uploaded
  video, tables, footnotes, buttons and dividers.
- **Embeds or links**: paste a URL and choose how it shows. It can be a live player (YouTube, Vimeo,
  Spotify, Loom, CodePen), a link card, or a plain link. Image and video URLs show inline.
- **Post settings**: cover image, URL slug, description, tags, publish date and pinning.
- **Preview** uses the same renderer as the public post page.

Drafts save automatically to the browser's IndexedDB as you type. To publish:

1. Click **Publish → Write to the site folder** in Chrome or Edge, and pick this repository once.
   Only `src/data` and `public/blog/media` are remembered, never the whole folder.
   That updates `src/data/posts.json` and saves images and videos to `public/blog/media/`.
   In other browsers, **Download posts.json** and replace `src/data/posts.json` with it.
2. Commit and push. GitHub Pages rebuilds the site, and the post also shows up in `/feed.xml` (RSS).

Post HTML is sanitized with DOMPurify before it's rendered. Iframes are limited to the embed providers
listed in `src/lib/embeds.js`, and the same list drives the Content-Security-Policy. Inline styles are
limited to alignment and embed sizing. Uploaded SVGs are converted to PNG, and only raster images and
video files are ever written to `public/blog/media`.

## Running it

```sh
npm ci --ignore-scripts
npx husky          # once per clone, enables the pre-commit audit hook
npm run dev
npm run build      # outputs dist/, including the Content-Security-Policy
```

## Security notes

- **No third-party requests.** Fonts (Newsreader and IBM Plex, OFL) are self-hosted in `public/fonts`.
  The only external call is EmailJS, from the contact form.
- **Content-Security-Policy** is injected at build time by a small plugin in `vite.config.js`. It allows
  the one inline theme script by hash. GitHub Pages can't send headers, so it ships as a `<meta>` tag.
- **Supply chain.** Dependencies are pinned to exact versions, and `.npmrc` sets `ignore-scripts`, so
  packages can't run code on install. CI verifies registry signatures and fails on high-severity
  advisories. GitHub Actions are pinned to commit SHAs. Dependabot waits seven days before proposing
  a new release.
- **EmailJS.** The IDs in `Contact.jsx` are public by design. Restrict allowed origins to this domain
  in the EmailJS dashboard so nobody else can send through the account.
