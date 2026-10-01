/* ===================================================================
   script.js — behaviour only.

   Reads everything user-facing from CONTENT (content.js), which is
   loaded before this file. No personal text belongs in here.
   =================================================================== */

(function () {
    'use strict';

    var targetTime = new Date(CONTENT.targetDate).getTime();
    var tickHandle = null;

    /* --- static content injection ------------------------------------ */

    function applyContent() {
        document.getElementById('title').textContent = CONTENT.title.countdown;
        document.getElementById('countdown-heading').textContent = CONTENT.countdownHeading;
        document.getElementById('message').textContent = CONTENT.birthdayMessage;

        var husky = document.getElementById('husky-img');
        husky.src = CONTENT.huskyImage;
        husky.alt = CONTENT.huskyAlt;
    }

    /* --- the reveal -------------------------------------------------- */

    function celebrate() {
        document.getElementById('title').textContent = CONTENT.title.celebration;
        document.querySelector('.countdown-container').style.display = 'none';

        var message = document.querySelector('.message');
        message.style.display = 'block';
        message.classList.add('show');

        document.querySelector('.husky').style.display = 'block';

        // "A little something for today" no longer fits once the day has
        // come: the notes stay, their heading goes (see style.css).
        document.getElementById('daily').classList.add('is-birthday');

        initBalloons();
        // The cannon is a birthday thing: no button during the countdown.
        document.getElementById('cannon').hidden = false;
        celebrationBurst();

        document.querySelectorAll('.confetti').forEach(function (conf) {
            conf.style.display = 'block';
        });

        // The memories are part of the birthday reveal, so the gallery is
        // only built now. That also means none of its photos download
        // during the countdown.
        initGallery();
    }

    /* --- countdown --------------------------------------------------- */

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    // Biggest first; hours/minutes/seconds match the blocks in index.html.
    var UNITS = [
        { key: 'days', one: 'day', many: 'days' },
        { key: 'hours', one: 'hour', many: 'hours' },
        { key: 'minutes', one: 'minute', many: 'minutes' },
        { key: 'seconds', one: 'second', many: 'seconds' }
    ];
    var firstPaint = true;

    function unitName(unit, n) {
        return n === 1 ? unit.one : unit.many;
    }

    // Swap in a new value and give it a small pop, but only when it actually
    // changed, so the seconds tick while everything else sits still.
    function setValue(el, text) {
        if (el.textContent === text) { return; }
        el.textContent = text;
        if (firstPaint) { return; }
        el.classList.remove('tick');
        void el.offsetWidth; // restart the animation
        el.classList.add('tick');
    }

    function updateCountdown() {
        var difference = targetTime - new Date().getTime();

        if (difference < 0) {
            celebrate();
            // Nothing left to tick down; stop waking up every second.
            if (tickHandle !== null) {
                clearInterval(tickHandle);
                tickHandle = null;
            }
            return;
        }

        var values = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };

        // The biggest unit that isn't zero yet is the hero: "3 days to go"
        // all week, "5 hours to go" on the last day, a big seconds count in
        // the final minute. Only the units smaller than it tick underneath.
        var hero = 0;
        while (hero < UNITS.length - 1 && values[UNITS[hero].key] === 0) {
            hero += 1;
        }
        var heroValue = values[UNITS[hero].key];
        setValue(document.getElementById('hero-number'), String(heroValue));
        document.getElementById('hero-label').textContent =
            (CONTENT.countdownHeroLabel || '{unit} to go').replace('{unit}', unitName(UNITS[hero], heroValue));

        for (var i = 1; i < UNITS.length; i++) {
            var unit = UNITS[i];
            document.querySelector('.time-block[data-unit="' + unit.key + '"]').hidden = i <= hero;
            setValue(document.getElementById(unit.key), pad(values[unit.key]));
            document.getElementById(unit.key + '-label').textContent = unitName(unit, values[unit.key]);
        }
        document.getElementById('countdown-rest').hidden = hero === UNITS.length - 1;

        firstPaint = false;
    }

    /* --- daily notes (Sprint 1) ----------------------------------------

       Driven by CONTENT.dailyReveals. A note unlocks at midnight on its
       date by the device's own calendar, and stays unlocked. localStorage
       only remembers which notes she has opened, to drive the "new!"
       badge — clearing it cannot unlock anything early.
       ------------------------------------------------------------------ */

    var SEEN_KEY = 'birthday.openedNotes';

    // 'YYYY-MM-DD' for a Date, in the device's local time. Days are compared
    // as these strings throughout. Never turn one back into a Date with
    // new Date('YYYY-MM-DD'): that reads it as midnight UTC, which in
    // California is still the previous afternoon, so notes would unlock
    // hours early.
    function dayKey(date) {
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
    }

    function dateFromKey(key) {
        var parts = key.split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }

    // Accepts '2026-9-27' as well as '2026-09-27'. Returns '' for anything
    // that is not a real calendar day, e.g. '2026-09-31'.
    function normaliseDay(text) {
        var match = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/.exec(text || '');
        if (!match) { return ''; }
        var key = match[1] + '-' + pad(Number(match[2])) + '-' + pad(Number(match[3]));
        return dayKey(dateFromKey(key)) === key ? key : '';
    }

    function formatDay(key) {
        return dateFromKey(key).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
    }

    // ?preview=2026-09-29 shows the notes as they will look on that day, so
    // Daniel can check them ahead of time. Nothing is recorded as opened.
    function previewDay() {
        var value = new URLSearchParams(window.location.search).get('preview');
        return value ? normaliseDay(value) : '';
    }

    // Private browsing can make localStorage throw; the only cost is that
    // the "new!" badges come back on the next visit.
    function loadOpened() {
        try {
            var list = JSON.parse(window.localStorage.getItem(SEEN_KEY) || '[]');
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return [];
        }
    }

    function saveOpened(list) {
        try {
            window.localStorage.setItem(SEEN_KEY, JSON.stringify(list));
        } catch (e) { /* see loadOpened */ }
    }

    // Valid entries only, each with a normalised date and a stable key for
    // the opened list. The key counts duplicates within a day, so two notes
    // on the same date each keep their own badge.
    function readNotes() {
        var perDay = {};
        var notes = [];
        (CONTENT.dailyReveals || []).forEach(function (entry, index) {
            var day = entry && normaliseDay(entry.date);
            if (!day || !entry.message) {
                console.warn('Skipping daily note with a bad date or no message:', entry);
                return;
            }
            perDay[day] = (perDay[day] || 0) + 1;
            notes.push({
                day: day,
                key: day + '#' + perDay[day],
                index: index,
                message: entry.message,
                photo: entry.photo || '',
                video: entry.video || ''
            });
        });
        return notes;
    }

    function buildNote(note, isNew, onFirstOpen) {
        var item = document.createElement('article');
        item.className = 'note';

        var bodyId = 'note-' + note.key.replace('#', '-');

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'note-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', bodyId);

        var date = document.createElement('span');
        date.className = 'note-date';
        date.textContent = formatDay(note.day);
        toggle.appendChild(date);

        var badge = null;
        if (isNew) {
            badge = document.createElement('span');
            badge.className = 'note-badge';
            badge.textContent = 'new!';
            toggle.appendChild(badge);
        }

        var chevron = document.createElement('span');
        chevron.className = 'note-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        toggle.appendChild(chevron);

        var body = document.createElement('div');
        body.className = 'note-body';
        body.id = bodyId;
        body.hidden = true;

        var message = document.createElement('p');
        message.className = 'note-message';
        message.textContent = note.message;
        body.appendChild(message);

        if (note.photo) {
            var img = document.createElement('img');
            img.className = 'note-photo';
            img.loading = 'lazy';
            img.decoding = 'async';
            img.alt = '';
            img.src = note.photo;
            // Same rule as the gallery: a typo in content.js should be
            // visible, not a silently missing photo.
            img.addEventListener('error', function () {
                item.classList.add('is-broken');
            });
            body.appendChild(img);
        }

        var video = null;
        if (note.video) {
            video = document.createElement('video');
            video.className = 'note-video';
            video.controls = true;
            video.preload = 'metadata';
            // Without playsinline, iPhones jump to full screen on play.
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.addEventListener('error', function () {
                item.classList.add('is-broken-video');
            });
            body.appendChild(video);
        }

        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            body.hidden = !open;
            item.classList.toggle('is-open', open);
            if (video && open && !video.getAttribute('src')) {
                // Only on first open, so a sealed note downloads nothing.
                // #t=0.001 makes iOS Safari paint the first frame instead
                // of an empty box before she presses play.
                video.src = note.video + '#t=0.001';
            } else if (video && !open) {
                // A hidden video would carry on playing its sound.
                video.pause();
            }
            if (open && badge) {
                badge.remove();
                badge = null;
                onFirstOpen(note);
            }
        });

        item.appendChild(toggle);
        item.appendChild(body);
        return item;
    }

    function renderDailyNotes(today, preview) {
        var section = document.getElementById('daily');
        var list = document.getElementById('daily-list');
        var hint = document.getElementById('daily-hint');
        var teaser = document.getElementById('daily-teaser');
        var banner = document.getElementById('daily-preview');

        var notes = readNotes();
        var opened = loadOpened();

        // Newest first; notes sharing a day keep their content.js order.
        var unlocked = notes
            .filter(function (note) { return note.day <= today; })
            .sort(function (a, b) {
                if (a.day !== b.day) { return a.day < b.day ? 1 : -1; }
                return a.index - b.index;
            });

        banner.hidden = !preview;
        if (preview) {
            banner.textContent = 'Preview of ' + formatDay(preview) +
                (unlocked.length ? '' : ' — no notes unlocked yet, so she sees no section at all') +
                '. Remove ?preview from the address to go back.';
        }

        // Empty case: hide the section rather than show an empty box. A
        // preview still shows its banner so an empty day is not a mystery.
        if (unlocked.length === 0 && !preview) {
            section.hidden = true;
            return;
        }

        document.getElementById('daily-heading').textContent = CONTENT.dailyHeading || '';

        var unopenedCount = 0;
        function syncHint() {
            hint.hidden = unopenedCount === 0;
        }

        function markOpened(note) {
            unopenedCount -= 1;
            syncHint();
            if (!preview && opened.indexOf(note.key) === -1) {
                opened.push(note.key);
                saveOpened(opened);
            }
        }

        list.textContent = '';
        unlocked.forEach(function (note) {
            var isNew = opened.indexOf(note.key) === -1;
            if (isNew) { unopenedCount += 1; }
            list.appendChild(buildNote(note, isNew, markOpened));
        });
        syncHint();

        // Only promise "tomorrow" when there really is a note for tomorrow.
        var t = dateFromKey(today);
        var tomorrow = dayKey(new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1));
        var hasTomorrow = notes.some(function (note) { return note.day === tomorrow; });
        teaser.textContent = CONTENT.dailyTeaser || '';
        teaser.hidden = !(hasTomorrow && CONTENT.dailyTeaser);

        section.hidden = false;
    }

    function initDailyNotes() {
        var preview = previewDay();
        if (preview) {
            renderDailyNotes(preview, preview);
            return;
        }

        var shownDay = dayKey(new Date());
        renderDailyNotes(shownDay, '');

        // If the page is left open past midnight, unlock the new note without
        // needing a reload. Phones pause timers in background tabs, so also
        // re-check whenever the page comes back into view.
        function recheck() {
            var now = dayKey(new Date());
            if (now !== shownDay) {
                shownDay = now;
                renderDailyNotes(shownDay, '');
            }
        }

        function scheduleMidnight() {
            var now = new Date();
            var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            setTimeout(function () {
                recheck();
                scheduleMidnight();
            }, midnight.getTime() - now.getTime() + 1000);
        }

        scheduleMidnight();
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) { recheck(); }
        });
    }

    /* --- memory gallery (Sprint 2) -------------------------------------

       Everything here is driven by CONTENT.memories. Adding an entry there
       is the only step needed to add a card.
       ------------------------------------------------------------------ */

    // Oldest first, so it reads as a timeline. Entries without a date have
    // no place in that order, so they go to the end in their original order.
    function sortMemories(list) {
        return list
            .map(function (item, index) { return { item: item, index: index }; })
            .sort(function (a, b) {
                var da = a.item.date ? Date.parse(a.item.date) : NaN;
                var db = b.item.date ? Date.parse(b.item.date) : NaN;
                var aBad = isNaN(da);
                var bBad = isNaN(db);
                if (aBad && bBad) { return a.index - b.index; }
                if (aBad) { return 1; }
                if (bBad) { return -1; }
                if (da !== db) { return da - db; }
                return a.index - b.index;
            })
            .map(function (entry) { return entry.item; });
    }

    function buildCard(memory, onOpen) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'memory-card';

        var img = document.createElement('img');
        img.className = 'memory-card-photo';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = memory.photo;
        // Optional framing. Cards crop with `object-fit: cover`, which keeps
        // the middle of the photo. Phone photos often put the subject off
        // centre, so `focus` moves the crop without touching CSS.
        if (memory.focus) {
            img.style.objectPosition = memory.focus;
        }
        // The caption is only shown on the back of the print in the lightbox,
        // but it still describes the photo, so reuse it rather than leaving
        // alt empty.
        img.alt = memory.caption || '';
        img.addEventListener('error', function () {
            card.classList.add('is-broken');
        });

        card.appendChild(img);

        card.addEventListener('click', function () { onOpen(memory, card); });
        return card;
    }

    var galleryBuilt = false;

    // Called from celebrate(), never at page load.
    function initGallery() {
        if (galleryBuilt) { return; }
        galleryBuilt = true;

        var section = document.getElementById('gallery');
        var memories = sortMemories((CONTENT.memories || []).filter(function (m) {
            return m && m.photo;
        }));

        // Empty case: hide the whole section rather than show an empty box.
        if (memories.length === 0) {
            section.hidden = true;
            return;
        }

        document.getElementById('gallery-heading').textContent = CONTENT.galleryHeading || '';

        var scroller = document.getElementById('gallery-scroll');
        var lightbox = setupLightbox();

        memories.forEach(function (memory) {
            scroller.appendChild(buildCard(memory, lightbox.open));
        });

        section.hidden = false;

        // The swipe hint is noise once everything already fits on screen.
        var hint = document.getElementById('gallery-hint');
        function syncHint() {
            hint.hidden = scroller.scrollWidth <= scroller.clientWidth + 1;
        }
        syncHint();
        window.addEventListener('resize', syncHint);
    }

    /* --- lightbox ------------------------------------------------------ */

    // Captions are written as 'text\ndate'. The last line is the date, shown
    // smaller underneath on the back of the print. No newline means no date.
    function splitCaption(text) {
        text = text || '';
        var cut = text.lastIndexOf('\n');
        if (cut === -1) {
            return { note: text.trim(), date: '' };
        }
        return {
            note: text.slice(0, cut).trim(),
            date: text.slice(cut + 1).trim()
        };
    }

    function setupLightbox() {
        var box = document.getElementById('lightbox');
        var img = document.getElementById('lightbox-img');
        var note = document.getElementById('lightbox-caption');
        var date = document.getElementById('lightbox-date');
        var stage = document.getElementById('print-stage');
        var print = document.getElementById('print');
        var closeBtn = document.getElementById('lightbox-close');
        var lastFocused = null;

        function setFlipped(flipped) {
            print.classList.toggle('is-flipped', flipped);
            stage.setAttribute('aria-pressed', flipped ? 'true' : 'false');
        }

        function flip() {
            setFlipped(!print.classList.contains('is-flipped'));
        }

        function open(memory, sourceCard) {
            lastFocused = sourceCard || null;
            var parts = splitCaption(memory.caption);
            img.src = memory.photo;
            img.alt = memory.caption || '';
            note.textContent = parts.note;
            date.textContent = parts.date;
            date.hidden = parts.date === '';
            setFlipped(false);
            box.hidden = false;
            document.body.classList.add('lightbox-open');
            // Focus the print itself so Enter/Space turns it over straight away.
            stage.focus();
        }

        function close() {
            box.hidden = true;
            document.body.classList.remove('lightbox-open');
            // Reset while hidden, so the next photo opens face up without
            // visibly spinning back.
            setFlipped(false);
            // Drop the source so a large image is not held in memory.
            img.src = '';
            if (lastFocused) {
                lastFocused.focus();
                lastFocused = null;
            }
        }

        closeBtn.addEventListener('click', close);

        stage.addEventListener('click', flip);
        stage.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                // Space would otherwise scroll the page behind.
                event.preventDefault();
                flip();
            }
        });

        // Backdrop only — clicks on the photo or caption should not close.
        box.addEventListener('click', function (event) {
            if (event.target === box) { close(); }
        });

        document.addEventListener('keydown', function (event) {
            if (!box.hidden && (event.key === 'Escape' || event.key === 'Esc')) {
                close();
            }
        });

        return { open: open, close: close };
    }

    /* --- poppable balloons (Sprint 3) ------------------------------------

       Driven by CONTENT.balloonMessages. Tapping a balloon pops it and
       leaves one of the messages where it was. The balloon grows back a
       little later, so she can keep going until she has read them all.
       ------------------------------------------------------------------ */

    var NOTE_EDGE = 12;       // px kept between a message and the screen edge
    var REFILL_DELAY = 2500;  // ms from a message leaving to its balloon returning

    // Real messages only. Anything still marked PLACEHOLDER is left out, so
    // an unfinished content.js can never put that word in front of her.
    function readBalloonMessages() {
        return (CONTENT.balloonMessages || []).filter(function (text) {
            if (typeof text !== 'string' || text.trim() === '') { return false; }
            if (/^\s*PLACEHOLDER/.test(text)) {
                console.warn('Skipping placeholder balloon message:', text);
                return false;
            }
            return true;
        });
    }

    // Deals every message once, in a random order, before any repeats.
    function makeDeck(messages) {
        var pile = [];
        var last = null;
        return function () {
            if (pile.length === 0) {
                pile = messages.slice();
                for (var i = pile.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var swap = pile[i];
                    pile[i] = pile[j];
                    pile[j] = swap;
                }
                // Don't open a new round with the one she has just read.
                if (pile.length > 1 && pile[pile.length - 1] === last) {
                    pile.unshift(pile.pop());
                }
            }
            last = pile.pop();
            return last;
        };
    }

    var balloonsReady = false;

    // Called from celebrate(): balloons only exist on the birthday screen.
    function initBalloons() {
        if (balloonsReady) { return; }
        balloonsReady = true;

        var balloons = document.querySelectorAll('.balloon');
        balloons.forEach(function (balloon) {
            balloon.style.display = 'block';
        });

        // No messages yet: the balloons stay as decoration, nothing to tap.
        var messages = readBalloonMessages();
        if (messages.length === 0) {
            balloons.forEach(function (balloon) {
                balloon.disabled = true;
                balloon.setAttribute('aria-hidden', 'true');
            });
            return;
        }

        var nextMessage = makeDeck(messages);
        var live = document.getElementById('balloon-live');
        var openNote = null; // the message on screen, if any

        // A few dots flying outwards from where the balloon was.
        function burst(x, y, colour) {
            var box = document.createElement('div');
            box.className = 'balloon-burst';
            box.style.left = x + 'px';
            box.style.top = y + 'px';
            for (var i = 0; i < 8; i++) {
                var angle = (i + Math.random() * 0.6) * Math.PI / 4;
                var reach = 38 + Math.random() * 22;
                var dot = document.createElement('i');
                dot.style.background = colour;
                dot.style.setProperty('--dx', Math.round(Math.cos(angle) * reach) + 'px');
                dot.style.setProperty('--dy', Math.round(Math.sin(angle) * reach) + 'px');
                box.appendChild(dot);
            }
            document.body.appendChild(box);
            setTimeout(function () { box.remove(); }, 600);
        }

        function closeNote() {
            if (!openNote) { return; }
            var note = openNote;
            openNote = null;
            clearTimeout(note.timer);
            note.el.classList.add('is-leaving');
            setTimeout(function () { note.el.remove(); }, 300);
            note.onGone();
        }

        // One message at a time: two side by side would overlap on a phone.
        function showNote(text, x, y, colour, onGone) {
            closeNote();

            var el = document.createElement('p');
            el.className = 'balloon-note';
            el.textContent = text;
            el.style.borderColor = colour;
            document.body.appendChild(el);

            // Centred on the balloon, then pulled in from the screen edge.
            var width = el.offsetWidth;
            var maxLeft = document.documentElement.clientWidth - width - NOTE_EDGE;
            el.style.left = Math.max(NOTE_EDGE, Math.min(x - width / 2, maxLeft)) + 'px';
            el.style.top = (y - el.offsetHeight / 2) + 'px';

            // She can tap it away; otherwise it stays long enough to read.
            el.addEventListener('click', closeNote);
            openNote = {
                el: el,
                onGone: onGone,
                timer: setTimeout(closeNote, Math.min(9000, 3500 + text.length * 60))
            };
            live.textContent = text;
        }

        function refill(balloon) {
            // Tiny with the transition off, then let it grow back.
            balloon.classList.add('is-empty');
            balloon.classList.remove('is-popped');
            void balloon.offsetWidth;
            balloon.classList.remove('is-empty');
            balloon.disabled = false;
        }

        function pop(balloon) {
            // Where it is right now, mid-float, in page coordinates.
            var box = balloon.getBoundingClientRect();
            var x = box.left + box.width / 2 + window.scrollX;
            var y = box.top + box.height / 2 + window.scrollY;
            var colour = window.getComputedStyle(balloon).backgroundColor;

            // Disabled while it is gone, so the keyboard can't pop thin air.
            balloon.disabled = true;
            balloon.classList.add('is-popped');
            burst(x, y, colour);
            showNote(nextMessage(), x, y, colour, function () {
                setTimeout(function () { refill(balloon); }, REFILL_DELAY);
            });
        }

        balloons.forEach(function (balloon) {
            balloon.addEventListener('click', function () { pop(balloon); });
        });
        document.getElementById('balloon-hint').hidden = false;
    }

    /* --- confetti cannon (Sprint 3) --------------------------------------

       A button she can press whenever she likes once the birthday screen
       is up; the same confetti also goes off by itself as it appears. Every piece is
       drawn on one canvas laid over the screen, and the loop only runs
       while something is in the air.
       ------------------------------------------------------------------ */

    var CONFETTI_COLOURS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#667eea', '#ff8e53'];
    var MAX_PIECES = 400; // however fast she taps

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    var cannonCanvas = null;
    var cannonCtx = null;
    var cannonFrame = null;
    var cannonLast = 0;
    var pieces = [];

    function sizeCannonCanvas() {
        // Capped at 2x: sharp enough, and under half the pixels of a 3x phone.
        var ratio = Math.min(window.devicePixelRatio || 1, 2);
        cannonCanvas.width = Math.round(cannonCanvas.clientWidth * ratio);
        cannonCanvas.height = Math.round(cannonCanvas.clientHeight * ratio);
        cannonCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawConfetti(now) {
        // Counted in 60ths of a second, so the arc is the same on a 120Hz
        // screen, and capped so a paused tab doesn't fling everything away.
        var step = Math.min((now - cannonLast) / (1000 / 60), 3);
        cannonLast = now;

        var floor = cannonCanvas.clientHeight + 20;
        var drag = Math.pow(0.985, step);
        cannonCtx.clearRect(0, 0, cannonCanvas.clientWidth, cannonCanvas.clientHeight);

        pieces = pieces.filter(function (piece) {
            piece.vx *= drag;
            piece.vy = piece.vy * drag + 0.25 * step; // gravity
            piece.x += piece.vx * step;
            piece.y += piece.vy * step;
            piece.turn += piece.spin * step;
            piece.flip += piece.flutter * step;
            piece.age += step;
            if (piece.y > floor || piece.age > 420) { return false; }

            cannonCtx.save();
            cannonCtx.translate(piece.x, piece.y);
            cannonCtx.rotate(piece.turn);
            // Squashing it back and forth reads as paper tumbling.
            cannonCtx.scale(1, Math.cos(piece.flip));
            cannonCtx.fillStyle = piece.colour;
            cannonCtx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
            cannonCtx.restore();
            return true;
        });

        if (pieces.length > 0) {
            cannonFrame = window.requestAnimationFrame(drawConfetti);
        } else {
            cannonFrame = null;
            cannonCanvas.hidden = true;
        }
    }

    // Throws `count` pieces from (x, y) on the screen towards `angle`, in
    // radians (straight up is -PI / 2).
    function fireConfetti(x, y, angle, count) {
        if (reducedMotion.matches) { return; }

        if (!cannonCanvas) {
            cannonCanvas = document.getElementById('cannon-canvas');
            cannonCtx = cannonCanvas.getContext('2d');
            window.addEventListener('resize', function () {
                if (cannonFrame !== null) { sizeCannonCanvas(); }
            });
        }
        if (cannonFrame === null) {
            cannonCanvas.hidden = false;
            sizeCannonCanvas();
        }

        // Harder on a taller screen, so it always climbs most of the way up.
        var power = Math.sqrt(cannonCanvas.clientHeight / 800);
        count = Math.min(count, MAX_PIECES - pieces.length);
        for (var i = 0; i < count; i++) {
            var aim = angle + (Math.random() - 0.5) * 1.1;
            var speed = (10 + Math.random() * 17) * power;
            pieces.push({
                x: x,
                y: y,
                vx: Math.cos(aim) * speed,
                vy: Math.sin(aim) * speed,
                w: 6 + Math.random() * 5,
                h: 4 + Math.random() * 4,
                colour: CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)],
                turn: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.4,
                flip: Math.random() * Math.PI * 2,
                flutter: 0.1 + Math.random() * 0.2,
                age: 0
            });
        }

        if (cannonFrame === null && pieces.length > 0) {
            cannonLast = window.performance.now();
            cannonFrame = window.requestAnimationFrame(drawConfetti);
        }
    }

    // Aimed at the top middle of the screen from wherever it starts.
    function aimAtTop(x, y) {
        return Math.atan2(window.innerHeight * 0.15 - y, window.innerWidth / 2 - x);
    }

    // One from each bottom corner as the birthday screen appears.
    function celebrationBurst() {
        var bottom = window.innerHeight;
        [0, window.innerWidth].forEach(function (x) {
            fireConfetti(x, bottom, aimAtTop(x, bottom), 70);
        });
    }

    function initCannon() {
        var button = document.getElementById('cannon');
        button.addEventListener('click', function () {
            var box = button.getBoundingClientRect();
            var x = box.left + box.width / 2;
            var y = box.top + box.height / 2;
            fireConfetti(x, y, aimAtTop(x, y), 80);

            button.classList.remove('is-firing');
            void button.offsetWidth; // restart the kick
            button.classList.add('is-firing');
        });
    }

    /* --- tap the husky --------------------------------------------------- */

    var HEARTS = ['❤️', '💕', '💖', '💗'];

    function initHusky() {
        var husky = document.getElementById('husky');

        function pet() {
            husky.classList.remove('is-happy');
            void husky.offsetWidth; // restart the wiggle
            husky.classList.add('is-happy');

            // Scattered around its head, in page coordinates.
            var box = husky.getBoundingClientRect();
            for (var i = 0; i < 6; i++) {
                var heart = document.createElement('span');
                heart.className = 'husky-heart';
                heart.setAttribute('aria-hidden', 'true');
                heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
                heart.style.left = (box.left + window.scrollX + box.width * (0.2 + Math.random() * 0.5)) + 'px';
                heart.style.top = (box.top + window.scrollY + box.height * (0.05 + Math.random() * 0.3)) + 'px';
                heart.style.fontSize = Math.round(16 + Math.random() * 14) + 'px';
                heart.style.setProperty('--dx', Math.round((Math.random() - 0.5) * 90) + 'px');
                heart.style.setProperty('--dy', Math.round(-80 - Math.random() * 70) + 'px');
                heart.style.animationDelay = (i * 70) + 'ms';
                document.body.appendChild(heart);
                removeLater(heart, 1300 + i * 70);
            }
        }

        husky.addEventListener('click', pet);
        husky.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                // Space would otherwise scroll the page.
                event.preventDefault();
                pet();
            }
        });
    }

    function removeLater(el, ms) {
        setTimeout(function () { el.remove(); }, ms);
    }

    /* --- falling petals (Sprint 4) ---------------------------------------

       Only scatters them; style.css does the falling. One petal per slice
       of the screen's width, so they never bunch up on one side.
       ------------------------------------------------------------------ */

    function initPetals() {
        var layer = document.getElementById('petals');
        var count = Math.max(12, Math.min(24, Math.round(window.innerWidth / 55)));

        for (var i = 0; i < count; i++) {
            var fall = 9 + Math.random() * 8;
            var petal = document.createElement('span');
            petal.className = 'petal';
            petal.style.setProperty('--x', ((i + Math.random()) / count * 100).toFixed(1) + '%');
            petal.style.setProperty('--size', Math.round(10 + Math.random() * 8) + 'px');
            petal.style.setProperty('--fall', fall.toFixed(1) + 's');
            // Negative, so each is already part-way down when the page opens.
            petal.style.setProperty('--delay', (-Math.random() * fall).toFixed(1) + 's');
            petal.style.setProperty('--sway', Math.round(15 + Math.random() * 35) + 'px');
            petal.style.setProperty('--sway-time', (2.5 + Math.random() * 2.5).toFixed(1) + 's');
            layer.appendChild(petal);
        }
    }

    /* --- boot -------------------------------------------------------- */

    applyContent();
    initDailyNotes();
    initCannon();
    initHusky();
    initPetals();

    // ?preview on or after the birthday shows the birthday screen, so Daniel
    // can check the gallery and balloons without touching targetDate.
    var preview = previewDay();
    if (preview && preview >= dayKey(new Date(targetTime))) {
        celebrate();
    } else {
        // No initGallery() here: celebrate() builds it once the countdown ends.
        updateCountdown();
        if (tickHandle === null && targetTime - new Date().getTime() >= 0) {
            tickHandle = setInterval(updateCountdown, 1000);
        }
    }
}());
