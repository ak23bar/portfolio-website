# Professional Front Door Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a restrained, fast, accessible professional surface at `akaman.dev/` while relocating the existing Matrix portfolio to `akaman.dev/matrix/` completely intact.

**Architecture:** Two standalone static documents that share no CSS and no JS. The new `/index.html` loads only `assets/css/pro.css` and `assets/js/pro.js`. `/matrix/index.html` is today's file moved, with 11 asset paths and 6 URL references updated and nothing else changed. Because the new document never loads the Matrix stylesheets, the repo's 307 hardcoded `#00ff41` values and 328 inline `style=` attributes require no refactor.

**Tech Stack:** Hand-written HTML5, CSS with custom properties, vanilla ES6. No build step, no package manager, no framework. Cloudflare Pages static hosting.

**Spec:** `docs/superpowers/specs/2026-08-23-professional-front-door-design.md`

## Global Constraints

- **Branch:** all work on `feat/professional-surface`, cut from `updates`. Never commit directly to `updates` — Cloudflare Pages builds production from it, so a mid-plan commit deploys a broken root. The merge to `updates` is the atomic rollout event.
- **No build step.** No `package.json`, no `node_modules`, no bundler, no CDN JS beyond what already exists. Serve with `python3 -m http.server 8001`.
- **No test framework exists.** Verification is executable `curl`/`grep` assertions plus named browser checks. Every task's check must fail before the change and pass after.
- **The Matrix surface is frozen.** The only permitted edits inside `matrix/index.html` and `assets/js/main.js` are the 11 asset paths (Task 1) and the 6 URL references across 5 lines (Task 2). No restyling, no refactoring, no bug fixes, no removing the inert `<meta http-equiv>` cache tags. Every defect listed in spec §14 stays exactly as it is.
- **Canonical host:** `akaman.dev`. Pro surface canonical is `https://akaman.dev/`; Matrix canonical is `https://akaman.dev/matrix/`.
- **Palette, exact values:** `--bg #0a0a0a`, `--surface #111111`, `--hairline #1f1f1f`, `--text #e8e8e8`, `--text-muted #8a8a8a`, `--accent #7ee787`. Do not substitute. `#00ff41` must appear **zero** times in `index.html`, `pro.css`, and `pro.js`.
- **Focus rings use `--accent`, never `--hairline`.** `--hairline` is 1.20:1 against `--bg`, below the WCAG 1.4.11 3:1 threshold, so it may only ever be decorative.
- **Zero inline `onclick`** in the new `index.html`. Zero inline `style=` attributes in the new `index.html`.
- **Motion budget:** one duration (150ms), one easing (`ease`), applied only to `opacity`, `transform`, `color`, `border-color`. All of it disabled under `prefers-reduced-motion: reduce`.
- **Forbidden on the pro surface:** matrix rain, loading screen, typing animation, animated counters, the `20+`/`30+`/`500+` stats, skill progress bars, skill clouds, gradients, glassmorphism, box-shadows, scroll-jacking, reveal-on-scroll, fake AI chat, hero photograph, `<meta name="keywords">`.

---

## File Structure

| Path | Status | Responsibility |
|---|---|---|
| `index.html` | create | The entire professional surface: head/meta/JSON-LD, header, hero, systems, capabilities, experience, footer. Single document, ~250 lines. |
| `assets/css/pro.css` | create | Token layer, reset, typography, and every component style for the pro surface. ~320 lines. The only stylesheet `/` loads. |
| `assets/js/pro.js` | create | Command palette only. ~110 lines. No other behavior. |
| `matrix/index.html` | move from `index.html` | Unchanged Matrix surface. Edits limited to 8 asset paths + 7 URLs + 1 canonical. |
| `assets/js/main.js` | modify (3 lines) | Lines 1217, 1222, 1479 — resume paths gain a leading slash. |
| `_headers` | create | Real HTTP caching policy. 6 lines. |
| `robots.txt` | create | Allow all, point at sitemap. |
| `sitemap.xml` | create | Two URLs: `/` and `/matrix/`. |
| `assets/files/og-professional.png` | create | 1200×630 OG card. Replaces `neo.png` as the pro surface's share image. |
| `CLAUDE.md` | modify | Architecture section no longer says `index.html` is the entire site; drift list gains the two-surface entry. |

Untouched: `assets/css/styles.css`, `components.css`, `responsive.css`, `assets/js/modals.js`, `README.md`, everything in `assets/files/` except the new OG image.

---

## Task 1: Relocate the Matrix surface to /matrix/

**Files:**
- Move: `index.html` → `matrix/index.html`
- Modify: `matrix/index.html` (8 asset references)
- Modify: `assets/js/main.js:1217,1222,1479`

**Interfaces:**
- Consumes: nothing.
- Produces: a working Matrix surface at `/matrix/`. All later tasks assume `/index.html` is free.

Every asset reference in the current document is document-root-relative *without* a leading slash, so it resolves against the document's directory. Once the document sits at `/matrix/`, `assets/css/styles.css` resolves to `/matrix/assets/css/styles.css` and 404s. Adding a leading slash makes each reference host-absolute.

Do **not** use `<base href="/">` as a shortcut. It would also re-root the ~10 in-page `href="#projects"` anchors into `/#projects`, navigating away from `/matrix/` and breaking the Matrix's own navigation.

- [ ] **Step 1: Cut the branch**

```bash
git checkout updates
git status --porcelain   # expect: docs/superpowers/ untracked or staged only
git checkout -b feat/professional-surface
```

- [ ] **Step 2: Write the failing check**

Save as `/tmp/check-matrix.sh`:

```bash
#!/usr/bin/env bash
# Asserts the Matrix surface and every asset it needs resolve at /matrix/.
BASE=http://localhost:8001
fail=0
check() {
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$1")
  if [ "$code" = "200" ]; then echo "  ok   $1"; else echo "  FAIL $1 -> $code"; fail=1; fi
}
echo "Matrix surface:"
check /matrix/
check /assets/css/styles.css
check /assets/css/components.css
check /assets/css/responsive.css
check /assets/js/main.js
check /assets/js/modals.js
check /assets/files/neo.png
check /assets/files/Akbar_Resume.pdf
echo "Relative-path regression (these MUST 404):"
for p in /matrix/assets/css/styles.css /matrix/assets/js/main.js /matrix/assets/files/neo.png; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")
  if [ "$code" = "404" ]; then echo "  ok   $p 404s as expected"; else echo "  FAIL $p -> $code (paths still relative)"; fail=1; fi
done
exit $fail
```

```bash
chmod +x /tmp/check-matrix.sh
```

- [ ] **Step 3: Run the check to verify it fails**

```bash
python3 -m http.server 8001 --directory . >/tmp/serve.log 2>&1 &
sleep 1
/tmp/check-matrix.sh; echo "exit=$?"
```

Expected: `FAIL /matrix/ -> 404` and a non-zero exit. The directory does not exist yet.

- [ ] **Step 4: Move the file**

```bash
mkdir -p matrix
git mv index.html matrix/index.html
```

- [ ] **Step 5: Rewrite the 8 asset references**

These are the only `assets/`-prefixed references in the document. Anchor each replacement on the attribute so nothing else is touched.

```bash
sed -i \
  -e 's|href="assets/css/styles.css"|href="/assets/css/styles.css"|' \
  -e 's|href="assets/css/components.css"|href="/assets/css/components.css"|' \
  -e 's|href="assets/css/responsive.css"|href="/assets/css/responsive.css"|' \
  -e 's|src="assets/js/main.js"|src="/assets/js/main.js"|' \
  -e 's|src="assets/js/modals.js"|src="/assets/js/modals.js"|' \
  -e 's|src="assets/files/neo.png"|src="/assets/files/neo.png"|' \
  -e 's|href="assets/files/Akbar_Resume.pdf"|href="/assets/files/Akbar_Resume.pdf"|g' \
  matrix/index.html
```

Verify the count — expect `0` remaining relative refs and `8` absolute ones:

```bash
echo "relative left: $(grep -c 'href="assets/\|src="assets/' matrix/index.html)"
echo "absolute now:  $(grep -o 'href="/assets/\|src="/assets/' matrix/index.html | wc -l)"
```

Expected: `relative left: 0`, `absolute now: 8`.

- [ ] **Step 6: Rewrite the 3 resume paths in main.js**

`main.js` is loaded only by the Matrix document, so this is safe. All three are `window.open` calls.

```bash
sed -i "s|window.open('assets/files/Akbar_Resume.pdf'|window.open('/assets/files/Akbar_Resume.pdf'|g" assets/js/main.js
grep -n "Akbar_Resume.pdf" assets/js/main.js
```

Expected: three lines (1217, 1222, 1479), each now `'/assets/files/Akbar_Resume.pdf'`.

- [ ] **Step 7: Run the check to verify it passes**

```bash
/tmp/check-matrix.sh; echo "exit=$?"
```

Expected: every line `ok`, `exit=0`.

- [ ] **Step 8: Browser verification of the Matrix surface**

Load `http://localhost:8001/matrix/` and confirm all of the following. This is the regression gate for the whole plan — the Matrix must be indistinguishable from before the move.

