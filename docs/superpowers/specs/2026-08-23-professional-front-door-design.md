# Design Spec — Professional Front Door + Preserved Matrix Surface

**Status:** approved 2026-08-23. Implementation plan not yet written.
**Supersedes:** the "Repositioning direction" section of `docs/handoff-2026-08-23.md`.

---

## Context

`akaman.dev` resolves to a single 3,351-line `index.html` whose entire personality is
Matrix-themed: a full-viewport loading screen gates every visit, matrix rain runs on two
canvases, and the identity is `#00ff41` on black in monospace throughout. The content
underneath is strong — 23 projects, 21 roles, a well-written GPS platform entry — but the
surface reads as a themed personal site rather than as evidence about an engineer, and a
hiring manager scanning for 30 seconds meets an animated intro before any claim about what
gets built.

The goal is not to replace that surface. It is to put a restrained, fast, professional
document at `/`, and move the Matrix experience to `/matrix/` where it stays fully intact
and intentionally reachable.

**Confirmed decisions:** `akaman.dev` is live as a Cloudflare Pages custom domain; the
Pages production branch is `updates`; the Matrix lives at `/matrix/`; three surfaces, not
four — Matrix *is* the "All Work" tier; six selected systems, one per positioning axis; no
hero photograph; experience shows the current role plus three prior.

---

## 1. Current-state diagnosis

**Branches.** Local `main` is 33 commits behind `origin/main`. `origin/main` (`884c954`)
is the PR-#2 merge that absorbed `updates`. `updates` (`352b240`) is 3 commits ahead of
`origin/main` — the `parseFloat` version-compare fix plus two docs. Nothing exists on
`origin/main` that `updates` lacks, so `updates` is a strict superset and is the deployed
branch. Work lands there and publishes on push.

**The token-layer "hard gate" dissolves.** `docs/handoff-2026-08-23.md` measured 307
hardcoded `#00ff41` (159 CSS / 93 HTML / 55 JS), **0** CSS custom properties, and 291
inline hex colors, then concluded a token refactor must precede any split. That is correct
— but only for a single-DOM theme toggle, where inline styles outrank class selectors and
defeat `body.matrix-mode`. A second document never loads `styles.css`, `components.css`, or
`responsive.css`, so all 307 occurrences and all 328 inline `style=` attributes become
irrelevant rather than blocking. The most expensive prerequisite on the roadmap is an
artifact of the architecture, not of the problem.

**Asset paths are the only real coupling.** Every reference is document-root-relative
*without* a leading slash — 8 in `index.html` (3 CSS, 2 JS, `neo.png`, 2 resume links) and
3 in `main.js:1217,1222,1479`. Relocating into `/matrix/` requires adding a leading slash
to those 11 refs and nothing else. `<base href="/">` is **not** a shortcut: it would
rewrite the ~10 in-page `href="#projects"`-style anchors into cross-document links and
break the Matrix's own navigation.

**Corpus.** 23 project cards across 6 buckets; 21 experience entries across 5 branches; 57
modal ids, 3 (`highlight-*`) orphaned.

**GPS is already correct.** `index.html:865` (card) and `index.html:2965` (modal) already
carry the exact target positioning — provider-agnostic, independently authored, modular
agent runtime, typed decision contracts, human-approval gates, deterministic tool
authorization, reconstructable audit trails, source marked confidential,
`project-enterprise-rag` id preserved for inbound links. Commit `0ddc11f` shipped this. No
GPS rewrite is needed; it is the *template* for the other five.

**What must not be inherited:** the loading screen (`index.html:39`), matrix rain on two
canvases, an ElevenLabs widget, 88 inline `onclick` handlers (none keyboard-reachable),
1.8k lines of `main.js` two-thirds of which is a fake shell over a hardcoded `fileSystem`
map, three ineffective `<meta http-equiv="Cache-Control">` tags, a keyword-stuffed
`<meta name="keywords">`, and `og:image` pointing at `neo.png`.

---

## 2. Audience and positioning

**Primary:** hiring managers and technical leaders evaluating for AI/systems engineering
roles, arriving from a LinkedIn link, a resume header, or a name search. Roughly 30 seconds
before they decide whether to read further.

**Secondary:** experienced engineers, skeptical of AI-adjacent claims, looking for evidence
of real system ownership — constraints handled, decisions made, tradeoffs named.

