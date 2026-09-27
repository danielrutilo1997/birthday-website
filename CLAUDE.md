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

- [x] Split `index.html` into `index.html` (structure only), `style.css`,
      `script.js`.
- [x] Create `content.js` (plain JS object/array, loaded via `<script>` tag —
      no build step, so keep it simple, e.g. `const CONTENT = {...}`) as the
      single place for user-supplied personal content across all features.
      Seed it with clearly-marked placeholder entries.
- [x] Add an `assets/` folder (`assets/images/`, `assets/audio/`) and move
      existing images in; update references.
- [x] Add `prefers-reduced-motion` handling as a baseline (disable/simplify
      the heavier animations for users who request it) — do this now so
      every animation added later inherits it.
- [ ] Compress `lily.gif` and other large images. (NOTE: `lily.gif`,
      `husky.jpg` and the sakura jpg are not referenced by the site at all —
      nothing to compress until one is actually used. Moved to `assets/images/`.)

Done when: site looks/behaves identically to today, just reorganized, and
`content.js` exists with placeholder shapes for the sprints below.

### Sprint 1 — Daily reveal / advent countdown (~3-4 days)

One new note/photo unlocks per day counting down to Oct 1, so the page
rewards repeat visits instead of being a one-shot reveal.

- [x] Data shape in `content.js`:
  ```js
  dailyReveals: [
    { date: '2026-09-20', message: '...', photo: 'assets/images/...' }, // photo optional
    // one entry per day Daniel wants to cover, in any order
  ]
  ```
- [x] Logic: compare today's date against each entry's `date`; show all
      entries whose date is `<= today` (most recent first), keep future ones
      hidden. Use the real calendar date, not visit count or localStorage,
      so it can't be skipped by clearing browser data — but do use
      localStorage to remember if she's "seen" today's entry, to drive an
      optional "new!" badge.
- [x] UI: a card/section (e.g. "A little something for today") separate from
      the final birthday message, showing the unlocked list newest-first,
      collapsed/expanded per entry.
- [x] Handle the empty case gracefully (no entries yet, or all in the future)
      by hiding the section rather than showing an empty box.

Done when: Daniel can add an entry to `content.js` with a date and it
appears on the site automatically on/after that date, with zero code changes.

### Sprint 2 — Memory gallery / photo timeline (~3 days)

A scrollable collection of photos together with captions.

- [x] Data shape in `content.js`:
  ```js
  memories: [
    { photo: 'assets/images/...', caption: '...', date: '2025-03-01' }, // date optional, for sorting
  ]
  ```
- [x] UI: horizontal-scroll or grid of cards, click/tap to open a lightbox
      (full-size photo + caption, close on backdrop click or Esc).
- [x] Lazy-load images (`loading="lazy"`) since this section can grow large
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

RESOLVED in the remote URL (checked 2026-09-27): origin now uses SSH
(`git@github.com:...`), so no token is embedded any more. If the old personal
access token was never revoked on GitHub, revoke it there — it was stored in
plain text in `.git/config` for a while.

## Where we left off (2026-09-27)

LIVE since 2026-09-27 (commit 3ca3794): Sprints 0, 1 and 2 plus the
countdown redesign are on `main`, which GitHub Pages publishes (legacy
build from `main`, repo root) at
https://danielrutilo1997.github.io/birthday-website/

Deploy gotcha: that push to `main` did NOT trigger a Pages build (nothing
after 5 minutes; the Actions list showed no new run). Requesting one with
`gh api -X POST repos/danielrutilo1997/birthday-website/pages/builds`
worked in about 40s. After every push, confirm that
`gh api repos/danielrutilo1997/birthday-website/pages/builds/latest` shows
the new commit as `built`, and curl the live `content.js`.

URGENT: the 2026-09-30 note in `content.js` is still PLACEHOLDER text and
WILL be shown to her if it isn't replaced, committed, merged and pushed before
then. Notes for 9/27-9/29 are written.

Sprint 1 (daily notes) as built:

- Section sits between the main card and the gallery. Heading and the
  "come back tomorrow" teaser text come from `CONTENT.dailyHeading` /
  `CONTENT.dailyTeaser`.
- Unlocking compares LOCAL calendar-day strings ('YYYY-MM-DD' via `dayKey`
  in `script.js`). Never parse an entry date with `new Date('YYYY-MM-DD')` —
  that is UTC midnight, i.e. the previous afternoon in California, and would
  unlock notes ~7 hours early.
- Dates are normalised (`2026-9-27` works); impossible dates or empty
  messages are skipped with a console warning.
- Every note starts sealed; unopened ones carry a "new!" badge. Opening one
  records its key (`date#n`, n = position among notes on that day) in
  localStorage `birthday.openedNotes`. That only drives the badge; it can't
  unlock anything early.
- Teaser only appears when tomorrow really has a note.
- A page left open past midnight unlocks the new note by itself (timer at
  midnight, plus a re-check on `visibilitychange` because phones pause
  background timers).
- `?preview=YYYY-MM-DD` renders the notes as of that day with a yellow
  banner, for Daniel to check notes ahead of time. Preview never records
  anything as opened. A bad value is ignored. Note that all future notes
  are readable in `content.js` by anyone who views source — inherent to
  a static site with no backend.
- Optional `photo` shows as a small print inside the note; a bad path shows
  "photo not found" (same rule as the gallery).
- Reduced motion: badge pulse, open animation and chevron turn are off.

