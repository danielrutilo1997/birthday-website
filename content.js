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
    targetDate: 'September 20, 2026 18:56:00',

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
    /* Another wonderful year goes by that I got to spend with you mailob. I love you so very much! */
    // Heading above the memory gallery (Sprint 2).
    galleryHeading: 'Us, so far',

    huskyImage: 'assets/images/husky-removebg-preview.png',
    huskyAlt: 'White Husky with Heart',

    /* ---------------------------------------------------------------
       Sprint 1 — Daily reveals (structure not built yet)

       One entry per day you want to cover. Order does not matter;
       the site sorts them. An entry appears on its date and stays
       visible afterwards. `photo` is optional.
       --------------------------------------------------------------- */

    dailyReveals: [
        // PLACEHOLDER — Daniel wants these to start 2026-09-27.
        // Delete these and write one entry per day. Sprint 1 is not built
        // yet, so nothing reads this array on the site today.
        { date: '2026-09-27', message: 'PLACEHOLDER — day one.', photo: null },
        { date: '2026-09-28', message: 'PLACEHOLDER — day two.', photo: null },
        { date: '2026-09-29', message: 'PLACEHOLDER — day three.', photo: null },
        { date: '2026-09-30', message: 'PLACEHOLDER — day four.', photo: null }
    ],

    /* ---------------------------------------------------------------
       Sprint 2 — Memory gallery (structure not built yet)

       `date` is optional and only used for ordering.
       --------------------------------------------------------------- */

    memories: [
        // Sprint 2 reads this array. Add an entry and it appears in the
        // gallery — no other file needs touching.
        //
        //   photo   (required) path relative to index.html
        //   caption (required) shown under the card and in the lightbox
        //   date    (optional) 'YYYY-MM-DD', used only for ordering;
        //                      undated entries sort to the end
        //   focus   (optional) which part of the photo the card keeps when
        //                      it crops. Default is dead centre. Use
        //                      'center 30%' to keep more of the TOP,
        //                      'center 70%' to keep more of the BOTTOM.
        //                      Nudge in steps of 10% until it looks right.
        //                      Only affects the card; the lightbox always
        //                      shows the whole photo uncropped.
        //
        // These five are PLACEHOLDERS pointing at images already in the
        // repo, so you can see the layout. Replace them.
        {
            photo: 'assets/images/amazing.jpeg',
            caption: 'A year ago on your birthday.',
            date: '2024-06-12',
            focus: 'center 20%'
        },
        {
            photo: 'assets/images/goofball.jpg',
            caption: 'The day we met this goofball.',
            date: '2024-11-03',
            // This one is a portrait phone photo, so the card crops it a
            // lot. Raise the number to push the crop DOWN (keeps more of
            // the bottom), lower it to pull the crop UP.
            focus: 'center 30%'
        },
        {
            photo: 'assets/images/flower.png',
            caption: 'PLACEHOLDER — a caption long enough to show how wrapping behaves on a narrow phone screen.',
            date: '2025-03-01'
        },
        {
            photo: 'assets/images/lily.gif',
            caption: 'PLACEHOLDER — this one has no date, so it sorts last.',
            date: null
        },
        {
            photo: 'assets/images/husky-removebg-preview.png',
            caption: 'PLACEHOLDER — five cards is enough to test horizontal scrolling.',
            date: '2025-08-20'
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