**Tertiary:** consulting and collaboration inquiries; recruiters keyword-matching.

**Positioning line:** AI & Systems Engineer / Computer Engineer, working across governed
enterprise AI, agent and runtime infrastructure, production backend systems, infrastructure
and automation, ML/research systems, and embedded systems and digital hardware.

**Actively not projected:** student, AI enthusiast, freelancer, a collection of internships,
or breadth proven by counting. This rules the three `professional-stats` counters
(`index.html:183` — `20+` / `30+` / `500+`) off the professional surface; they are the
clearest instance of proving experience through quantity. They stay in Matrix.

---

## 3. Architecture

**Two standalone documents. No shared CSS, no shared JS.**

```
/index.html              new — professional surface
/assets/css/pro.css      new — ~300 lines, token-led, only stylesheet the pro surface loads
/assets/js/pro.js        new — ~80 lines, command palette only
/matrix/index.html       today's index.html, moved, 11 asset paths + meta URLs updated
/assets/css/styles.css       } untouched — loaded only by /matrix/
/assets/css/components.css   }
/assets/css/responsive.css   }
/assets/js/main.js       3 resume paths updated, otherwise untouched
/assets/js/modals.js     untouched
/assets/files/*          shared: resume PDF, favicon, neo.png
```

Rejected alternatives:

- **Single DOM + `body.matrix-mode` toggle** — rejected on the repo's own measurements. 328
  inline `style=` attributes outrank any class-scoped theme and must be hoisted before a
  toggle even functions. Separately, the two surfaces want different information
  architectures; one markup tree serving both compromises each.
- **Astro / 11ty with shared components** — the right answer to the card/modal duplication
  in the abstract, the wrong answer here. It buys a build step, `node_modules`, a Cloudflare
  build command, and a migration of 3,400 lines of hand-tuned inline-styled markup, to solve
  a duplication problem touching 6 of 23 projects. Revisit only if the corpus becomes
  data-driven.

The pro surface gets a proper `:root` custom-property layer from day one. This is the token
layer the handoff wanted, built fresh on 300 lines instead of retrofitted onto 3,400.

---

## 4. Information architecture

```
akaman.dev/                  Professional home
  ├─ hero + positioning
  ├─ selected systems (6)
  ├─ capabilities
  ├─ experience (now + 3)
  └─ contact / links

akaman.dev/matrix/           Matrix surface — full interactive portfolio
  └─ 23 projects · 21 roles · terminal · modals   (unchanged)

github.com/ak23bar           Raw engineering evidence
Akbar_Resume.pdf             Formal record
```

Progressive disclosure runs home → Matrix → GitHub. Matrix is the "All Work" tier: it
already holds the full 23-project corpus in six buckets, so a separate All Work page would
be a third copy of every project title and blurb with nothing new to say.

**Fragment continuity.** The pro home's sections take the ids `home`, `about`, `experience`,
`projects`, `contact` — the same ids the old single-page site used. Existing bookmarks of
the form `akaman.dev/#projects` still land somewhere sensible. Free, and it removes the need
for a `_redirects` file.

---

## 5. Homepage composition

Six blocks, ordered so the 30-second scan completes without scrolling past block 3.

**1 · Header** — static, not sticky. `akbar@akaman` wordmark in mono at left; three links at
right (work · experience · resume); a `>_` glyph as the Matrix entrance. Real `<a>` elements,
zero inline handlers.

**2 · Hero** — fits above the fold at 1440×900, and on a 375×667 phone without scrolling
past the positioning line.
- `h1`: Akbar Aman
- Positioning line: AI & Systems Engineer
- 2–3 sentence thesis: what gets built, what gets optimized for
- Current role, one line: Enterprise AI Engineering Intern, AHEAD
- Three primary actions: Resume · GitHub · Email
- No photograph, no typing animation, no counters, no loading screen

**3 · Selected systems** — six cards, single column, generous vertical rhythm. Single column
over a grid deliberately: each card states a thesis, and a thesis needs a full measure of
text to land. A 3-up grid forces every card to the same shape and makes them read as equally
weighted. GPS sits first with slightly more room.

**4 · Capabilities** — four groups, each one line of comma-separated mono text. Not chips,
not a cloud, not bars. At 40-plus items chips *become* the cloud; plain text lines stay
scannable and read as a statement rather than a badge collection.

