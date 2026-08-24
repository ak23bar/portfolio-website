# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

There is no build system, package manager, linter, or test suite. The repo is plain static files served as-is.

```bash
python3 -m http.server 8001      # serve locally, then open http://localhost:8001/
```

Deployment is Cloudflare Pages on the custom domain `akaman.dev`, connected to the GitHub repo with no build command. The production branch is **`updates`**, not `main` — verified from the served bytes: the live `assets/js/main.js` contains the `localeCompare` version-compare fix that exists only on `origin/updates`. Pushing there publishes the files verbatim. `main` is 33 commits behind and is not deployed.

```
akaman.dev/          ->  /index.html         (professional surface)
akaman.dev/matrix/   ->  /matrix/index.html  (preserved Matrix portfolio)
```

`_headers` carries the real caching policy. The three `<meta http-equiv="Cache-Control">` tags in the Matrix head are ignored by browsers for HTTP caching and are not it. `_headers` has no effect under `python3 -m http.server`; it is only observable on a deploy.

Because there are no tests, verification means loading **both** surfaces in a browser, checking each console is clean, and clicking the specific card/modal you touched.

**A trap that has cost time twice.** `python3 -m http.server` returns HTTP 200 with a *directory listing* when a path has no index file, so asserting a 200 on `/` proves nothing. Assert on response content instead, e.g. `curl -s localhost:8001/ | grep akbar@akaman`. Separately, the Playwright profile caches aggressively; a stale `pro.js` will pass checks silently, so cache-bust the URL when verifying a JS change.

## Architecture

**Two standalone documents that share no CSS and no JS.**

| Path | What it is | Loads |
|---|---|---|
| `index.html` (~340 lines) | professional surface at `/` | `assets/css/pro.css`, `assets/js/pro.js`, one Google Fonts link |
| `matrix/index.html` (~3.35k lines) | preserved Matrix portfolio at `/matrix/` | `styles.css`, `components.css`, `responsive.css`, `main.js`, `modals.js`, Font Awesome, ElevenLabs |

The professional surface has zero inline `onclick`, zero inline `style=` attributes, zero `#00ff41`, and no visible em dashes, all deliberately. Keep it that way: `grep -c '—' index.html` must stay 0, and it must never reference a Matrix asset. Its sections are hero (`#home`), selected systems (`#projects`), experience (`#experience`), and contact (`#contact`).

Because the professional document never loads the Matrix stylesheets, the repo's ~307 hardcoded `#00ff41` values and ~328 inline `style=` attributes affect only `/matrix/`. They are **not** a blocker for anything at the root, and a token refactor of them buys nothing — do not start one under the impression that it does.

Every asset reference inside `matrix/index.html` is root-absolute (`/assets/...`) because the document lives in a subdirectory. A relative path there is a bug. The same applies to the three resume paths in `main.js`.

**The card/modal duplication is the central pattern of `matrix/index.html`** (it no longer applies to the root). Each role and project appears twice in that file:

1. A summary card — `<div class="timeline-item" onclick="openModal('modal-ahead')">` or `<div class="project-card" onclick="openModal('project-codelingo')">` — inside its section.
2. A full detail block — `<div id="modal-ahead" class="modal">` — in the modal pile later in the same file (~48 such blocks).

The two are separated by ~1300 lines and are linked only by the id string. Any content edit (title, dates, description) almost always needs to happen in both places. Modal ids follow no single convention: `modal-*` for experience, `project-*` for projects, plus legacy numbered ones (`modal1`–`modal6`, `project2`–`project5`).

Find modals that are defined but never opened:

```bash
comm -23 <(grep -o 'id="\(modal\|project\|highlight\)[a-z0-9-]*"' index.html | sed 's/id="//;s/"//' | sort -u) \
         <(grep -o "openModal('[a-z0-9-]*')" index.html | sed "s/openModal('//;s/')//" | sort -u)
```

(The three `highlight-*` modals are currently orphaned dead code.)

`assets/js/modals.js` (40 lines) is the whole modal engine — toggles `style.display`, closes on backdrop click, `.close` click, and Escape. It needs no changes when adding a modal; matching ids are sufficient.

