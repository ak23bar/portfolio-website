# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

There is no build system, package manager, linter, or test suite. The repo is plain static files served as-is.

```bash
python3 -m http.server 8001      # serve locally, then open http://localhost:8001/
```

Deployment is Cloudflare Pages (`ak23bar.pages.dev`), connected to the GitHub repo with no build command — pushing to the deployed branch publishes the files verbatim.

Because there are no tests, verification means loading the page in a browser, checking the console is clean, and clicking the specific card/modal you touched.

## Architecture

`index.html` (~3.4k lines) is the entire site: every section *and* all 47 modals live in it. `assets/js/` and `assets/css/` are supporting layers only.

**The card/modal duplication is the central pattern.** Each role and project appears twice in `index.html`:

1. A summary card — `<div class="timeline-item" onclick="openModal('modal-ahead')">` or `<div class="project-card" onclick="openModal('project-codelingo')">` — inside its section.
2. A full detail block — `<div id="modal-ahead" class="modal">` — in the modal pile that starts around line 1728.

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
- **`main.js` `versionConfig`** (~line 1662) — `initVersionDisplay()` overwrites the version markup hardcoded at `index.html:104-110` on DOMContentLoaded. Update both, or the tooltip renders stale text before the script runs.
- **`branch-meta` spans** in the experience tree (`index.html:458`, `515`, `572`, `641`, `736`) — hand-written counts like `4 roles · AHEAD, Talent Strategy Experts, …`. Adding or removing a role does not update them.
- **`professional-stats`** (`index.html:183`) — hand-maintained `20+` / `30+` / `500+` totals.
- **Dates reading `- Present`** — grep `date-location.*Present` and cross-check against the `current_roles` cards; the two drift apart when a role ends. Each date also appears again in that role's modal as `<strong>Duration:</strong>`.

## Styling

Three stylesheets load in order: `styles.css` → `components.css` → `responsive.css`. The split is loose and the files overlap — `.nav-container` is defined in both `styles.css` and `components.css`, and media queries appear in all three despite `responsive.css` existing. Later files win, so check for a competing rule in `components.css` before debugging a `styles.css` selector that seems ignored.

`styles.css` is indented 8 spaces throughout, a leftover from being extracted out of an inline `<style>` block. There are also ~330 inline `style="..."` attributes in `index.html` (modal bodies are styled almost entirely inline) and a small `<style>` block at `index.html:1716` holding two keyframes. Match whichever approach the surrounding markup already uses rather than normalizing.

Theme is Matrix-inspired: `#00ff41` green on black, `#ff0040` red for hover states, Fira Code / Share Tech Mono.

## External dependencies

All loaded from CDNs, none vendored: Font Awesome, Google Fonts, and an ElevenLabs conversational widget (`index.html:1696`, agent id inline).