1. Loading screen plays and dismisses; "WELCOME TO THE MATRIX..." appears
2. Matrix rain renders behind the content
3. Neo image renders in the hero (not a broken-image icon)
4. **Console is completely clean** — zero 404s, zero errors
5. Network panel: all three stylesheets and both scripts resolve from `/assets/`
6. Terminal opens via the quick-action button; `ls`, `cd projects`, `cat bio.txt`, `tree` all respond
7. `resume` in the terminal opens the PDF (this exercises the Step 6 fix)
8. Clicking the GPS project card opens the `project-enterprise-rag` modal; Escape closes it
9. Clicking an experience card opens its modal
10. The version badge reads `v1.9`

If Playwright is available, capture console errors programmatically:

```
browser_navigate → http://localhost:8001/matrix/
browser_console_messages   → assert zero entries of type "error"
browser_take_screenshot    → visual confirmation of rain + hero
```

- [ ] **Step 9: Commit**

```bash
git add matrix/index.html assets/js/main.js
git commit -m "refactor: relocate Matrix surface to /matrix/

Moves the existing portfolio document into a subdirectory so the root is
free for a professional surface. Every asset reference was
document-root-relative without a leading slash, so 8 refs in the document
and 3 window.open calls in main.js are now host-absolute.

Deliberately avoids <base href=\"/\">, which would also re-root the
in-page #anchors and break the Matrix's own navigation.

No other change to the Matrix surface."
```

---

## Task 2: Canonicalize the Matrix surface onto akaman.dev

**Files:**
- Modify: `matrix/index.html` (3 head references, 3 body references across 2 lines, 1 new canonical)

**Interfaces:**
- Consumes: `matrix/index.html` at its new path (Task 1).
- Produces: a Matrix surface that never competes with `/` in search results.

`akaman.dev` is live on Pages but appears nowhere in the document. Six references across five lines point at `ak23bar.pages.dev` — `og:url` (line 17), `og:image` (18), `twitter:image` (25), a "live demo" link (1278), and a "Live URL" link whose href *and* visible link text both carry the host (3286). Leaving them means shares of the Matrix URL advertise the wrong host and the two surfaces can compete for the same query.

**Scope guard:** this task changes URLs only. The three `<meta http-equiv="Cache-Control">` tags at the top of the head are inert (browsers ignore `http-equiv` for HTTP caching) but they stay — spec §14 freezes everything in the Matrix beyond asset paths and URLs. Real caching arrives in Task 3 via `_headers`.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-canonical.sh <<'EOF'
#!/usr/bin/env bash
fail=0
stale=$(grep -c 'ak23bar.pages.dev' matrix/index.html)
if [ "$stale" = "0" ]; then echo "  ok   no stale pages.dev refs"; else echo "  FAIL $stale stale ak23bar.pages.dev refs remain"; fail=1; fi
if grep -q 'rel="canonical" href="https://akaman.dev/matrix/"' matrix/index.html; then
  echo "  ok   canonical present"; else echo "  FAIL canonical missing"; fail=1; fi
if grep -q 'content="https://akaman.dev/matrix/"' matrix/index.html; then
  echo "  ok   og:url updated"; else echo "  FAIL og:url not updated"; fail=1; fi
exit $fail
EOF
chmod +x /tmp/check-canonical.sh
```

- [ ] **Step 2: Run the check to verify it fails**

```bash
/tmp/check-canonical.sh; echo "exit=$?"
```

Expected: `FAIL 5 stale ak23bar.pages.dev refs remain` (grep -c counts lines; there are
6 occurrences across those 5 lines), canonical missing, non-zero exit.

- [ ] **Step 3: Rewrite the URLs**

The `og:url` becomes the Matrix's own address; the two image URLs keep `neo.png` (correct for this surface — it *is* the Matrix identity) but move host; the two body links point at the live site root.

```bash
sed -i \
  -e 's|content="https://ak23bar.pages.dev"|content="https://akaman.dev/matrix/"|' \
  -e 's|content="https://ak23bar.pages.dev/assets/files/neo.png"|content="https://akaman.dev/assets/files/neo.png"|g' \
  -e 's|href="https://ak23bar.pages.dev"|href="https://akaman.dev"|g' \
  -e 's|>ak23bar.pages.dev<|>akaman.dev<|g' \
  matrix/index.html
grep -n 'ak23bar.pages.dev' matrix/index.html || echo "none remaining"
```

Expected: `none remaining`.

- [ ] **Step 4: Add the canonical link**

Insert immediately after the closing `</title>` tag:

```bash
sed -i 's|</title>|</title>\n    <link rel="canonical" href="https://akaman.dev/matrix/">|' matrix/index.html
grep -n 'rel="canonical"' matrix/index.html
```

Expected: exactly one match.

- [ ] **Step 5: Run the check to verify it passes**

```bash
/tmp/check-canonical.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 6: Confirm nothing else moved**

```bash
git diff --stat matrix/index.html
```

Expected: a single file, roughly 6 insertions and 5 deletions. If the line count is materially larger, `sed` caught something it should not have — inspect `git diff` before continuing.

- [ ] **Step 7: Commit**

```bash
git add matrix/index.html
git commit -m "fix: canonicalize the Matrix surface onto akaman.dev

The document had no knowledge of the live domain: six references across
five lines still pointed at ak23bar.pages.dev. Adds an explicit canonical so /matrix/ never
competes with / in search results.

The inert meta http-equiv cache tags are intentionally left in place; real
caching arrives via _headers."
```

---

## Task 3: Real HTTP caching policy

**Files:**
- Create: `_headers`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing later tasks depend on. Independently rejectable.

The document's three `<meta http-equiv="Cache-Control">` tags are ignored by browsers for HTTP caching, so the site currently has *no* caching policy while appearing to set one. Cloudflare Pages reads a root `_headers` file and applies it at the edge.

Hashed filenames do not exist here, so `assets/*` cannot be `immutable` — a year-long cache would strand visitors on stale CSS after a deploy. One day with `must-revalidate` gives the CDN benefit while keeping deploys effective.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-headers.sh <<'EOF'
#!/usr/bin/env bash
fail=0
[ -f _headers ] && echo "  ok   _headers exists" || { echo "  FAIL _headers missing"; fail=1; }
grep -q '^/assets/\*' _headers 2>/dev/null && echo "  ok   assets rule present" || { echo "  FAIL no /assets/* rule"; fail=1; }
grep -q 'X-Content-Type-Options' _headers 2>/dev/null && echo "  ok   nosniff present" || { echo "  FAIL no nosniff"; fail=1; }
exit $fail
EOF
chmod +x /tmp/check-headers.sh
/tmp/check-headers.sh; echo "exit=$?"
```

Expected: `FAIL _headers missing`, non-zero exit.

- [ ] **Step 2: Create the file**

```bash
cat > _headers <<'EOF'
/assets/*
  Cache-Control: public, max-age=86400, must-revalidate

/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
EOF
```

- [ ] **Step 3: Run the check to verify it passes**

```bash
/tmp/check-headers.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 4: Note the deferred verification**

`python3 -m http.server` does not read `_headers`, so the effect is unverifiable locally. This is confirmed at Task 13 Step 5 against the Cloudflare preview deploy with `curl -sI`. Do not claim it works before then.

- [ ] **Step 5: Commit**

```bash
git add _headers
git commit -m "feat: add real HTTP caching policy via _headers

The three meta http-equiv Cache-Control tags in the document are ignored
by browsers, so the site had no caching policy at all despite appearing to
set one. Assets get a one-day revalidating cache; HTML always revalidates.

Assets are not content-hashed, so 'immutable' is deliberately avoided --
it would strand visitors on stale CSS after a deploy."
```

---

## Task 4: Token layer, reset, and base typography

**Files:**
- Create: `assets/css/pro.css`

**Interfaces:**
- Consumes: nothing.
- Produces: the custom properties `--bg --surface --hairline --text --text-muted --accent --font-sans --font-mono --dur --measure`, and base element styling. Every later CSS task extends this file and must use these tokens rather than literals.

This is the token layer the handoff wanted, built fresh on an empty file instead of retrofitted onto 3,400 lines.

The typographic decision matters more than any other here: prose sets in a system sans stack at zero network cost, and Fira Code is reserved for labels, metadata, and the terminal motif. Mono-everything reads as a theme; mono-as-accent reads as taste.

Contrast is already measured and settled — `--text` 16.16:1, `--accent` 12.89:1, `--text-muted` 5.73:1, all against `--bg`. `--hairline` is 1.20:1 and is therefore **decorative only**: a card must stay perceivable without it, and focus rings must never rely on it.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-tokens.sh <<'EOF'
#!/usr/bin/env bash
F=assets/css/pro.css
fail=0
[ -f $F ] || { echo "  FAIL $F missing"; exit 1; }
for t in --bg --surface --hairline --text --text-muted --accent --font-sans --font-mono --dur --measure; do
  grep -q -- "$t:" $F && echo "  ok   $t defined" || { echo "  FAIL $t undefined"; fail=1; }
done
n=$(grep -c '#00ff41' $F); [ "$n" = "0" ] && echo "  ok   no matrix green" || { echo "  FAIL $n matrix green"; fail=1; }
grep -q 'prefers-reduced-motion' $F && echo "  ok   reduced-motion honored" || { echo "  FAIL no reduced-motion"; fail=1; }
grep -q ':focus-visible' $F && echo "  ok   focus-visible styled" || { echo "  FAIL no focus-visible"; fail=1; }
exit $fail
EOF
chmod +x /tmp/check-tokens.sh
/tmp/check-tokens.sh; echo "exit=$?"
```

Expected: `FAIL assets/css/pro.css missing`.

- [ ] **Step 2: Write the token layer and base**

```bash
cat > assets/css/pro.css <<'EOF'
/* Professional surface. Loaded only by /index.html.
   Deliberately shares nothing with the Matrix stylesheets. */

