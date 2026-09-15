# Birthday Countdown Website

A personal, static countdown site for Casandra's birthday (Oct 1). No backend,
no build step — plain HTML/CSS/JS, deployed as a static page (previously via
GitHub Pages with a CNAME). Keep it dependency-free unless there's a strong
reason otherwise.

## Current state (baseline before this sprint plan)

Everything lives in one file, `index.html`:
- Countdown timer to a hardcoded target date (`October 1, 2026 00:00:00`).
- On countdown completion: reveals a message, husky image, balloons, confetti.
- Rotating flower decorations (`flower.png`) around the card border.
- Assets in repo root: `flower.png`, `husky-removebg-preview.png`, `husky.jpg`,
  `japan-sakura-flower_24877-82387.jpg`, `lily.gif` (1.3MB — largest asset,
  candidate for compression).

Known housekeeping item (not a feature, do opportunistically): `lily.gif` is
1.3MB and should be compressed/resized since this loads on mobile.

## This year's plan: 4 feature tracks, ~15 days

The user (Daniel) is adding all personal content (photos, letter text, daily
notes, song choice) by hand into data files — Claude's job is to build the
structure/UI these plug into, using placeholder content until real content is
dropped in. Don't hardcode personal content directly into HTML/JS; put it in
a dedicated data file per feature (see each sprint) so Daniel can edit content
without touching markup or logic.

Target ship date: Oct 1, 2026. Work backward from there — later sprints are
lower-risk to cut or simplify if time runs short than earlier ones.

### Sprint 0 — Foundation (do first, ~1-2 days)

Refactor before adding features, so later sprints aren't all crammed into one
HTML file.

- [ ] Split `index.html` into `index.html` (structure only), `style.css`,
      `script.js`.
- [ ] Create `content.js` (plain JS object/array, loaded via `<script>` tag —
      no build step, so keep it simple, e.g. `const CONTENT = {...}`) as the
      single place for user-supplied personal content across all features.
      Seed it with clearly-marked placeholder entries.
- [ ] Add an `assets/` folder (`assets/images/`, `assets/audio/`) and move
      existing images in; update references.
- [ ] Add `prefers-reduced-motion` handling as a baseline (disable/simplify
      the heavier animations for users who request it) — do this now so
      every animation added later inherits it.
- [ ] Compress `lily.gif` and other large images.

Done when: site looks/behaves identically to today, just reorganized, and
`content.js` exists with placeholder shapes for the sprints below.

### Sprint 1 — Daily reveal / advent countdown (~3-4 days)

One new note/photo unlocks per day counting down to Oct 1, so the page
rewards repeat visits instead of being a one-shot reveal.

- [ ] Data shape in `content.js`:
  ```js
  dailyReveals: [
    { date: '2026-09-20', message: '...', photo: 'assets/images/...' }, // photo optional
    // one entry per day Daniel wants to cover, in any order
  ]
  ```
- [ ] Logic: compare today's date against each entry's `date`; show all
      entries whose date is `<= today` (most recent first), keep future ones
      hidden. Use the real calendar date, not visit count or localStorage,
      so it can't be skipped by clearing browser data — but do use
      localStorage to remember if she's "seen" today's entry, to drive an
      optional "new!" badge.
- [ ] UI: a card/section (e.g. "A little something for today") separate from
      the final birthday message, showing the unlocked list newest-first,
      collapsed/expanded per entry.
- [ ] Handle the empty case gracefully (no entries yet, or all in the future)
      by hiding the section rather than showing an empty box.

Done when: Daniel can add an entry to `content.js` with a date and it
appears on the site automatically on/after that date, with zero code changes.

### Sprint 2 — Memory gallery / photo timeline (~3 days)

A scrollable collection of photos together with captions.

- [ ] Data shape in `content.js`:
  ```js
  memories: [
    { photo: 'assets/images/...', caption: '...', date: '2025-03-01' }, // date optional, for sorting
  ]
  ```
- [ ] UI: horizontal-scroll or grid of cards, click/tap to open a lightbox
      (full-size photo + caption, close on backdrop click or Esc).
- [ ] Lazy-load images (`loading="lazy"`) since this section can grow large
      over time.
- [ ] Mobile-first: verify swipe/scroll works well on a phone (this has bit
      the project before — see the balloon-fix commit history).

Done when: adding a photo + caption to `content.js` is the only step needed
to add it to the gallery.

### Sprint 3 — Interactive games / easter eggs (~3 days)

Pick from, in priority order (cut from the bottom if time is short):

1. [ ] **Poppable balloons** — click a balloon, it "pops" (scale+fade +
   little burst animation) and reveals a short message or emoji. Reuses the
   existing `.balloon` elements; add click handler + a small pool of
   messages in `content.js` (`balloonMessages: ['...', '...']`).
2. [ ] **Confetti cannon button** — a button she can press anytime to trigger
   a confetti burst, independent of the countdown finishing. Reuses existing
   confetti CSS/animation, just retriggers it on click instead of only on
   completion.
3. [ ] **Scratch-off card** for the final birthday message reveal — canvas
   with a "scratch coating" that reveals the message underneath as she drags
   over it. Nice-to-have, cut first if short on time.
4. [ ] **Memory-match game** using couple photos, pulling from the same
   `memories` data as Sprint 2. Biggest lift of the four — treat as a stretch
   goal only if Sprints 0-2 finish early.

Done when: at least items 1-2 are shipped; 3-4 are stretch.

### Sprint 4 — Visual / animation upgrade + polish (~3 days)

Do last so it's polishing real content rather than placeholders.

- [ ] Canvas fireworks burst on countdown completion (replace/augment the
      current confetti-only reveal).
- [ ] Animated falling petals (canvas or CSS), possibly retiring the static
      `japan-sakura-flower...jpg` in favor of an animated version.
- [ ] Pass on colors/spacing/typography consistency across all new sections
      added in Sprints 1-3, so they read as one site, not bolted-on pieces.
- [ ] Cross-device check: iPhone-size viewport (project has a documented
      history of balloon/mobile issues — retest specifically on small
      screens), plus reduced-motion mode from Sprint 0.
- [ ] Final QA: fresh countdown-not-finished state, countdown-just-finished
      state, and "come back days later" state (daily reveal partially
      unlocked) all look right.

## Conventions to keep

- No frameworks/build step — vanilla HTML/CSS/JS only, loaded via `<script>`
  tags, so the site stays a simple static deploy.
- Existing palette: coral/red (`#ff6b6b`), teal (`#4ecdc4`), yellow (`#ffe66d`),
  mint (`#a8e6cf`), indigo (`#667eea`) — reuse these for new UI rather than
  introducing new colors.
- Fonts already loaded: `Pacifico` (headings), `Dancing Script` (message text).
- Personal content (names, photos, letter text, daily messages) belongs in
  `content.js`, never inline in HTML/CSS/JS logic — Daniel edits that file
  directly.

## Known open item (not a feature)

`git remote -v` currently has a GitHub personal access token embedded in the
origin URL. Rotate the token and reset the remote to the plain
`https://github.com/...` URL using a credential manager instead.

## Where we left off (2026-09-14)

Plan above was just written; no sprint work has started yet — repo is still
in its baseline state (single `index.html`, no `content.js`, no `assets/`
folder). Daniel is gathering personal content (photos, letter text, daily
messages, song choice) separately and will drop it into `content.js` once
Sprint 0 creates it.

Next session: start Sprint 0 (file split + `content.js` scaffold with
placeholder content) unless priorities have changed.
