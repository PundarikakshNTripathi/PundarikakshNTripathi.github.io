# Redesign loop, September 2026

How the `redesign/editorial-portfolio` branch was built, following the loop-engineering pattern
([Osmani](https://addyosmani.com/blog/loop-engineering/),
[MachineLearningMastery](https://machinelearningmastery.com/an-introduction-to-loop-engineering/)):
a testable goal, real tools acting on the real site, and verification by judges that didn't write the code.

## Goal and verification signals

| Goal | How it was checked |
| --- | --- |
| Elegant, researcher-native design that isn't generic | Design critic agent with screenshots at 1440, 1024 and 390 px in both themes, against a rubric covering type, layout, contrast, template tells and accessibility |
| Copy that reads human and tells a true story | Prose judge agent using the `humanizer` skill, plus a fact check against the résumé and old site |
| Correct numbers | Each project's README benchmark table (`gh api repos/.../readme`) |
| Secure site and supply chain | Security reviewer agent, `npm audit`, `npm audit signatures`, CSP/XSS test suite on the production build |
| Works in a browser | Playwright MCP session (navigate, click, theme, keyboard, mobile menu, console) and Playwright scripts |
| Fast | LCP and CLS measured on throttled Slow 4G with 4× CPU slowdown |
| Builds cleanly | `npm run lint`, `npm run build` |

**Stop conditions:** all P1 and P2 findings from every judge resolved and re-verified, lint and build clean,
0 audit findings, 0 console errors, LCP under 2.5 s. Items that need the owner's accounts or confirmation
were escalated instead of looped on.

## Models and effort

| Component | Model | Why |
| --- | --- | --- |
| Implementation | Opus, high effort | Design and code judgement, many interacting files |
| Design research | Sonnet | Reading and summarising sources; no judgement calls about this codebase |
| Design critic | Opus | Visual judgement is the hardest part to get right |
| Security review | Opus | High stakes; needs careful reasoning about attack surfaces |
| Prose review | Sonnet | Checklist-style review against a known catalogue of tells |

Judges were report-only, so they couldn't grade their own edits.

## Iterations

1. **Discover.** Read every source file and the résumé, took baseline screenshots, installed tooling
   (below), and researched design references with a separate agent. Principles taken from it: a single
   reading column, projects as paper-style entries with a figure, sidenotes, personality in prose rather than
   chrome, restrained motion, a visible "last updated".
2. **Build v1.** Design tokens, self-hosted Newsreader and IBM Plex, left-rail layout, a coarse-to-fine
   raster portrait as the one motion moment, schematic project figures, rewritten copy, new favicon,
   static posts, CSP, DOMPurify, dependency cleanup. Self-checked with screenshots, then fixed: stale active
   nav state, a portrait blend bug, numbered non-sequences, no project hierarchy.
3. **Judge round 1** (three agents in parallel).
   - Design: 3 P1s (unstyled post HTML, double-raised sidenote marks, form borders under 3:1), 9 P2s.
   - Prose: 8/10. One split contrast and a question triad, spelling drift, and three claims the résumé
     doesn't support.
   - Security: no Critical or High findings. Fixes for malformed-hash crash, framing, headless spam and
     loose pins.
   - Fact check: VoltaSplat's 476 FPS was measured at 100k Gaussians, not 1M. All results were rewritten
     from the READMEs, with the setup stated.
4. **Judge round 2.** The critic re-verified: all P1 and P2 items resolved. It raised three new P2s (sticky
   error screen, long measure in Work, wide stacked sidenotes), which were fixed and tested.
5. **Performance pass.** LCP went from 2.8 s to 2.48 s by preloading the italic serif (the LCP element) and
   loading EmailJS on first send. CLS is 0 and there are no third-party requests.
6. **Browser pass through Playwright MCP.** Navigated the production build through the MCP server's
   tools (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_press_key`,
   `browser_resize`, `browser_take_screenshot`, `browser_console_messages`). The anchors, theme persistence,
   keyboard order and mobile menu all worked, with no console errors or warnings.

## Tooling installed, and how it was vetted

- **MCP servers** are global npm installs at pinned versions, registered at user scope by absolute path.
  None of them runs `npx @latest`.
  - `@playwright/mcp` 0.0.82
  - `chrome-devtools-mcp` 1.10.1, with usage statistics and update checks off
  - `@upstash/context7-mcp` 4.1.1

  Publishers were checked on npm before installing.
- **Skills** came from [skills.sh](https://skills.sh) and [mattpocock/skills](https://github.com/mattpocock/skills):
  - `frontend-design` and `webapp-testing` (Anthropic)
  - `web-design-guidelines` and `react-best-practices` (Vercel)
  - `humanizer`
  - `taste-skill`
  - `research` and `writing-beats` (Matt Pocock)

  Each repo was shallow-cloned, read, and grepped for scripts, network calls and injection-style
  instructions. Vercel's guideline skill fetched its rules from a mutable URL at run time, so those rules
  were vendored at a pinned commit. Sources and commits are in `~/.claude/skills/PROVENANCE.md`.

## Round 2: palette, lotus mark, new resume, writing platform

**Goal:** a purple/pink palette, a better favicon, updated story from the new résumé, the blog back,
and a Medium/Substack-grade writer. **Signals:** the same judges as round 1, plus round-trip tests of
the editor's document model and an end-to-end publish test.

1. **Research.**
   - Checked Substack's and Medium's editor features. Substack itself is built on TipTap/ProseMirror.
   - Read the current TipTap v3 docs through the Context7 MCP.
   - Vetted every new package before installing it. All TipTap packages are at 3.31.3, published by
     the official maintainers, 24 days old, MIT-licensed, with no install scripts. `npm audit`
     signatures verified.
2. **Build.**
   - Palette tokens, with every text/background pair checked against WCAG.
   - The lotus mark ("Puṇḍarīkākṣa", lotus-eyed), previewed at 16, 32 and 180 px on dark and light
     tab bars.
   - Content rewritten from the résumé and the repository READMEs.
   - The editor, the reader, publish-to-folder and an RSS feed.
3. **Self-test through the Playwright MCP.** Caught and fixed:
   - The slash menu was empty, because TipTap `configure()` deep-copies options.
   - Footnotes and buttons were lost on reload, because a parse rule had the wrong priority.
   - The reader's enhancements were wiped, because React re-applied `innerHTML`.
   - Title autosize and a nested `<main>`.
   - After the fixes, a round trip of 12 node types showed 0 differences, and an end-to-end publish
     into an OPFS folder worked.
4. **Judges.**
   - **Security:** one High, the SVG-as-document issue, fixed by rasterizing SVGs and allowlisting
     media types. Two Mediums:
     - The writer on the shared github.io origin, fixed by making it dev-only and storing only the
       folders it writes to.
     - Style-attribute UI redress, fixed with a style allowlist.
     - Six Lows, all fixed.
   - **Prose:** 8/10. The staged opener was cut and the unsupported "Founder" title removed. All
     numbers matched their sources.
   - **Editor/design critic** (re-run after a rate limit): four P1s.
     - Typing after an insert deleted the block.
     - Inserting while a figure was selected replaced it.
     - Dialogs opened with focus on Close.
     - `$$…$$` math was mangled by smart typography.

     Also six P2s, a set of missing features and polish items.
5. **Fix and verify through the Playwright MCP.**
   - `insertBlock` never replaces a selection and always leaves a text cursor.
   - Dialogs focus their first field and return focus to the editor when they close.
   - Typography skips math and code. Links are non-inclusive.
   - Tags save as you type.
   - The "/" menu lists every block and scrolls with the keys.
   - The mobile bubble menu fits the screen. `# ` makes a heading, and Ctrl+/ opens the shortcuts.
   - Light-theme contrast is fixed, the page is one step pinker, shadows are plum-tinted, and
     `theme-color` follows the toggle.
   - The lotus now has outlined petals, so it holds up at 16/32 px.

   Each P1 was re-checked in the browser. The 12-node round trip still shows 0 differences, and the
   production bundle still contains no editor code.

## Round 3: owner feedback before release

- **Archive:** the original site is kept as the `archive/v1-pixel-portfolio` branch, the `v1.0.0` tag, and a
  GitHub release.
- **Quiet Intelligence:** the owner is its founder and Lead Researcher. The lab is now a block in Research,
  with its tagline and links. Wording is modest because the lab isn't publicly announced yet.
- **Projects:**
  - nanoDist is no longer framed as research.
  - Causal-DML moved to "Also built". Cognova was removed.
  - Amazon ML Challenge 2026 (third place, business entity resolution) is now featured, using numbers from
    the repository README. The repo is private, so the entry says so instead of linking to a 404.
- **Background glow:** removed. It was decoration with no purpose. It's replaced by a reading-position
  hairline under each sticky section title, using CSS scroll-driven animation with no JavaScript. The hero's
  second load animation was also removed, leaving the portrait render as the single motion moment.
- **Mark:** replaced the lotus with a causal attention mask. Each row is a token's softmax over earlier
  tokens, the diagonal is self-attention, and the masked upper triangle is the future. It reads at 16 px.

**Not built** (noted for later): image galleries, crop, version history, find and replace, X/Gist
embeds (they need third-party scripts, which the CSP blocks by design), and single-dollar `$…$` inline
math (it collides with prices like "$5").

## Open items for the owner

- Confirm the personal lines that aren't in the résumé:
  - The "same room" aside and its Slack-channel joke.
  - The post-2027 plan.
  - The 2023 start year.
  - The HackArena month.
- Repo settings: branch protection on `main`, Dependabot security updates, and requiring actions to be
  pinned by SHA.
- Delete the stale `VITE_ADMIN_HASH` secret.
- EmailJS dashboard: allowed origins and a fixed recipient.
- Decide whether the résumé PDF should keep the phone number.
