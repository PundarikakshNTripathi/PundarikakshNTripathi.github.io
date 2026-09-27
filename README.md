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

`/admin` is a local drafting tool. Drafts are saved in your browser only, and nobody else can see them.
To publish:

1. Write and save drafts at `/admin`.
2. Click **Export posts.json**.
3. Replace `src/data/posts.json` with the exported file, commit and push.

Post HTML is sanitised with DOMPurify before it's rendered.

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