**5 · Experience** — current role prominent, three prior at one line each, one link to full
history in Matrix.

**6 · Footer** — email, LinkedIn, GitHub, resume, and one understated line offering the
alternate interface.

---

## 6. Visual language

**Typography.** Body prose sets in a system sans stack (`ui-sans-serif, -apple-system,
system-ui, sans-serif`) — zero network requests. Fira Code is reserved for labels, metadata,
tech lines, the `>_` motif, the wordmark, and the command palette. Mono-everything reads as
a theme; mono-as-accent reads as taste, and it is what separates the reference sites from
typical developer portfolios. Fira Code comes from the Google Fonts link already in use;
Share Tech Mono is dropped from the pro surface.

**Color.** Measured against `#0a0a0a`, WCAG 2.1:

| Token | Value | Ratio | Verdict |
|---|---|---|---|
| `--bg` | `#0a0a0a` | — | canvas |
| `--surface` | `#111111` | 1.05:1 | non-text only |
| `--hairline` | `#1f1f1f` | 1.20:1 | decorative only — see below |
| `--text` | `#e8e8e8` | 16.16:1 | AAA |
| `--text-muted` | `#8a8a8a` | 5.73:1 | AA |
| `--accent` | `#7ee787` | 12.89:1 | AAA, all text sizes |

The accent is settled at `#7ee787` and needs no size restriction. For reference, `#00ff41`
measures 14.50:1 — *higher* than the accent — so the reason to avoid Matrix green on this
surface is purely aesthetic proximity, not accessibility. Landing too close to `#00ff41`
would make the professional surface read as Matrix-lite and undermine the split.

**WCAG 1.4.11 (non-text contrast).** `--hairline` at 1.20:1 is below the 3:1 threshold, so
it may only be decorative: a card must remain perceivable without it, via whitespace and its
heading. Consequently the **focus ring uses `--accent` (12.89:1), never the hairline**, and
the hover state changes the border in addition to — not instead of — another cue.

Dark-only for v1. Tokens make a light mode a later additive change; `prefers-color-scheme`
support is not worth the review surface now.

**Surface treatment.** Hairline borders, no shadows, no glassmorphism, no gradients, no
glow. Cards are defined by a 1px hairline and whitespace. Line-height ~1.65 on prose, tight
on metadata.

**Layout.** Single measure, max ~68ch for prose, ~720px content column. Whitespace is the
primary structural device.

---

## 7. Interaction model

One duration (150ms), one easing, and only on `opacity`, `transform`, and `color`.
`prefers-reduced-motion: reduce` removes all of it.

Three interactions carry the surface:

1. **Designed focus states.** `:focus-visible` gets an intentional ring in `--accent`, never
   suppressed. Most portfolios get this wrong and experienced engineers notice.
2. **Hairline response on hover.** Card borders brighten; cards do not lift, scale, or glow.
3. **A `⌘K` / `Ctrl+K` command palette** — the terminal motif, translated. ~80 lines of
   vanilla JS, no dependency. Entries: jump to each section, open resume, copy email,
   GitHub, LinkedIn, and the payoff — **enter the matrix → `/matrix/`**. Routing the Matrix
   entrance through a palette makes it feel earned rather than bolted on, and it is the one
   place the terminal identity belongs on a professional surface.

Explicitly absent: scroll-jacking, reveal-on-scroll, parallax, animated counters, typing
animations, cursor effects, matrix rain, loading screen, fake AI chat.

---

## 8. Matrix preservation strategy

The Matrix surface is preserved by **not touching it**. `/matrix/index.html` is today's
`index.html` moved; the only edits are mechanical:

- 8 asset refs gain a leading slash (`assets/…` → `/assets/…`)
- `main.js:1217,1222,1479` resume paths gain a leading slash
- Canonical + OG/Twitter URLs move from `ak23bar.pages.dev` to `akaman.dev/matrix/` (5 refs
  in the head, plus `index.html:1278` and `index.html:3286`)

Everything else survives verbatim: the loading screen (it belongs there — it *is* the
Matrix), matrix rain, the terminal and its `fileSystem`, all 57 modals, all 23 projects, all
21 roles, the version widget, the ElevenLabs widget, the Neo image, `#00ff41` throughout. No
restyling, no refactor, no content edits, no bug fixes.