:root {
    --bg:          #0a0a0a;
    --surface:     #111111;
    --hairline:    #1f1f1f;
    --hairline-lit:#2e2e2e;
    --text:        #e8e8e8;
    --text-muted:  #8a8a8a;
    --accent:      #7ee787;

    --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", sans-serif;
    --font-mono: "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace;

    --dur: 150ms;
    --measure: 68ch;
    --col: 720px;
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: clamp(1rem, 0.97rem + 0.15vw, 1.0625rem);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
}

/* Single measure. Whitespace is the primary structural device. */
.wrap {
    width: 100%;
    max-width: var(--col);
    margin-inline: auto;
    padding-inline: 1.5rem;
}

h1, h2, h3 { line-height: 1.2; margin: 0; font-weight: 600; letter-spacing: -0.015em; }
h1 { font-size: clamp(2rem, 1.6rem + 2vw, 2.75rem); }
h2 { font-size: 0.8125rem; }
h3 { font-size: 1.0625rem; }

p { margin: 0 0 1rem; max-width: var(--measure); }
p:last-child { margin-bottom: 0; }

a { color: var(--text); text-decoration: none; border-bottom: 1px solid var(--hairline-lit); transition: color var(--dur) ease, border-color var(--dur) ease; }
a:hover { color: var(--accent); border-color: var(--accent); }

/* Focus rings use --accent (12.89:1), never --hairline (1.20:1, below the
   WCAG 1.4.11 3:1 threshold for non-text contrast). Never suppressed. */
:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 2px;
}

/* Mono is an accent, not the body voice: labels, metadata, tech lines,
   the wordmark, and the palette. */
.mono { font-family: var(--font-mono); font-variant-ligatures: none; }

.section-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: lowercase;
    color: var(--text-muted);
    margin: 0 0 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--hairline);
}

section { padding-block: clamp(3rem, 2rem + 4vw, 5rem); }

.skip-link {
    position: absolute; left: -9999px;
    background: var(--surface); color: var(--text);
    padding: 0.75rem 1rem; z-index: 100;
}
.skip-link:focus { left: 1rem; top: 1rem; }

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
    }
}
EOF
```

- [ ] **Step 3: Run the check to verify it passes**

```bash
/tmp/check-tokens.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 4: Commit**

```bash
git add assets/css/pro.css
git commit -m "feat: add token layer and base styles for the professional surface

Ten custom properties, a reset, and base typography. This is the token
layer the handoff called a prerequisite -- built fresh on an empty file
rather than retrofitted onto 3,400 lines, which the two-document
architecture makes unnecessary.

Prose sets in a system sans stack at zero network cost; Fira Code is
reserved for labels and metadata. Focus rings use --accent (12.89:1)
because --hairline is 1.20:1, below the 1.4.11 non-text threshold."
```

---

## Task 5: Document skeleton — head, JSON-LD, header, footer

**Files:**
- Create: `index.html`
- Modify: `assets/css/pro.css` (append header/footer styles)

**Interfaces:**
- Consumes: tokens from Task 4.
- Produces: `<main class="wrap">` as the insertion point for Tasks 6–9, and the ids `home`, `about`, `experience`, `projects`, `contact` reserved for fragment continuity. Produces `#palette-trigger` markup that Task 10's JS binds to.

The old site was one page, so any bookmark or shared link is either the bare root or a fragment. Reusing the five original section ids means `akaman.dev/#projects` still lands somewhere sensible, which is why no `_redirects` file is needed.

`<meta name="keywords">` is deliberately omitted — ignored by every major engine, and it reads as amateur to anyone who views source.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-skeleton.sh <<'EOF'
#!/usr/bin/env bash
F=index.html
fail=0
[ -f $F ] || { echo "  FAIL $F missing"; exit 1; }
h1=$(grep -c '<h1' $F); [ "$h1" = "1" ] && echo "  ok   exactly one h1" || { echo "  FAIL $h1 h1 elements"; fail=1; }
for n in onclick 'style="' '#00ff41' 'name="keywords"' matrixRain 'class="loading"'; do
  c=$(grep -c "$n" $F); [ "$c" = "0" ] && echo "  ok   no $n" || { echo "  FAIL $c x $n"; fail=1; }
done
for n in 'rel="canonical"' 'application/ld+json' 'og:image' 'skip-link' '<main'; do
  grep -q "$n" $F && echo "  ok   $n present" || { echo "  FAIL $n missing"; fail=1; }
done
grep -q 'pro.css' $F && echo "  ok   loads pro.css" || { echo "  FAIL pro.css not linked"; fail=1; }
for s in styles.css components.css responsive.css main.js modals.js; do
  grep -q "$s" $F && { echo "  FAIL leaks matrix asset $s"; fail=1; } || echo "  ok   no $s"
done
for id in home about experience projects contact; do
  grep -q "id=\"$id\"" $F && echo "  ok   #$id preserved" || { echo "  FAIL #$id missing"; fail=1; }
done
exit $fail
EOF
chmod +x /tmp/check-skeleton.sh
/tmp/check-skeleton.sh; echo "exit=$?"
```

Expected: `FAIL index.html missing`.

- [ ] **Step 2: Create the document**

Section bodies are intentionally empty here; Tasks 6–9 fill them. The ids and the `wrap` scaffolding land now so each later task is a single focused insertion.

```bash
cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Akbar Aman — AI &amp; Systems Engineer</title>
<meta name="description" content="Akbar Aman is an AI and systems engineer building governed AI platforms, agent runtimes, production backends, and embedded systems. Selected work, experience, and contact.">
<meta name="author" content="Akbar Aman">
<link rel="canonical" href="https://akaman.dev/">

<meta property="og:type" content="profile">
<meta property="og:title" content="Akbar Aman — AI &amp; Systems Engineer">
<meta property="og:description" content="Governed AI platforms, agent runtimes, production backends, and embedded systems.">
<meta property="og:url" content="https://akaman.dev/">
<meta property="og:image" content="https://akaman.dev/assets/files/og-professional.png">
<meta property="og:image:alt" content="Akbar Aman — AI & Systems Engineer">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Akbar Aman — AI &amp; Systems Engineer">
<meta name="twitter:description" content="Governed AI platforms, agent runtimes, production backends, and embedded systems.">
<meta name="twitter:image" content="https://akaman.dev/assets/files/og-professional.png">

<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/pro.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Akbar Aman",
  "jobTitle": "AI & Systems Engineer",
  "url": "https://akaman.dev/",
  "sameAs": [
    "https://github.com/ak23bar",
    "https://linkedin.com/in/akbar-aman-94b1b6263"
  ]
}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="wordmark mono" href="/" aria-label="Akbar Aman, home">akbar@akaman</a>
    <nav class="site-nav" aria-label="Primary">
      <a href="#projects">work</a>
      <a href="#experience">experience</a>
      <a href="/assets/files/Akbar_Resume.pdf">resume</a>
      <a class="matrix-entry mono" href="/matrix/" title="Alternate interface">&gt;_</a>
    </nav>
  </div>
</header>

<main id="main">

  <section id="home" class="hero"></section>

  <section id="projects" class="systems"></section>

  <section id="about" class="capabilities"></section>

  <section id="experience" class="experience"></section>

</main>

<footer id="contact" class="site-footer">
  <div class="wrap">
    <h2 class="section-label">contact</h2>
    <p>Open to engineering roles, consulting engagements, and collaboration.
       Email is the best starting point.</p>
    <ul class="footer-links">
      <li><a href="mailto:akbaraman797@gmail.com">akbaraman797@gmail.com</a></li>
      <li><a href="https://github.com/ak23bar">GitHub</a></li>
      <li><a href="https://linkedin.com/in/akbar-aman-94b1b6263">LinkedIn</a></li>
      <li><a href="/assets/files/Akbar_Resume.pdf">Resume</a></li>
    </ul>
    <p class="alt-interface mono">
      This site has an <a href="/matrix/">alternate interface</a>.
    </p>
  </div>
</footer>

<script src="/assets/js/pro.js" defer></script>
</body>
</html>
EOF
```

- [ ] **Step 3: Append header and footer styles**

```bash
cat >> assets/css/pro.css <<'EOF'

/* ---- header ---- */
.site-header { border-bottom: 1px solid var(--hairline); }
.header-inner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; min-height: 64px;
}
.wordmark { font-size: 0.875rem; color: var(--text); border-bottom: none; }
.wordmark:hover { color: var(--accent); }
.site-nav { display: flex; align-items: center; gap: 1.25rem; }
.site-nav a {
    font-size: 0.875rem; color: var(--text-muted); border-bottom: none;
    min-height: 44px; display: inline-flex; align-items: center;
}
.site-nav a:hover { color: var(--accent); }
.matrix-entry { font-size: 1rem; }