`assets/js/main.js` (~1.8k lines) is the terminal easter egg plus visual effects. Roughly two thirds is `enhancedTerminalCommands`, a fake Unix shell (`ls`, `cd`, `cat`, `grep`, `find`, `tree`, `goto`, …) over a hardcoded `fileSystem` map at the top of the file. The remainder is matrix rain, the loading screen, scroll progress, the version widget, and the typing animation.

## Content that duplicates and drifts

Editing site content in `index.html` usually leaves stale copies elsewhere. Check all of these:

- **`main.js` `fileContents`** (~line 959) — the terminal's `cat` output. `current_roles.txt`, `bio.txt`, `gpa.txt` etc. restate homepage content in prose.
- **`main.js` `searchableContent`** (~line 1133) — a keyword index backing the `find` command, mirroring the same facts again.
- **`main.js` `versionConfig`** (~line 1662) — `initVersionDisplay()` overwrites the version markup hardcoded at `matrix/index.html:104-106` on DOMContentLoaded. Update both, or the tooltip renders stale text before the script runs.
- **`branch-meta` spans** in the experience tree (`matrix/index.html:459`, `516`, `573`, `642`, `737`, `758`) — hand-written counts like `4 roles · AHEAD, Talent Strategy Experts, …`. Adding or removing a role does not update them.
- **`professional-stats`** (`matrix/index.html:184`) — hand-maintained `20+` / `30+` / `500+` totals.
- **Cross-surface copy.** The professional surface restates five system theses, five roles, and the hero positioning that also exist in `matrix/index.html`, in deliberately different prose. The editorial rule: the professional surface owns **positioning**, the Matrix surface owns the **detail record**, and only a genuine repositioning requires touching both. `assets/files/Akbar_Resume.pdf` is the factual authority when copies disagree — it is newer than the Matrix copy, which still says "Enterprise AI Engineering Intern" where the resume says "Enterprise AI Intern".
- **Dates reading `- Present`** — grep `date-location.*Present` and cross-check against the `current_roles` cards; the two drift apart when a role ends. Each date also appears again in that role's modal as `<strong>Duration:</strong>`.

## Styling

Three stylesheets load in order: `styles.css` → `components.css` → `responsive.css`. The split is loose and the files overlap — `.nav-container` is defined in both `styles.css` and `components.css`, and media queries appear in all three despite `responsive.css` existing. Later files win, so check for a competing rule in `components.css` before debugging a `styles.css` selector that seems ignored.

`styles.css` is indented 8 spaces throughout, a leftover from being extracted out of an inline `<style>` block. There are also ~330 inline `style="..."` attributes in `matrix/index.html` (modal bodies are styled almost entirely inline) and a small `<style>` block at `matrix/index.html:1718` holding two keyframes. None of this applies to the professional surface, which has none of either. Match whichever approach the surrounding markup already uses rather than normalizing.

Theme is Matrix-inspired: `#00ff41` green on black, `#ff0040` red for hover states, Fira Code / Share Tech Mono.

## External dependencies

The Matrix surface loads all of these from CDNs, none vendored: Font Awesome, Google Fonts (Fira Code plus Share Tech Mono), and an ElevenLabs conversational widget (`matrix/index.html:1698`, agent id inline; script at `:3350`).

The professional surface loads exactly one external resource: the Fira Code Google Fonts stylesheet. Body prose sets in a system sans stack on purpose, so adding a webfont for it would be a regression. Do not add a dependency, a bundler, or a framework to this repo.

## Pre-existing Matrix defects, deliberately unfixed

Documented so they are not rediscovered from scratch. These are on the frozen surface and were left alone on purpose:

- `closeAI()` in `assets/js/main.js` dereferences `getElementById('aiModal')`, which matches no element, so it throws on every Escape keypress. Not in the older defect list; found during this work.
- `/matrix/` emits a benign WebGL driver warning in the console.
- `components.css:147` has `.mobile-menu { display: flex !important }` outside its media query, so the hamburger renders at all widths.
- 19 `details` links are dead: `event.stopPropagation()` blocks the card's `openModal` and `href="#"` throws in the scroll handler.
- `assets/favicon.ico` is 0 bytes; the valid `assets/favicon.svg` is referenced only by the professional surface.
- Three `highlight-*` modals and the `#education` section are orphaned.
