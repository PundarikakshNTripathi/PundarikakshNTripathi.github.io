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

The site has its own editor at `/write`, built on TipTap (ProseMirror). It works like Substack's or Medium's:

- **Formatting**: a toolbar plus a menu on selected text for headings, bold, italic, underline,
  strikethrough, inline code, highlight, links (Ctrl K), sub/superscript, alignment, lists, quotes,
  pull quotes, callouts and drop caps. Markdown shortcuts work as you type (`#`, `-`, `>`, ```` ``` ````, `---`).
- **Blocks**: type `/` for the block menu. It has equations (KaTeX, with a live preview), highlighted
  code, images and GIFs, video, tables, footnotes, buttons and dividers.
- **Embeds or links**: paste a URL and choose how it shows. It can be a live player (YouTube, Vimeo,
  Spotify, Loom, CodePen), a link card, or a plain link.
- **Post settings**: cover image, URL slug, description, tags, publish date and pinning.
- **Preview** uses the same renderer as the public post page.

### On the web (Supabase)

With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set (GitHub Actions secrets, or `.env.local`):

- **Sign-in:** `/write` asks for email, password and a TOTP code.
- **Storage:** drafts autosave to Postgres, media goes to Supabase Storage, and publishing is instant.
- **Readers:** they fetch published posts from the `public_posts` view.
- **Build:** each build snapshots the published posts into `src/data/posts.json` for the RSS feed and
  first paint. A scheduled deploy refreshes the snapshot every 6 hours.

**Security.** Everything is enforced in the database (`supabase/schema.sql`):
- Only users in `blog_admins`, signed in with two-factor (`aal2`), can write or upload.
- The public can read only the published copy of published posts.
- The media bucket accepts raster images and video only.

The writer's session is kept in `sessionStorage`.

### Locally, without Supabase

`npm run dev` and open <http://localhost:5173/write>. Drafts save to IndexedDB, and **Publish → Write to
the site folder** (Chrome/Edge) updates `src/data/posts.json` and `public/blog/media/`. Commit and push to
put it live. A build without Supabase settings leaves the writer out entirely.

Post HTML is sanitized with DOMPurify before it's rendered. Iframes are limited to the embed providers
listed in `src/lib/embeds.js`, and the same list drives the Content-Security-Policy. Inline styles are
limited to alignment and embed sizing, and uploaded SVGs are converted to PNG.

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