/* ---- footer ---- */
.site-footer {
    border-top: 1px solid var(--hairline);
    padding-block: clamp(3rem, 2rem + 4vw, 5rem);
}
.footer-links {
    list-style: none; margin: 1.5rem 0 0; padding: 0;
    display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem;
    font-family: var(--font-mono); font-size: 0.875rem;
}
.footer-links a { min-height: 44px; display: inline-flex; align-items: center; }
.alt-interface {
    margin-top: 2.5rem; font-size: 0.8125rem; color: var(--text-muted);
}
.alt-interface a { color: var(--text-muted); }
EOF
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-skeleton.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`. In particular every Matrix asset line must read `ok   no <asset>` — a leak there means the pro surface would inherit matrix rain styling.

- [ ] **Step 5: Confirm both surfaces coexist**

```bash
for p in / /matrix/ /assets/css/pro.css; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8001$p)"
done
```

Expected: all `200`.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/pro.css
git commit -m "feat: add professional surface skeleton at /

Head with canonical, OG tags, and Person JSON-LD; header with the
akbar@akaman wordmark and a >_ Matrix entrance; footer with contact links
and an understated alternate-interface line.

Reuses the five original section ids (home, about, experience, projects,
contact) so old fragment links still land somewhere sensible -- which is
why no _redirects file is needed.

meta name=keywords deliberately omitted: ignored by every major engine."
```

---

## Task 6: Hero

**Files:**
- Modify: `index.html` (fill `#home`)
- Modify: `assets/css/pro.css` (append hero styles)

**Interfaces:**
- Consumes: `.wrap`, tokens, `.section-label`, `.mono`.
- Produces: nothing later tasks depend on.

Must fit above the fold at 1440×900 and, at 375×667, must not push the positioning line below the viewport. No photograph — all five reference sites lead with words, and it unblocks the surface immediately.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-hero.sh <<'EOF'
#!/usr/bin/env bash
fail=0
grep -q 'AI &amp; Systems Engineer</p>' index.html && echo "  ok   positioning line" || { echo "  FAIL no positioning line"; fail=1; }
grep -q 'Enterprise AI Engineering Intern' index.html && echo "  ok   current role" || { echo "  FAIL no current role"; fail=1; }
for n in '20+' '30+' '500+' '<img'; do
  c=$(grep -c -- "$n" index.html); [ "$c" = "0" ] && echo "  ok   no $n" || { echo "  FAIL $c x $n"; fail=1; }
done
exit $fail
EOF
chmod +x /tmp/check-hero.sh
/tmp/check-hero.sh; echo "exit=$?"
```

Expected: failures on the positioning line and current role.

- [ ] **Step 2: Fill the hero**

Replace the empty hero element:

```bash
python3 - <<'PY'
import re, pathlib
p = pathlib.Path('index.html')
s = p.read_text()
hero = '''<section id="home" class="hero">
    <div class="wrap">
      <h1>Akbar Aman</h1>
      <p class="positioning mono">AI &amp; Systems Engineer</p>
      <p class="hero-thesis">I build systems where AI has to be accountable to
        something concrete: a typed contract, an approval gate, an audit trail,
        or a fixed hardware budget. That work runs from governed agent runtimes
        and production backends down to firmware and models compiled onto FPGAs.
        What interests me is the constraint that makes a system trustworthy
        after it ships, not the demo that makes it look clever before.</p>
      <p class="hero-role mono">Enterprise AI Engineering Intern &middot; AHEAD</p>
      <ul class="hero-actions">
        <li><a href="/assets/files/Akbar_Resume.pdf">Resume</a></li>
        <li><a href="https://github.com/ak23bar">GitHub</a></li>
        <li><a href="mailto:akbaraman797@gmail.com">Email</a></li>
      </ul>
    </div>
  </section>'''
s = s.replace('<section id="home" class="hero"></section>', hero, 1)
p.write_text(s)
print("hero inserted")
PY
```

- [ ] **Step 3: Append hero styles**

```bash
cat >> assets/css/pro.css <<'EOF'

/* ---- hero ---- */
.hero { padding-block: clamp(3.5rem, 2.5rem + 5vw, 7rem) clamp(3rem, 2rem + 4vw, 5rem); }
.positioning {
    margin: 0.75rem 0 2rem; font-size: 1rem;
    color: var(--accent); letter-spacing: 0.02em;
}
.hero-thesis { color: var(--text); font-size: 1.0625rem; }
.hero-role {
    margin-top: 2rem; font-size: 0.8125rem; color: var(--text-muted);
}
.hero-actions {
    list-style: none; margin: 2rem 0 0; padding: 0;
    display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem;
    font-family: var(--font-mono); font-size: 0.875rem;
}
.hero-actions a { min-height: 44px; display: inline-flex; align-items: center; }
EOF
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-hero.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 5: Verify the fold**

Load `http://localhost:8001/` at 1440×900 and at 375×667. Confirm at both sizes that the `h1`, the positioning line, and at least the first two lines of the thesis are visible without scrolling. Confirm no image requests appear in the network panel.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/pro.css
git commit -m "feat: add hero to the professional surface

Name, positioning line, a three-sentence thesis, current role, and three
actions. No photograph, no typing animation, no counters -- the 20+/30+/500+
stats stay on the Matrix surface, since breadth-by-counting is the exact
framing this repositioning is meant to drop."
```

---

## Task 7: Selected systems

**Files:**
- Modify: `index.html` (fill `#projects`)
- Modify: `assets/css/pro.css` (append card styles)

**Interfaces:**
- Consumes: `.wrap`, `.section-label`, tokens.
- Produces: nothing later tasks depend on.

This is the task the whole surface rests on. The engineering is trivial; the prose is the deliverable. Six systems, one per positioning axis — the mapping *is* the curation rationale, so no two cards compete to prove the same thing and every claimed axis has evidence attached.

Bullets state **engineering decisions and constraints, not features.** The existing Matrix cards list 10–14 tech tags each, which is skill-cloud-adjacent; these are capped at five.

Single column, not a grid. Each card states a thesis and a thesis needs a full measure of text. A 3-up grid forces every card to identical dimensions, which makes them read as equally weighted — the failure mode this repositioning exists to avoid.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-systems.sh <<'EOF'
#!/usr/bin/env bash
fail=0
n=$(grep -c 'class="system"' index.html)
[ "$n" = "6" ] && echo "  ok   exactly 6 systems" || { echo "  FAIL $n systems (want 6)"; fail=1; }
for t in "Governed Platform for Support" "Pocket Brain" "MLS Property Platform" "hls4ml" "Ultra Heat Sensor" "Quantitative ML"; do
  grep -q "$t" index.html && echo "  ok   $t" || { echo "  FAIL missing $t"; fail=1; }
done
for t in "Fibinaci" "AI-EDGE"; do
  grep -q "$t" index.html && { echo "  FAIL $t should be demoted to Matrix"; fail=1; } || echo "  ok   $t not promoted"
done
grep -q 'source confidential' index.html && echo "  ok   GPS confidentiality" || { echo "  FAIL GPS source note missing"; fail=1; }
grep -q 'matrix/#projects' index.html && echo "  ok   see-all-work link" || { echo "  FAIL no link to full corpus"; fail=1; }
max=$(grep -o '<li>[^<]*</li>' index.html | wc -l)
echo "  info $max total list items"
exit $fail
EOF
chmod +x /tmp/check-systems.sh
/tmp/check-systems.sh; echo "exit=$?"
```

Expected: `FAIL 0 systems (want 6)`.

- [ ] **Step 2: Fill the systems section**

```bash
python3 - <<'PY'
import pathlib
p = pathlib.Path('index.html')
s = p.read_text()