In-page anchors are unaffected by the move — they are document-relative. The terminal's `cd`
/ `goto` handlers use `getElementById` against same-document ids and work unchanged. The
three `highlight-*` orphans and the orphaned `#education` section move with the file, still
orphaned.

---

## 9. Routing and deployment

Cloudflare Pages, production branch `updates`, no build command. Pages serves `/matrix/` →
`/matrix/index.html` automatically; no rewrite rule needed.

```
akaman.dev/          →  /index.html
akaman.dev/matrix/   →  /matrix/index.html
```

No `_redirects`: the site has always been one page, so no external deep link exists beyond
the bare root and fragments, and fragments are covered by the id-preservation in §4.

**Add a real `_headers` file.** The `<meta http-equiv="Cache-Control">` tags at
`index.html:6-8` are ignored by browsers for HTTP caching, so the site currently has no
caching policy despite appearing to set one. A minimal `_headers` giving `/assets/*` a long
immutable cache and HTML a short one is a genuine performance win at four lines.

**Canonicalization.** Every `ak23bar.pages.dev` reference becomes `akaman.dev`. Both
surfaces get an explicit `<link rel="canonical">` so they never compete in search results.

**Rollout.** Both files land in one commit on `updates`. There is no partial state worth
shipping — until `/index.html` is the professional surface, moving the Matrix to `/matrix/`
would leave the root empty.

---

## 10. Selected-project strategy

Six systems, one per positioning axis. The axis mapping *is* the curation rationale: it gives
the section a legible spine, guarantees no two cards compete to prove the same thing, and
guarantees every axis claimed in the positioning has evidence attached.

| Axis | System |
|---|---|
| governed AI / agent runtime | **Governed Platform for Support (GPS)** |
| constrained local runtime | **Pocket Brain** |
| production backend + infrastructure | **Full-Stack MLS Property Platform** |
| ML ↔ hardware co-design | **hls4ml Edge-AI FPGA** |
| embedded firmware | **Ultra Heat Sensor Alarm System** |
| ML / research systems | **Quantitative ML Research Platform** |

**Card anatomy**, following the GPS modal as the template — it is already written in the
right register:

- System name
- One-line thesis stating what the system *is*, in ownership terms
- 3–4 bullets naming **engineering decisions and constraints**, not features. "Bounded
  context growth under a ≤8GB RAM budget for predictable latency," not "sliding window
  context management."
- A tech line capped at ~6 tokens. Existing cards run 10–14 tech tags, which is
  skill-cloud-adjacent and dilutes signal.
- Evidence links: repo, live URL, or article. GPS carries "source confidential — personal
  IP" as it already does.

**No per-project detail pages in v1, and no "read more" per card.** The 3–4 bullets *are* the
detail a hiring manager needs in 30 seconds; deeper detail already exists in the Matrix
modals. One "see all work →" link at the end of the section leads to `/matrix/#projects`.
Per-card links into Matrix modals would be aesthetic whiplash and would multiply the sync
surface.

**Two deliberate demotions,** recorded so they read as choices rather than oversights.
*Fibinaci Agent Map* is strong on the agent-infrastructure axis but its own card says
"advising on platform scope, feasibility, and system design" — advisory, not ownership,
which is precisely the axis being projected. *AI-EDGE REU* is a fellowship, so as a
*project* it presents as a credential rather than a system. Both remain in Matrix at full
detail. Nothing is deleted anywhere.

**Reframing is writing work, not engineering work.** Five of the six cards need new prose in
the GPS register. That is the actual deliverable of this section.

---

## 11. Experience selection

Current role, prominent:

- **Enterprise AI Engineering Intern**, AHEAD — May 2026 – Present. Promoted from AI Intern;
  enterprise AI platform work: Glean, Claude, reusable skills, agent testing, connector
  quality, governed AI workflows.

Three prior, one line each:

- **AI Safety Evaluator / Red Team Prompt Engineer**, LinkedIn (Contract) — Apr – Aug 2026
- **NSF AI Research Fellow**, AI-EDGE Institute, The Ohio State University — Jun – Jul 2026
- **Software Engineer**, Arkboosted — Sep 2025 – Aug 2026

