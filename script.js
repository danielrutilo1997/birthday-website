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

        document.querySelectorAll('.balloon').forEach(function (balloon) {
            balloon.style.display = 'block';
        });

        document.querySelectorAll('.confetti').forEach(function (conf) {
            conf.style.display = 'block';
        });
    }

    /* --- countdown --------------------------------------------------- */

    function pad(n) {
        return String(n).padStart(2, '0');
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

        var days = Math.floor(difference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = pad(days);
        document.getElementById('hours').textContent = pad(hours);
        document.getElementById('minutes').textContent = pad(minutes);
        document.getElementById('seconds').textContent = pad(seconds);
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
        // The caption already describes the photo, so reuse it rather than
        // leaving alt empty.
        img.alt = memory.caption || '';
        img.addEventListener('error', function () {
            card.classList.add('is-broken');
        });

        var caption = document.createElement('figcaption');
        caption.className = 'memory-card-caption';
        caption.textContent = memory.caption || '';

        var figure = document.createElement('figure');
        figure.appendChild(img);
        figure.appendChild(caption);
        card.appendChild(figure);

        card.addEventListener('click', function () { onOpen(memory, card); });
        return card;
    }

    function initGallery() {
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

    function setupLightbox() {
        var box = document.getElementById('lightbox');
        var img = document.getElementById('lightbox-img');
        var caption = document.getElementById('lightbox-caption');
        var closeBtn = document.getElementById('lightbox-close');
        var lastFocused = null;

        function open(memory, sourceCard) {
            lastFocused = sourceCard || null;
            img.src = memory.photo;
            img.alt = memory.caption || '';
            caption.textContent = memory.caption || '';
            box.hidden = false;
            document.body.classList.add('lightbox-open');
            closeBtn.focus();
        }

        function close() {
            box.hidden = true;
            document.body.classList.remove('lightbox-open');
            // Drop the source so a large image is not held in memory.
            img.src = '';
            if (lastFocused) {
                lastFocused.focus();
                lastFocused = null;
            }
        }

        closeBtn.addEventListener('click', close);

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
    /* --- boot -------------------------------------------------------- */

    applyContent();
    initGallery();
    updateCountdown();
    if (tickHandle === null && targetTime - new Date().getTime() >= 0) {
        tickHandle = setInterval(updateCountdown, 1000);
    }
}());
