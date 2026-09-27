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