systems = '''<section id="projects" class="systems">
    <div class="wrap">
      <h2 class="section-label">selected systems</h2>

      <article class="system system--lead">
        <h3>Governed Platform for Support (GPS)</h3>
        <p class="system-thesis">A provider-agnostic platform that treats agent
          behaviour as something to authorize, bound, and audit rather than
          something to prompt.</p>
        <ul class="system-notes">
          <li>Agent runtime kept provider-agnostic, so the governing logic never
            couples to a single model vendor.</li>
          <li>Decisions cross explicit typed contracts instead of being parsed
            back out of free-form text.</li>
          <li>Consequential actions block on human approval as a structural gate,
            not a post-hoc review step.</li>
          <li>Tool authorization resolves deterministically, so the same request
            cannot be permitted in one run and denied in another.</li>
        </ul>
        <p class="system-tech mono">Python &middot; FastAPI &middot; PostgreSQL/pgvector &middot; RAG &middot; LLM orchestration</p>
        <p class="system-evidence mono">source confidential &mdash; personal IP</p>
      </article>

      <article class="system">
        <h3>Pocket Brain</h3>
        <p class="system-thesis">An offline conversational assistant that holds a
          quantized LLM inside a fixed hardware budget.</p>
        <ul class="system-notes">
          <li>CPU-only execution under a hard 8&nbsp;GB RAM ceiling, chosen as a
            design constraint rather than accepted as a fallback.</li>
          <li>Sliding-window context with bounded growth, so latency stays
            predictable across a long session.</li>
          <li>Quantized open-weight models behind one local API, swappable
            without touching callers.</li>
        </ul>
        <p class="system-tech mono">Python &middot; GGUF &middot; quantized inference &middot; local API</p>
        <p class="system-evidence mono"><a href="https://github.com/ak23bar/Pocket-Brain">github.com/ak23bar/Pocket-Brain</a></p>
      </article>

      <article class="system">
        <h3>Full-Stack MLS Property Platform</h3>
        <p class="system-thesis">A live property search platform running on
          continuously synchronized MLS data, built and led end to end.</p>
        <ul class="system-notes">
          <li>OAuth 2.0 against the Trestle API with hourly cron
            synchronization, holding 1,000+ listings current.</li>
          <li>Reads serve from the synchronized store rather than the upstream
            API, so search and filtering stay fast and quota-independent.</li>
          <li>Led six developers through the full lifecycle, from auth design to
            production deployment on Linux/Nginx.</li>
        </ul>
        <p class="system-tech mono">PHP &middot; MySQL &middot; Python &middot; Trestle API &middot; Linux/Nginx</p>
        <p class="system-evidence mono"><a href="https://akbar.califorsale.org">akbar.califorsale.org</a></p>
      </article>

      <article class="system">
        <h3>hls4ml Edge-AI FPGA Work</h3>
        <p class="system-thesis">Machine-learning models compiled toward FPGA
          deployment, where latency and resource utilization are the design
          constraints rather than afterthoughts.</p>
        <ul class="system-notes">
          <li>Trained models translated to synthesizable hardware through
            high-level synthesis.</li>
          <li>Self-balancing cartpole controller closing its loop in hardware on
            an FPGA testbed.</li>
          <li>Architecture chosen against gate count and latency budget, not
            accuracy alone.</li>
        </ul>
        <p class="system-tech mono">hls4ml &middot; FPGA &middot; HLS &middot; PyTorch/Keras</p>
        <p class="system-evidence mono"><a href="https://www.mccormick.northwestern.edu/news/articles/2024/09/hls4ml-summer-school-offers-students-training-in-edge-ai-hardware-accelerators/">Northwestern Engineering</a></p>
      </article>

      <article class="system">
        <h3>Ultra Heat Sensor Alarm System</h3>
        <p class="system-thesis">Bare-metal firmware on an ARM Cortex-M4F,
          event-driven so the core sleeps between interrupts.</p>
        <ul class="system-notes">
          <li>Non-blocking event scheduler with WFI power gating; no busy-wait
            anywhere in the main loop.</li>
          <li>Ultrasonic ranging via timer capture, temperature via ADC over
            I&sup2;C at 0.1&deg;F resolution.</li>
          <li>Written in C, dropping to ARM assembly only where the timing
            budget required it.</li>
        </ul>
        <p class="system-tech mono">C &middot; ARM assembly &middot; Tiva C TM4C123 &middot; PWM/ADC/I&sup2;C</p>
        <p class="system-evidence mono"><a href="https://github.com/ak23bar/Ultra_Heat_Sensor">github.com/ak23bar/Ultra_Heat_Sensor</a></p>
      </article>

      <article class="system">
        <h3>Quantitative ML Research Platform</h3>
        <p class="system-thesis">Research workspaces for market-data ML, built so
          results are reproducible rather than merely favourable.</p>
        <ul class="system-notes">
          <li>Data-hygiene pass ahead of feature engineering, since the leakage
            risk lives in the pipeline rather than the model.</li>
          <li>Mean-reversion strategy validation with documented backtests and
            portfolio metrics.</li>
          <li>Audits written so each experiment is re-runnable by someone
            else.</li>
        </ul>
        <p class="system-tech mono">Python &middot; Jupyter &middot; backtesting &middot; feature engineering</p>
        <p class="system-evidence mono"><a href="https://github.com/teklystudio/ml-track-ak23bar">ml-track</a> &middot; <a href="https://github.com/teklystudio/spring-lab-ak23bar">spring-lab</a></p>
      </article>

      <p class="see-all mono"><a href="/matrix/#projects">See all work &rarr;</a></p>
    </div>
  </section>'''

s = s.replace('<section id="projects" class="systems"></section>', systems, 1)
p.write_text(s)
print("systems inserted")
PY
```

- [ ] **Step 3: Append card styles**

```bash
cat >> assets/css/pro.css <<'EOF'

/* ---- selected systems ----
   Single column, not a grid: each card states a thesis, and a thesis needs a
   full measure of text. A grid forces identical dimensions, which makes every
   card read as equally weighted. */
.system {
    border: 1px solid var(--hairline);
    border-radius: 4px;
    padding: 1.75rem;
    margin-bottom: 1.25rem;
    background: var(--surface);
    transition: border-color var(--dur) ease;
}
.system:hover { border-color: var(--hairline-lit); }
.system--lead { padding: 2.25rem; }
.system h3 { margin-bottom: 0.75rem; }
.system-thesis { color: var(--text); }
.system-notes {
    margin: 1.25rem 0 0; padding-left: 1.1rem;
    max-width: var(--measure); color: var(--text-muted);
    font-size: 0.9375rem;
}
.system-notes li { margin-bottom: 0.5rem; }
.system-notes li::marker { color: var(--accent); }
.system-tech {
    margin-top: 1.25rem; font-size: 0.8125rem; color: var(--text-muted);
}
.system-evidence { margin-top: 0.5rem; font-size: 0.8125rem; }
.see-all { margin-top: 2rem; font-size: 0.875rem; }
EOF
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-systems.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`. The two demotion assertions matter: Fibinaci Agent Map is advisory work ("advising on platform scope, feasibility, and system design" per its own Matrix card), and AI-EDGE REU is a fellowship — as a project card it would present a credential where a system is expected. Both stay in Matrix at full detail.

- [ ] **Step 5: Read the copy aloud**

Load `/` and read all six theses in sequence. Each must answer "what is this system" in ownership terms. If any bullet describes a feature rather than a decision or constraint, rewrite it before committing — this is the section that decides whether the surface is credible to an experienced engineer, and no amount of CSS compensates for it.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/pro.css
git commit -m "feat: add six selected systems, one per positioning axis

The axis mapping is the curation rationale: governed AI, constrained local
runtime, production backend, ML/hardware co-design, embedded firmware, and
ML research each get exactly one card, so no two compete to prove the same
thing and every claimed axis has evidence attached.

Bullets state engineering decisions and constraints rather than features,
following the GPS modal's register. Tech lines capped at five tokens; the
Matrix cards run 10-14, which is skill-cloud-adjacent.

Fibinaci Agent Map and AI-EDGE REU are deliberately not promoted -- the
first is advisory rather than ownership, the second is a credential rather
than a system. Both remain in Matrix at full detail; nothing is deleted."
```

---

## Task 8: Capabilities

**Files:**
- Modify: `index.html` (fill `#about`)
- Modify: `assets/css/pro.css` (append capability styles)

**Interfaces:**
- Consumes: `.wrap`, `.section-label`, `.mono`.
- Produces: nothing later tasks depend on.

Four groups, each a single line of comma-separated mono text. Not chips, not bars, not a cloud — at 40-plus items chips *become* the cloud, while plain lines stay scannable and read as a statement rather than a badge collection.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-caps.sh <<'EOF'
#!/usr/bin/env bash
fail=0
n=$(grep -c 'class="cap-row"' index.html)
[ "$n" = "4" ] && echo "  ok   exactly 4 groups" || { echo "  FAIL $n groups (want 4)"; fail=1; }
for n in 'skill-tag' 'progress' 'class="bar'; do
  c=$(grep -c "$n" index.html); [ "$c" = "0" ] && echo "  ok   no $n" || { echo "  FAIL $c x $n"; fail=1; }
done
exit $fail
EOF
chmod +x /tmp/check-caps.sh
/tmp/check-caps.sh; echo "exit=$?"
```

Expected: `FAIL 0 groups (want 4)`.

- [ ] **Step 2: Fill the section**

```bash
python3 - <<'PY'
import pathlib
p = pathlib.Path('index.html')
s = p.read_text()
caps = '''<section id="about" class="capabilities">
    <div class="wrap">
      <h2 class="section-label">capabilities</h2>
      <dl class="cap-list">
        <div class="cap-row">
          <dt class="mono">ai_systems</dt>
          <dd>Agent runtimes, RAG and vector retrieval, LLM orchestration,
            model evaluation and red-teaming, typed decision contracts</dd>
        </div>
        <div class="cap-row">
          <dt class="mono">backend</dt>
          <dd>Python, FastAPI, PostgreSQL and pgvector, REST API design,
            PHP/MySQL, multi-tenant architecture, role-based access control</dd>
        </div>
        <div class="cap-row">
          <dt class="mono">platform</dt>
          <dd>Linux, Nginx, Docker, AWS, cron automation, OAuth 2.0,
            deployment and release workflow</dd>
        </div>
        <div class="cap-row">
          <dt class="mono">hardware</dt>
          <dd>C and ARM assembly, Cortex-M4F firmware, FPGA and high-level
            synthesis, PWM/ADC/I&sup2;C, interrupt-driven real-time design</dd>
        </div>
      </dl>
    </div>
  </section>'''
s = s.replace('<section id="about" class="capabilities"></section>', caps, 1)
p.write_text(s)
print("capabilities inserted")
PY
```

- [ ] **Step 3: Append styles**

```bash
cat >> assets/css/pro.css <<'EOF'

/* ---- capabilities ----
   Plain lines, not chips. At 40+ items chips become the skill cloud. */