Verified 2026-09-26 in headless Chrome (390x844, touch, America/Los_Angeles
timezone, faked clock, patched content.js served from the test harness):
44 checks, all pass. That covers the UTC-midnight trap, 11:59:50pm vs
12:00:30am, ordering, badges, persistence across reload, the midnight
rollover, preview, bad entries, duplicate dates, photo and broken photo,
the keyboard, and reduced motion.

Countdown redesign (2026-09-27):

- The biggest unit still left is a big Pacifico "hero" number with a line
  under it from `CONTENT.countdownHeroLabel` ('{unit} to go, mailob'; {unit}
  becomes day/days/hour/hours/...). All week it's days; on the last day the
  hero becomes hours, then minutes, then a big seconds count in the final
  minute. Only the smaller units show as blocks underneath (hours teal,
  minutes yellow, seconds mint; the hero keeps the old Days coral).
- Blocks are one row on phones (fixes Seconds sitting alone on its own row),
  dark text (#2d2d44) for contrast 6.9-10.7:1 (white was 1.3-1.9:1), no more
  constant wobble. Only a value that changed gets a 0.35s `.tick` pop
  (`setValue` in script.js). `.tick` is in the reduced-motion block.
- Heading is Pacifico. The empty countdown title (`title.countdown: ''`)
  collapses via `#title:empty`, so it leaves no gap.
- Verified in headless Chrome with a faked clock: 19 checks (every hero switch,
  singular/plural, blocks, contrast, tick, handoff to celebrate at zero).

Font note: `.note-message` now starts with 'Comic Sans MS' (Daniel's
choice). iPhones don't have Comic Sans, so on her phone it falls back to
Dancing Script. The Comic Neue Google Font would give the same look on every
device.

KNOWN ISSUE (Oct 1 only): in the celebration state the two `top: 130%` balloons
land on the daily-notes heading and a balloon string crosses the first
note. Fix alongside Sprint 3's poppable balloons.

Sprint 2 (memory gallery) as built:

- `CONTENT.memories` drives everything. Adding `{ photo, caption, date }` is
  the only step to add a card; `date` is optional and only orders the list.
- Order is oldest-first (a timeline); undated entries sort to the end. The
  `date` fields now match the dates written in the captions (2026-09-26).
- Horizontal scroll-snap strip of cards; each card is a `<button>`, so it is
  keyboard reachable and works with Enter/Space.
- Cards show the photo only (no text), styled as small photo prints: 8px
  white border, 4px radius. Keyboard focus is a teal outline, not a border
  colour, so the print border stays white.
- The lightbox shows the photo as a classic print that turns over (3D flip)
  on tap, Enter or Space. The caption is written on the back: `splitCaption`
  in `script.js` treats everything after the caption's LAST `\n` as the date,
  shown on its own line underneath, smaller. No `\n` means no date line.
  Always opens face up.
- The tap target is `#print-stage`, a `div role="button"`, deliberately not a
  `<button>`: Firefox wraps button contents in an anonymous box that flattens
  `preserve-3d`, which would show a mirrored front instead of the back. Also
  never put `overflow: hidden` on `.print` — iOS Safari flattens the flip.
- Lightbox closes on backdrop click, the close button, or Escape, locks body
  scroll while open, and returns focus to the card that opened it. On open,
  focus goes to the print so Enter/Space flips it immediately.
- Reduced motion: the flip is an instant swap (`.print` is in the
  reduced-motion block).
- Images are `loading="lazy"` + `decoding="async"`.
- The gallery is part of the birthday reveal: `initGallery()` runs from
  `celebrate()` (guarded to run once), never at page load. During the
  countdown the section is hidden and no memory photos are downloaded. If
  the page is open when the countdown hits zero, it appears then.
- Empty `memories` array hides the whole section.
- A photo path that fails to load flags the card `is-broken` and shows
  "photo not found", so a typo in `content.js` is visible rather than silent.
- `CONTENT.galleryHeading` holds the section title.

26 logic checks pass (rendering, ordering, empty case, lightbox open/close,
Esc, backdrop, focus return, broken paths).

2026-09-26: the flip-card lightbox was checked in real (headless) Chrome at
390x844 phone emulation with touch taps, at 1280x800 desktop, and with
reduced motion emulated — 32-33 checks each, all passing, screenshots
reviewed (layout fits on screen, back face matches front size, keyboard
path, focus return, no console errors).

STILL UNVERIFIED — the mobile check in the Sprint 2 list is still NOT ticked:
nothing has been tested on a real iPhone in Safari. iOS WebKit's 3D rendering
is the one thing headless Chrome can't vouch for, and the horizontal swipe
"feel" needs a real finger. Daniel needs to open it on his phone.

Two layout changes worth knowing about:

- `body` is now `flex-direction: column`. It had to be: the gallery is a
  second in-flow child and would otherwise sit beside the card rather than
  under it. With a single child the rendering is equivalent.
- The page is now taller, which may change where the two `top: 130%` balloons
  land relative to the fold once the countdown finishes. Balloons only show
  in the celebration state, so this needs a look in that state specifically.

Still open from Sprint 0: the `.confetti:nth-child(N)` off-by-two bug is
unfixed. (`CONTENT.targetDate` is back to 'October 1, 2026 00:00:00' and
live. If it's set to a past date for local testing, it must never be pushed
that way.)

Next: replace the 9/30 note and ship it (commit, merge to `main`, push,
confirm the Pages build), then Sprint 3 (poppable balloons + confetti cannon
button, and the balloon overlap above).