Selection rationale: recognizable institutional names paired with engineering substance.
LinkedIn carries brand weight and sits directly on the AI-evaluation axis; AI-EDGE carries
NSF institutional credibility; Arkboosted is the clearest instance of ownership — architecture,
backend, and deployment, with the FastAPI/React audit tooling behind it.

Note this is not inconsistent with §10 demoting AI-EDGE from the projects section. As a
*role* the fellowship is legitimate and the institutional name earns its line; as a *project
card* it would present a credential where a system is expected. Different sections, different
jobs.

The UIC Engineering Success Mentor role is genuinely current but is omitted here — the
teaching axis is not part of the stated positioning, and it remains at full detail in Matrix.

---

## 12. Mobile behavior

Single column throughout; the desktop layout is already a single measure, so mobile is a
narrowing rather than a reflow.

- **No hamburger.** Three nav links fit inline at any width. This also sidesteps the
  `.mobile-menu { display: flex !important }` class of bug entirely — the pro surface has no
  mobile menu to mis-gate.
- **No command palette on touch.** There is no `⌘K` on a phone; the palette is keyboard-only
  and the header and footer links cover the same destinations. It is not replaced by a
  floating button.
- Tap targets ≥44×44px. Hero fits without scrolling past the positioning line at 375×667.
- Fluid type via `clamp()` rather than breakpoint stepping; two breakpoints total.
- The `>_` Matrix entrance stays visible on mobile — it is a link, not an interaction.

---

## 13. Accessibility and SEO

**Accessibility**
- Semantic landmarks (`header`, `main`, `section`, `footer`), exactly one `h1`, no skipped
  heading levels
- Real `<a>` and `<button>` elements throughout; **zero inline `onclick`**. The Matrix
  surface's 88 `onclick` divs are not keyboard-reachable — the pro surface does not repeat
  that
- `:focus-visible` rings in `--accent` (12.89:1), never suppressed, never dependent on the
  1.20:1 hairline
- Contrast measured, not assumed — see the table in §6. All text pairs pass AA; `--text` and
  `--accent` pass AAA
- `prefers-reduced-motion: reduce` removes all transitions
- Command palette is a proper focus trap with Escape-to-close and arrow-key navigation
- No in-page images on the pro surface, so no `alt` debt — which also sidesteps the
  `alt="Neo"` problem, though that remains in `/matrix/`

**SEO**
- Title and description rewritten around AI & Systems Engineer. **Drop
  `<meta name="keywords">`** — ignored by every major engine and reads as amateur to anyone
  who inspects the source
- JSON-LD `Person` schema with `name`, `jobTitle`, `url`, `sameAs` (GitHub, LinkedIn).
  Cheap, and effective for a name search
- `sitemap.xml` and `robots.txt` listing `/` and `/matrix/`
- Explicit `canonical` on both surfaces
- **New OG image required.** Every LinkedIn or Slack share of `akaman.dev` currently previews
  `neo.png` — the Matrix identity advertising the professional URL. Highest-impact single fix
  in the SEO set. The asset does not exist yet; the fallback is a simple typographic card
  (name + positioning line on the pro palette) rather than shipping the wrong image. This is
  an OG asset, not an in-page image, so it does not conflict with the no-images note above.
- Remove the three ineffective `<meta http-equiv>` cache tags; caching moves to `_headers`

---

## 14. Out of scope

Deliberate exclusions. Several are known defects, recorded here as choices rather than
oversights; all remain documented in `docs/handoff-2026-08-23.md`.

**No longer needed at all**
- The token-layer refactor of the Matrix surface (307 hex literals, 328 inline styles) —
  obsoleted by the two-document architecture

**Known Matrix-surface defects, untouched**
- `components.css:147` — `.mobile-menu { display: flex !important }` outside its media query;
  hamburger renders at all widths (High)
- 19 dead `details` links — `event.stopPropagation()` blocks the card's `openModal` and
  `href="#"` throws in the scroll handler
- Version tooltip `.show` class with no CSS rule; changelog unreachable on touch
- 0-byte `assets/favicon.ico`; the valid `assets/favicon.svg` referenced nowhere
- `#engineerTypeAbout` 160px slot vs 243px content
- Terminal `version` output overflowing its 61-char ASCII box
- Low-severity set: stray `console.log`, `toggleTerminalCli` shadowing, `#00ff42` typo,
  unused `showAll`, placeholder comments, `overflow-y: scroll`