.cap-list { margin: 0; }
.cap-row {
    display: grid; grid-template-columns: 9rem 1fr; gap: 1rem;
    padding-block: 1rem;
    border-bottom: 1px solid var(--hairline);
}
.cap-row:last-child { border-bottom: none; }
.cap-row dt { font-size: 0.8125rem; color: var(--accent); }
.cap-row dd { margin: 0; color: var(--text-muted); font-size: 0.9375rem; }

@media (max-width: 640px) {
    .cap-row { grid-template-columns: 1fr; gap: 0.35rem; }
}
EOF
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-caps.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/pro.css
git commit -m "feat: add capabilities as four plain lines

Comma-separated mono text rather than chips, bars, or a cloud. At 40-plus
items chips become the cloud they are supposed to avoid; plain lines stay
scannable and read as a statement rather than a badge collection."
```

---

## Task 9: Experience

**Files:**
- Modify: `index.html` (fill `#experience`)
- Modify: `assets/css/pro.css` (append experience styles)

**Interfaces:**
- Consumes: `.wrap`, `.section-label`, `.mono`.
- Produces: nothing later tasks depend on.

Current role prominent, three prior at one line each, one link to the full 21-role history in Matrix. Dates and titles are copied verbatim from the Matrix timeline — do not paraphrase them, or the two surfaces will disagree.

AI-EDGE appears here even though Task 7 kept it off the systems list. That is not a contradiction: as a *role* the fellowship is legitimate and the NSF name earns its line; as a *project card* it would present a credential where a system is expected.

UIC Engineering Success Mentor is genuinely current but omitted — teaching is not part of the stated positioning, and it remains at full detail in Matrix.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-exp.sh <<'EOF'
#!/usr/bin/env bash
fail=0
n=$(grep -c 'class="role"' index.html)
[ "$n" = "4" ] && echo "  ok   4 roles (1 current + 3 prior)" || { echo "  FAIL $n roles (want 4)"; fail=1; }
for t in "AHEAD" "LinkedIn" "AI-EDGE Institute" "Arkboosted"; do
  grep -q "$t" index.html && echo "  ok   $t" || { echo "  FAIL missing $t"; fail=1; }
done
grep -q 'matrix/#experience' index.html && echo "  ok   full-history link" || { echo "  FAIL no full-history link"; fail=1; }
exit $fail
EOF
chmod +x /tmp/check-exp.sh
/tmp/check-exp.sh; echo "exit=$?"
```

Expected: `FAIL 0 roles (want 4)`.

- [ ] **Step 2: Fill the section**

```bash
python3 - <<'PY'
import pathlib
p = pathlib.Path('index.html')
s = p.read_text()
exp = '''<section id="experience" class="experience">
    <div class="wrap">
      <h2 class="section-label">experience</h2>

      <div class="role role--current">
        <h3>Enterprise AI Engineering Intern</h3>
        <p class="role-meta mono">AHEAD &middot; May 2026 &ndash; Present &middot; Chicago, IL</p>
        <p>Enterprise AI platform work: Glean and Claude integration, reusable
          skills, agent testing, connector quality, and governed AI workflows.
          Promoted from AI Intern.</p>
      </div>

      <div class="role">
        <h3>AI Safety Evaluator &amp; Red Team Prompt Engineer</h3>
        <p class="role-meta mono">LinkedIn (Contract) &middot; Apr &ndash; Aug 2026</p>
      </div>

      <div class="role">
        <h3>NSF AI Research Fellow</h3>
        <p class="role-meta mono">AI-EDGE Institute, The Ohio State University &middot; Jun &ndash; Jul 2026</p>
      </div>

      <div class="role">
        <h3>Software Engineer</h3>
        <p class="role-meta mono">Arkboosted &middot; Sep 2025 &ndash; Aug 2026</p>
      </div>

      <p class="see-all mono"><a href="/matrix/#experience">Full history &rarr;</a></p>
    </div>
  </section>'''
s = s.replace('<section id="experience" class="experience"></section>', exp, 1)
p.write_text(s)
print("experience inserted")
PY
```

- [ ] **Step 3: Append styles**

```bash
cat >> assets/css/pro.css <<'EOF'

/* ---- experience ---- */
.role { padding-block: 1.25rem; border-bottom: 1px solid var(--hairline); }
.role:last-of-type { border-bottom: none; }
.role--current { padding-bottom: 1.75rem; }
.role h3 { font-size: 1rem; }
.role-meta { margin: 0.35rem 0 0; font-size: 0.8125rem; color: var(--text-muted); }
.role--current p:not(.role-meta) { margin-top: 0.75rem; color: var(--text-muted); font-size: 0.9375rem; }
EOF
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-exp.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 5: Cross-check the dates against Matrix**

```bash
grep -A4 "openModal('modal-ahead')" matrix/index.html | grep date-location
grep -A4 "openModal('modal-linkedin-red-team')" matrix/index.html | grep date-location
grep -A4 "openModal('modal-ai-edge-reu')" matrix/index.html | grep date-location
grep -A4 "openModal('modal-founding-engineer')" matrix/index.html | grep date-location
```

Every date range printed must match the corresponding `.role-meta` line exactly. A mismatch here is the first instance of the drift this architecture accepts — catch it now.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/pro.css
git commit -m "feat: add experience as current role plus three prior

Recognizable institutions paired with engineering substance, rather than a
list that reads as accumulated internships. Dates copied verbatim from the
Matrix timeline to avoid immediate drift.

AI-EDGE appears here but not in selected systems: as a role the fellowship
is legitimate and the NSF name earns its line, while as a project card it
would present a credential where a system is expected.

UIC mentorship is omitted -- teaching is not part of the stated
positioning, and it stays at full detail in Matrix."
```

---

## Task 10: Command palette

**Files:**
- Create: `assets/js/pro.js`
- Modify: `assets/css/pro.css` (append palette styles)

**Interfaces:**
- Consumes: the section ids from Task 5; `.matrix-entry` in the header.
- Produces: nothing later tasks depend on.

This is the terminal motif, translated — the one place the terminal identity belongs on a professional surface. Routing the Matrix entrance through a palette makes it feel earned rather than bolted on.

Keyboard-only by design. There is no `⌘K` on a phone, and the header and footer links already cover every destination, so nothing replaces it on touch — specifically not a floating button.

It must be a real focus trap: Escape closes and returns focus to where it came from, arrows move the selection, Enter activates. A palette that leaks focus is worse than no palette.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-palette.sh <<'EOF'
#!/usr/bin/env bash
F=assets/js/pro.js
fail=0
[ -f $F ] || { echo "  FAIL $F missing"; exit 1; }
for n in 'metaKey' 'ctrlKey' 'Escape' 'ArrowDown' 'ArrowUp' 'matrix' 'aria-selected'; do
  grep -q "$n" $F && echo "  ok   handles $n" || { echo "  FAIL no $n"; fail=1; }
done
grep -q 'innerHTML *= *[^;]*+' $F && { echo "  FAIL innerHTML concatenation"; fail=1; } || echo "  ok   no innerHTML concat"
exit $fail
EOF
chmod +x /tmp/check-palette.sh
/tmp/check-palette.sh; echo "exit=$?"
```

Expected: `FAIL assets/js/pro.js missing`.

- [ ] **Step 2: Write the palette**

```bash
cat > assets/js/pro.js <<'EOF'
/* Command palette. The terminal motif, translated.
   Keyboard-only by design: there is no Cmd-K on a phone, and the header and
   footer links already cover every destination. */
(function () {
  'use strict';

  var ITEMS = [
    { label: 'Selected systems',   hint: 'section', run: jump('projects') },
    { label: 'Capabilities',       hint: 'section', run: jump('about') },
    { label: 'Experience',         hint: 'section', run: jump('experience') },
    { label: 'Contact',            hint: 'section', run: jump('contact') },
    { label: 'Open resume',        hint: 'pdf',     run: open_('/assets/files/Akbar_Resume.pdf') },
    { label: 'Copy email address', hint: 'clipboard', run: copyEmail },
    { label: 'GitHub',             hint: 'external', run: open_('https://github.com/ak23bar') },
    { label: 'LinkedIn',           hint: 'external', run: open_('https://linkedin.com/in/akbar-aman-94b1b6263') },
    { label: 'Enter the matrix',   hint: 'alternate interface', run: go('/matrix/') }
  ];

  var root, input, list, lastFocus;
  var shown = ITEMS.slice();
  var active = 0;

  function jump(id) {
    return function () {
      var el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    };
  }
  function open_(href) { return function () { window.open(href, '_blank', 'noopener'); }; }
  function go(href) { return function () { window.location.href = href; }; }
  function copyEmail() {
    var addr = 'akbaraman797@gmail.com';
    if (navigator.clipboard) { navigator.clipboard.writeText(addr); }
  }

  function build() {
    root = document.createElement('div');
    root.className = 'palette';
    root.hidden = true;

    var box = document.createElement('div');
    box.className = 'palette-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Command palette');

    input = document.createElement('input');
    input.className = 'palette-input mono';
    input.type = 'text';
    input.setAttribute('placeholder', 'Type a command…');
    input.setAttribute('aria-label', 'Search commands');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', 'palette-list');
    input.setAttribute('autocomplete', 'off');

    list = document.createElement('ul');
    list.className = 'palette-list';
    list.id = 'palette-list';
    list.setAttribute('role', 'listbox');

    box.appendChild(input);
    box.appendChild(list);
    root.appendChild(box);
    document.body.appendChild(root);

    input.addEventListener('input', function () { filter(input.value); });
    root.addEventListener('mousedown', function (e) { if (e.target === root) { close(); } });
  }

  function filter(q) {
    var needle = q.trim().toLowerCase();
    shown = ITEMS.filter(function (it) {
      return !needle || it.label.toLowerCase().indexOf(needle) !== -1;
    });
    active = 0;
    render();
  }

  function render() {
    list.textContent = '';
    shown.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'palette-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === active ? 'true' : 'false');

      var name = document.createElement('span');
      name.textContent = it.label;
      var hint = document.createElement('span');
      hint.className = 'palette-hint';
      hint.textContent = it.hint;

      li.appendChild(name);
      li.appendChild(hint);
      li.addEventListener('mouseenter', function () { active = i; paint(); });
      li.addEventListener('click', function () { choose(i); });
      list.appendChild(li);
    });
  }

  function paint() {
    var kids = list.children;
    for (var i = 0; i < kids.length; i++) {
      kids[i].setAttribute('aria-selected', i === active ? 'true' : 'false');
    }
  }

  function choose(i) {
    var it = shown[i];
    close();
    if (it) { it.run(); }
  }

  function openPalette() {
    lastFocus = document.activeElement;
    root.hidden = false;
    input.value = '';
    filter('');
    input.focus();
  }

  function close() {
    root.hidden = true;
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  document.addEventListener('keydown', function (e) {
    var isOpen = root && !root.hidden;

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen ? close() : openPalette();
      return;
    }
    if (!isOpen) { return; }

    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % shown.length; paint(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + shown.length) % shown.length; paint(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });

  build();
})();
EOF
```

