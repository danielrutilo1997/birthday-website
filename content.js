/* ===================================================================
   content.js — the only file Daniel edits.

   Every piece of personal content (names, messages, photos, captions)
   lives here. Nothing in index.html, style.css or script.js should
   contain personal text. If you find yourself editing those three to
   change wording or swap a photo, something belongs here instead.

   No build step: this is a plain script tag, so it must stay valid
   ES5-ish JS. Mind your commas.

   Entries marked PLACEHOLDER are safe to overwrite wholesale.
   =================================================================== */

const CONTENT = {

    /* ---------------------------------------------------------------
       Core countdown (Sprint 0 — live)
       --------------------------------------------------------------- */

    // Parsed with new Date(). Keep this exact format.
    targetDate: 'October 1, 2026 00:00:00',

    // Heading above the countdown clock.
    countdownHeading: "Time until Casandra's special day!",

    title: {
        // NOTE: today the <h1> is blank until the countdown finishes.
        // That is the existing behaviour, preserved as-is. Put something
        // here if you'd rather she sees a heading while counting down.
        countdown: '',
        celebration: 'Happy Birthday mailob!'
    },

    // The big reveal message. Shown when the countdown hits zero.
    birthdayMessage: "On this day, an amazing, beautiful and wonderful girl was born. I hope this year brings you everything you've ever wanted because you deserve it. Here's to making so many more wonderful memories with you Casandra! I love you!",

    huskyImage: 'assets/images/husky-removebg-preview.png',
    huskyAlt: 'White Husky with Heart',

    /* ---------------------------------------------------------------
       Sprint 1 — Daily reveals (structure not built yet)

       One entry per day you want to cover. Order does not matter;
       the site sorts them. An entry appears on its date and stays
       visible afterwards. `photo` is optional.
       --------------------------------------------------------------- */

    dailyReveals: [
        // PLACEHOLDER — delete these three and write your own.
        {
            date: '2026-09-20',
            message: 'PLACEHOLDER — first daily note goes here.',
            photo: null
        },
        {
            date: '2026-09-21',
            message: 'PLACEHOLDER — second daily note. This one has a photo.',
            photo: 'assets/images/husky.jpg'
        },
        {
            date: '2026-09-22',
            message: 'PLACEHOLDER — third daily note.',
            photo: null
        }
    ],

    /* ---------------------------------------------------------------
       Sprint 2 — Memory gallery (structure not built yet)

       `date` is optional and only used for ordering.
       --------------------------------------------------------------- */

    memories: [
        // PLACEHOLDER
        {
            photo: 'assets/images/husky.jpg',
            caption: 'PLACEHOLDER — caption for this photo.',
            date: '2025-03-01'
        }
    ],

    /* ---------------------------------------------------------------
       Sprint 3 — Poppable balloons (structure not built yet)

       Short strings or emoji. One is picked per balloon popped.
       --------------------------------------------------------------- */

    balloonMessages: [
        // PLACEHOLDER
        'PLACEHOLDER — a short sweet line.',
        'PLACEHOLDER — another one.',
        'PLACEHOLDER — and one more.'
    ]
};