- `alt="Neo"` on the Matrix hero image

**Deferred decisions**
- The orphaned `#education` section and the terminal's `cd education` target
- The three orphaned `highlight-*` modals
- The unexplained `Akbar_Resume.pdf` byte change (commit `62e0cb6`)
- README staleness (lists four deleted files, links `localhost:8001` as the live site)
- Reconciling the `main` / `updates` split-brain

**Not in v1**
- Light theme or `prefers-color-scheme` support
- Per-project detail pages
- A separate All Work page (Matrix serves this tier)
- Data-driven or CMS-backed projects; framework migration
- Any restyling, refactoring, or content change inside the Matrix surface beyond the 11 asset
  paths and the canonical/OG URL updates

**In scope but easy to miss:** `CLAUDE.md` needs updating. Its architecture section opens
"`index.html` (~3.4k lines) is the entire site," which stops being true, and the
content-drift list gains one entry for the six project theses now duplicated across surfaces.

---

## 15. Risks and tradeoffs

**1 · A fourth copy of content to keep in sync.** Six project theses now exist on both
surfaces with intentionally different prose. `CLAUDE.md` already documents three drift points
(`fileContents`, `searchableContent`, `versionConfig`); this adds a fourth. Mitigation is
editorial rather than technical: the pro surface owns *positioning*, Matrix owns the *detail
record*, and only a genuine repositioning requires touching both. Documented, not eliminated
— an honest cost of the split.

**2 · The professional surface may absorb visitors who would have enjoyed the Matrix.**
Someone who would have been won over by the terminal now meets a restrained page and may
never click `>_`. The three-entrance design (header glyph, command palette, footer line) is
the mitigation; the tradeoff is real and accepted, since hiring-weighted is the stated
priority.

**3 · Accent proximity is an aesthetic judgment, not a measurement.** Contrast is settled
(12.89:1). What is not settled is whether `#7ee787` reads as restrained-and-related or as
Matrix-lite. This needs a look in the browser and may take more than one attempt.

**4 · The deliverable is prose, not code.** Five project cards need rewriting in the GPS
register, plus the hero thesis and the capability lines. The engineering is a few hundred
lines of CSS; what decides whether the surface is credible to an experienced engineer is the
writing. Under-investing there fails the exercise regardless of implementation quality.

**5 · Fragment continuity is partial.** Preserving `home`/`about`/`experience`/`projects`/
`contact` means old links land somewhere sensible, but `#projects` on the pro home shows six
systems where it used to show 23. Better than a 404 or a redirect chain, but not identical
behavior.

**6 · The deploy-branch split-brain becomes more consequential.** Production builds from
`updates` while `main` sits 3 commits behind and reads as the default branch to anyone new.
A second surface raises the cost of publishing from the wrong branch. Out of scope, but it
should happen soon.

**7 · Two surfaces means two places to update a role change.** Already true — `main.js`
mirrors homepage content three ways — but this adds another. The now-plus-three experience
block bounds the exposure to four roles rather than 21.

---

## Verification

No build system and no test suite, so verification is manual and specific:

1. `python3 -m http.server 8001` from the repo root
2. `http://localhost:8001/` — professional surface renders; console clean; **confirm no
   matrix rain, no loading screen, no `styles.css` in the network panel**
3. Keyboard-only pass on `/`: Tab every interactive element, confirm visible focus rings,
   open and dismiss the command palette with `⌘K` and Escape
4. `http://localhost:8001/matrix/` — loading screen plays, matrix rain runs, `neo.png` and
   the resume PDF load (not 404), terminal accepts `ls` / `cd projects` / `cat bio.txt` /
   `resume`, and a project card opens its modal
5. Network panel on `/matrix/` — all three stylesheets and both scripts resolve from
   `/assets/`, no 404s from the relocation
6. Contrast: re-verify the §6 table with a checker after any palette change
7. Responsive: 375×667 and 1440×900 on both surfaces
8. `prefers-reduced-motion` forced on — confirm transitions stop
9. Cloudflare preview deploy before merging to `updates`; verify `/` and `/matrix/` both
   resolve on the preview URL and that OG tags render in a link-preview debugger

---

**Next step:** `superpowers:writing-plans` to produce the implementation plan.