- [ ] **Step 3: Append palette styles**

```bash
cat >> assets/css/pro.css <<'EOF'

/* ---- command palette ---- */
.palette {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0, 0, 0, 0.6);
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 12vh;
}
.palette[hidden] { display: none; }
.palette-box {
    width: min(480px, calc(100vw - 2rem));
    background: var(--surface);
    border: 1px solid var(--hairline-lit);
    border-radius: 6px;
    overflow: hidden;
}
.palette-input {
    width: 100%; padding: 0.9rem 1rem;
    background: transparent; color: var(--text);
    border: none; border-bottom: 1px solid var(--hairline);
    font-size: 0.875rem;
}
.palette-input::placeholder { color: var(--text-muted); }
.palette-input:focus { outline: none; }
.palette-list { list-style: none; margin: 0; padding: 0.35rem; max-height: 50vh; overflow-y: auto; }
.palette-item {
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
    padding: 0.6rem 0.75rem; border-radius: 4px;
    font-size: 0.875rem; cursor: pointer;
}
.palette-item[aria-selected="true"] { background: #1a1a1a; color: var(--accent); }
.palette-hint {
    font-family: var(--font-mono); font-size: 0.6875rem;
    color: var(--text-muted); white-space: nowrap;
}
EOF
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-palette.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 5: Verify the focus trap by hand**

On `http://localhost:8001/`, with the keyboard only:

1. Press `Ctrl+K` (or `⌘K`) — the palette opens and the input has focus
2. Type `mat` — the list narrows to "Enter the matrix"
3. Press `Escape` — the palette closes **and focus returns to where it was**
4. Reopen, press `ArrowDown` three times — the selection moves and `aria-selected` follows it
5. Press `Enter` on "Selected systems" — the palette closes and the page scrolls to the section
6. Reopen, press `Tab` repeatedly — focus must **not** escape to the page behind
7. Reopen, click the backdrop — it closes
8. Console clean throughout

- [ ] **Step 6: Commit**

```bash
git add assets/js/pro.js assets/css/pro.css
git commit -m "feat: add keyboard command palette

The terminal motif translated to a professional surface -- the one place
that identity belongs here. Routing the Matrix entrance through a palette
makes it feel earned rather than bolted on.

Real focus trap: Escape restores the previously focused element, arrows
move the selection with aria-selected following, Tab cannot escape to the
page behind. Built with createElement rather than innerHTML.

Keyboard-only by design; there is no Cmd-K on a phone and the header and
footer links already cover every destination."
```

---

## Task 11: Crawler files and the OG image

**Files:**
- Create: `robots.txt`, `sitemap.xml`, `assets/files/og-professional.png`

**Interfaces:**
- Consumes: the canonical URLs from Tasks 2 and 5.
- Produces: nothing later tasks depend on.

The OG image is the highest-impact single item in the SEO set. Every LinkedIn or Slack share of `akaman.dev` currently previews `neo.png` — the Matrix identity advertising the professional URL.

The asset does not exist. Generate a typographic card rather than shipping the wrong image; a name and positioning line on the pro palette is honest and takes one command.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-seo.sh <<'EOF'
#!/usr/bin/env bash
fail=0
for f in robots.txt sitemap.xml assets/files/og-professional.png; do
  [ -s "$f" ] && echo "  ok   $f exists and is non-empty" || { echo "  FAIL $f missing or empty"; fail=1; }
done
grep -q 'akaman.dev/sitemap.xml' robots.txt 2>/dev/null && echo "  ok   sitemap advertised" || { echo "  FAIL sitemap not in robots"; fail=1; }
grep -q '<loc>https://akaman.dev/</loc>' sitemap.xml 2>/dev/null && echo "  ok   root in sitemap" || { echo "  FAIL root missing"; fail=1; }
grep -q '<loc>https://akaman.dev/matrix/</loc>' sitemap.xml 2>/dev/null && echo "  ok   matrix in sitemap" || { echo "  FAIL matrix missing"; fail=1; }
exit $fail
EOF
chmod +x /tmp/check-seo.sh
/tmp/check-seo.sh; echo "exit=$?"
```

Expected: three `FAIL ... missing` lines.

- [ ] **Step 2: Create robots.txt and sitemap.xml**

```bash
cat > robots.txt <<'EOF'
User-agent: *
Allow: /

Sitemap: https://akaman.dev/sitemap.xml
EOF

cat > sitemap.xml <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  <url>
    <loc>https://akaman.dev/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://akaman.dev/matrix/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
EOF
```

Fix the namespace typo before continuing — it must be `sitemaps.org`, plural:

```bash
sed -i 's|www.sitemap.org|www.sitemaps.org|' sitemap.xml
grep -q 'www.sitemaps.org' sitemap.xml && echo "namespace ok"
```

- [ ] **Step 3: Generate the OG card**

**Verified on this machine: neither ImageMagick (`magick`/`convert`) nor Python PIL is
installed.** Do not plan around them. Playwright *is* available as an MCP tool, so render
an HTML card and screenshot it at exactly 1200×630 — no new dependency, and the card
reuses the real palette.

Write the card source to the scratch directory, not the repo:

```bash
cat > /tmp/og-card.html <<'CARD'
<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0}
  body{width:1200px;height:630px;background:#0a0a0a;
       font-family:ui-sans-serif,-apple-system,system-ui,sans-serif;
       display:flex;flex-direction:column;justify-content:center;padding:0 90px;
       box-sizing:border-box}
  .mark{font-family:'Fira Code',monospace;font-size:22px;color:#8a8a8a;margin-bottom:28px}
  h1{margin:0;font-size:88px;font-weight:600;color:#e8e8e8;letter-spacing:-.02em}
  .role{margin-top:18px;font-family:'Fira Code',monospace;font-size:38px;color:#7ee787}
  .axes{margin-top:34px;font-size:24px;color:#8a8a8a}
</style></head><body>
  <div class="mark">akbar@akaman</div>
  <h1>Akbar Aman</h1>
  <div class="role">AI &amp; Systems Engineer</div>
  <div class="axes">Governed AI platforms &middot; agent runtimes &middot; backends &middot; embedded systems</div>
</body></html>
CARD
```

Then, with the Playwright MCP tools:

```
browser_resize          → width 1200, height 630
browser_navigate        → file:///tmp/og-card.html
browser_take_screenshot → save to assets/files/og-professional.png
```

Confirm the dimensions are exact — OG consumers crop anything else:

```bash
python3 - <<'DIMS'
import struct, pathlib
d = pathlib.Path('assets/files/og-professional.png').read_bytes()
assert d[:8] == b'\x89PNG\r\n\x1a\n', 'not a PNG'
w, h = struct.unpack('>II', d[16:24])
print(f'{w}x{h}', 'OK' if (w, h) == (1200, 630) else 'WRONG SIZE')
DIMS
```

Expected: `1200x630 OK`.

If Playwright is unavailable in the executing session, stop and ask for the asset rather
than improvising. **Do not point the meta tag at `neo.png`** — that is precisely the bug
this task exists to fix, and shipping it would silently undo the highest-impact item in
the SEO set.

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-seo.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`. Dimensions were already asserted in Step 3.

- [ ] **Step 5: Commit**

```bash
git add robots.txt sitemap.xml assets/files/og-professional.png
git commit -m "feat: add robots.txt, sitemap, and a professional OG card

Shares of akaman.dev previewed neo.png -- the Matrix identity advertising
the professional URL, and the highest-impact item in the SEO set. Replaced
with a typographic card on the pro palette.

Sitemap lists both surfaces so neither is missed by a crawler."
```

---

## Task 12: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the finished two-surface layout.
- Produces: accurate guidance for the next session.

`CLAUDE.md` opens by asserting `index.html` is the entire site. After Task 1 that is false, and a future session trusting it will edit the wrong file. The drift list also needs the new duplication point — six project theses now exist on both surfaces with intentionally different prose.

- [ ] **Step 1: Write the failing check**

```bash
cat > /tmp/check-claudemd.sh <<'EOF'
#!/usr/bin/env bash
fail=0
grep -q 'matrix/index.html' CLAUDE.md && echo "  ok   documents the new path" || { echo "  FAIL new path undocumented"; fail=1; }
grep -q 'pro.css' CLAUDE.md && echo "  ok   documents pro.css" || { echo "  FAIL pro.css undocumented"; fail=1; }
grep -q 'is the entire site' CLAUDE.md && { echo "  FAIL stale 'entire site' claim remains"; fail=1; } || echo "  ok   stale claim removed"
exit $fail
EOF
chmod +x /tmp/check-claudemd.sh
/tmp/check-claudemd.sh; echo "exit=$?"
```

Expected: failures on all three.

- [ ] **Step 2: Rewrite the architecture opening**

Replace the sentence asserting `index.html` is the whole site with a two-surface description. Read the current text first, then edit:

```bash
grep -n 'is the entire site' CLAUDE.md
```

Replace that paragraph with:

```markdown
The site is **two independent documents that share no CSS and no JS**.

- `index.html` — the professional surface at `/`. Loads only
  `assets/css/pro.css` and `assets/js/pro.js`. Restrained, no matrix rain, no
  loading screen, zero inline `onclick`, zero inline `style=`. Token-led via
  `:root` custom properties.
- `matrix/index.html` (~3.4k lines) — the Matrix surface at `/matrix/`. Every
  section *and* all 47 modals live in it. Loads `styles.css`, `components.css`,
  `responsive.css`, `main.js`, `modals.js`.

Asset references in `matrix/index.html` **must stay host-absolute**
(`/assets/…`), because the document is one directory deep. Never add
`<base href="/">` to fix a path — it also re-roots the in-page `#anchors` and
breaks the Matrix's navigation.

Everything below about card/modal duplication applies to the Matrix surface
only.
```

- [ ] **Step 3: Add the new drift point**

Append to the "Content that duplicates and drifts" list:

```markdown
- **The six selected systems** exist on both surfaces with deliberately
  different prose — `index.html` (`.system` articles) and `matrix/index.html`
  (project cards + modals). The pro surface owns *positioning*; the Matrix owns
  the *detail record*. Only a genuine repositioning should touch both. Role
  dates in `index.html` (`.role-meta`) are copied verbatim from the Matrix
  timeline and drift the moment one changes.
```

- [ ] **Step 4: Run the check to verify it passes**

```bash
/tmp/check-claudemd.sh; echo "exit=$?"
```

Expected: all `ok`, `exit=0`.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for the two-surface architecture

The architecture section asserted index.html was the entire site, which
stopped being true when the Matrix moved to /matrix/. Adds the host-absolute
path constraint and the base-href warning, and records the new drift point:
six project theses now live on both surfaces with different prose."
```

---

## Task 13: Verification pass and preview deploy

**Files:** none — verification only.

**Interfaces:**
- Consumes: everything.
- Produces: the evidence needed to justify merging to `updates`.

Nothing here is optional and nothing here may be claimed without running it. If a check fails, fix it in a follow-up commit on this branch and re-run the whole task.

- [ ] **Step 1: Full local assertion sweep**

```bash
pkill -f "http.server 8001" 2>/dev/null
python3 -m http.server 8001 --directory . >/tmp/serve.log 2>&1 &
sleep 1
for s in matrix canonical headers tokens skeleton hero systems caps exp palette seo claudemd; do
  printf '\n=== %s ===\n' "$s"; /tmp/check-$s.sh
done
```

Expected: every line `ok`.

- [ ] **Step 2: Surface isolation**

The single most important structural assertion — the pro surface must not load a single Matrix asset.

```bash
echo "--- pro surface asset requests ---"
grep -o 'href="/assets/[^"]*"\|src="/assets/[^"]*"' index.html | sort -u
echo "--- must be empty ---"
grep -o 'styles.css\|components.css\|responsive.css\|main.js\|modals.js' index.html || echo "(clean)"
echo "--- matrix green on the pro surface: must be 0 ---"
grep -c '#00ff41' index.html assets/css/pro.css assets/js/pro.js
```

Expected: pro surface references only `pro.css`, `pro.js`, the favicon, the resume, and the OG image; `(clean)`; three counts of `0`.

- [ ] **Step 3: Accessibility pass**

On `http://localhost:8001/`:

1. **Keyboard only, no mouse.** Tab from the top. Every link and the palette must be reachable, and every focused element must show a visible `--accent` ring. Nothing may be reachable-but-invisible.
2. Skip link is first in tab order and jumps to `#main`.
3. Heading order: exactly one `h1`, then `h2` section labels, then `h3` per card. No skipped levels.
   ```bash
   grep -o '<h[1-6]' index.html | sort | uniq -c
   ```
4. Force `prefers-reduced-motion: reduce` in devtools and confirm transitions stop and smooth scroll becomes instant.
5. Zoom to 200% — no horizontal scrollbar, no clipped text.
6. Re-verify the palette contrast: `--accent #7ee787` on `#1a1a1a` (the selected-item background) with a checker. If it falls below 4.5:1, darken the selected background rather than brightening the accent.

- [ ] **Step 4: Responsive pass**

At 375×667 and 1440×900, on **both** `/` and `/matrix/`:

- 375: single column, no horizontal scroll, `.cap-row` collapses to one column, tap targets look ≥44px, no hamburger on `/`
- 1440: content column centred, prose does not exceed its measure
- `/matrix/` must look and behave exactly as it did before Task 1

- [ ] **Step 5: Preview deploy and header verification**

```bash
git push -u origin feat/professional-surface
```

Cloudflare Pages builds a preview for the branch. Against the preview URL:

```bash
PREVIEW=https://<branch-preview>.pages.dev   # from the Pages dashboard
curl -sI "$PREVIEW/assets/css/pro.css" | grep -i cache-control
curl -sI "$PREVIEW/" | grep -i -e cache-control -e x-content-type-options
for p in / /matrix/ /robots.txt /sitemap.xml /assets/files/og-professional.png; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' "$PREVIEW$p")"
done
```

Expected: `max-age=86400, must-revalidate` on the asset; `max-age=0, must-revalidate` and `nosniff` on the document; all five paths `200`. This is the first and only point at which the Task 3 `_headers` file can be verified — it was unverifiable locally.

- [ ] **Step 6: Social preview check**

Run the preview URL through a link-preview debugger (LinkedIn Post Inspector or similar). Confirm the card shows the new typographic OG image, **not** `neo.png`, and that the title reads "AI & Systems Engineer".

- [ ] **Step 7: Report honestly**

Write up the results. State plainly which checks passed, which failed, and anything skipped and why. Do not report completion while any assertion above is failing or unrun.

- [ ] **Step 8: Merge decision**

Only once every check passes:

```bash
git checkout updates
git merge --no-ff feat/professional-surface -m "feat: professional front door at / with Matrix preserved at /matrix/"
```

Do not push to `updates` until the preview has been verified — that push is the production deploy.

For the branch cleanup and PR decision, use the `superpowers:finishing-a-development-branch` skill.

---

## Self-Review

**Spec coverage.** §1 → Tasks 1–2 (relocation, canonicalization). §2 → Tasks 6, 8 (positioning, no counters). §3 → Tasks 4, 5, 10 (two documents, no shared assets). §4 → Task 5 (id reuse for fragment continuity). §5 → Tasks 5–9 (six blocks). §6 → Task 4 (tokens, measured contrast, hairline rule). §7 → Tasks 4, 10 (motion budget, focus, palette). §8 → Tasks 1–2 with the freeze enforced in Global Constraints. §9 → Tasks 3, 13 (routing, `_headers`, preview). §10 → Task 7 (six systems, demotions). §11 → Task 9 (experience selection). §12 → Task 13 Step 4 (mobile). §13 → Tasks 5, 11, 13 Step 3 (a11y, SEO). §14 → Global Constraints freeze plus explicit non-actions. §15 → the whole plan.

**Gaps found and closed.** The spec's atomic-rollout requirement conflicted with per-task commits; resolved with the feature-branch constraint, since Pages deploys from `updates`. The spec's "remove the three `meta http-equiv` cache tags" sat under the SEO heading but those tags live in the Matrix document, which §14 freezes — resolved explicitly in Task 2: the pro surface simply never has them, and the Matrix keeps its inert ones.

**Type and name consistency.** Class names are used identically across tasks: `.wrap`, `.section-label`, `.mono`, `.system`, `.system--lead`, `.system-thesis`, `.system-notes`, `.system-tech`, `.system-evidence`, `.see-all`, `.cap-row`, `.role`, `.role--current`, `.role-meta`, `.palette*`. Token names match Task 4's definitions everywhere. Section ids (`home`, `about`, `experience`, `projects`, `contact`) are created in Task 5 and referenced by Task 10's `jump()` calls and by the `.see-all` links in Tasks 7 and 9. `--hairline-lit` is defined in Task 4 and used in Tasks 4, 5, 7, 10.

**Known deferral.** `_headers` cannot be verified locally; this is stated in Task 3 Step 4 and verified in Task 13 Step 5 rather than being silently assumed.
