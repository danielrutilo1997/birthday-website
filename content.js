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
    // Don't change this to test the birthday screen: add
    // ?preview=2026-10-01 to the end of the address instead.
    targetDate: 'October 1, 2026 00:00:00',

    // Heading above the countdown clock.
    countdownHeading: "Time until Casandra's special day!",

    // The line under the big countdown number. {unit} becomes "days",
    // "day", "hours", "hour", ... to match the number, e.g.
    // "3 days to go, mailob" or, on the last day, "5 hours to go, mailob".
    countdownHeroLabel: '{unit} to go!',

    title: {
        // The big title at the top of the card. Blank during the
        // countdown (it takes up no space when empty). Put something
        // here if you'd rather she sees a title while counting down.
        countdown: '',
        celebration: 'Happy Birthday mailob!'
    },

    // The big reveal message. Shown when the countdown hits zero.
    /* 2025
    birthdayMessage: "On this day, an amazing, beautiful and wonderful girl was born. I hope this year brings you everything you've ever 
    wanted because you deserve it. Here's to making so many more wonderful memories with you Casandra! I love you!", */

    /* 2026 
    Another wonderful year goes by that I got to spend with you Casandra. Everyday I wake up and look forward to exchanging a good morning text with you. 
    I enjoy car pooling with you to work when our schedules align and getting Boiling Point on the least expected days. I enjoy eating breakfast with you, 
    going for a swim together (thank you for teaching me how to swim), and then taking Luna for a walk. Those are cherished days that I will always hold
    dear. You are my partner, mailob and my best friend. I love you so very much! Here's to another year of making more memories. I hope you have a 
    wonderful day today and look forward to seeing you later.
    */

    birthdayMessage: "Another wonderful year goes by that I got to spend with you Casandra. Everyday I wake up and look forward to exchanging a good morning text with you." + 
    " I enjoy car pooling with you to work when our schedules align and getting Boiling Point on the least expected days. I enjoy eating breakfast with you, " +
    "going for a swim together (thank you for teaching me how to swim), and then taking Luna for a walk. Those are cherished days that I will always hold" + 
    " dear. You are my partner, mailob and my best friend. I love you so very much! Here's to another year of making more memories. I hope you have a " +
    "wonderful day today and look forward to seeing you later.",
    
    // Heading above the memory gallery (Sprint 2).
    galleryHeading: 'A few memories from this past year.',

    huskyImage: 'assets/images/husky-removebg-preview.png',
    huskyAlt: 'White Husky with Heart',

    /* ---------------------------------------------------------------
       Sprint 1 — Daily notes (live)

       One entry per day. Order does not matter; the site shows them
       newest first. A note unlocks at midnight on its date — by the
       clock on HER phone — and stays visible afterwards. Each one
       arrives sealed with a "new!" badge until she taps it open.

       Once the countdown finishes, the notes are still there on the
       birthday screen, but the heading above them is not shown.

         date    (required) 'YYYY-MM-DD'
         message (required) the note. Use \n to start a new line.
         photo   (optional) path relative to index.html, e.g.
                            'assets/images/beach.jpeg'. Leave as null
                            for no photo. A .gif works here too.
         video   (optional) an .mp4 in assets/video/, e.g.
                            video: 'assets/video/wednesday.mp4'
                            She taps play; it plays inside the note,
                            with sound. Keep it short (under ~30MB).

       To check a note before its day, open the site with
       ?preview=2026-09-29 on the end of the address. That shows
       exactly what she'll see that day.
       --------------------------------------------------------------- */

    // Heading above the notes.
    dailyHeading: 'A little something for today',

    // Shown under the notes, only when tomorrow has a note waiting.
    // Set to '' to never show it.
    dailyTeaser: 'Come back tomorrow for another one...',

    dailyReveals: [
        // !!! PLACEHOLDERS — THESE GO LIVE ON THEIR DATES !!!
        // Replace every message below with the real one (or delete the
        // entry) before it reaches its date, or she will see the word
        // PLACEHOLDER.
        { date: '2026-09-27', message: "Its the first day of your birthday week mailob! I look forward to your special day which is 4 days away. I hope this week is filled with lots of love and fun. I love you so much! Happy early birthday!", photo: 'assets/images/gettyvilla.jpeg' },
        { date: '2026-09-28', message: "5 things I love about you: Your work ethic is unmatched. You are very sweet. You are passionate about what you do. You are kind to others. You are an amazing partner. Happy Monday, I love you very much mailob!", photo: 'assets/images/beautiful.jpeg' },
        { date: '2026-09-29', message: "It is now Tuesday!!! I get to spend today with you even though we have to work first. I love you very much and I want you to know that we'll be eating some delicious food tonight! (; I'm so excited to be celebrating your birthday soon mailob!", photo: 'assets/images/sanfran.jpeg' },
        { date: '2026-09-30', message: "This is my favorite video because the most awe-strucking part of the video is you in the middle. For how can these jellyfish be brighter than the sun?", photo: null, video: 'assets/video/mbaquarium.mp4' }
    ],

    /* ---------------------------------------------------------------
       Sprint 2 — Memory gallery (live)

       `date` is optional and only used for ordering.
       --------------------------------------------------------------- */

    memories: [
        // Sprint 2 reads this array. Add an entry and it appears in the
        // gallery — no other file needs touching. The gallery only shows on
        // the birthday; add ?preview=2026-10-01 to the address to see it now.
        //
        //   photo   (required) path relative to index.html
        //   caption (required) written on the BACK of the photo — she taps
        //                      the photo to turn it over and read it. Put
        //                      the date on its own last line after \n and
        //                      it is shown underneath, a little smaller:
        //                        'Our first trip.\nMay 3rd, 2025'
        //   date    (optional) 'YYYY-MM-DD', used only for ordering;
        //                      undated entries sort to the end. Keep it in
        //                      step with the date in the caption.
        //   focus   (optional) which part of the photo the card keeps when
        //                      it crops. Default is dead centre. Use
        //                      'center 30%' to keep more of the TOP,
        //                      'center 70%' to keep more of the BOTTOM.
        //                      Nudge in steps of 10% until it looks right.
        //                      Only affects the card; the lightbox always
        //                      shows the whole photo uncropped.
        {
            photo: 'assets/images/amazing.jpeg',
            caption: 'A year ago on your birthday.\nOctober 1st, 2025',
            date: '2025-10-01',
            focus: 'center 20%'
        },
        {
            photo: 'assets/images/usinthecar.jpeg',
            caption: 'Us after your birthday breakfast.\nOctober 1st, 2025',
            date: '2025-10-01',
            // This one is a portrait phone photo, so the card crops it a
            // lot. Raise the number to push the crop DOWN (keeps more of
            // the bottom), lower it to pull the crop UP.
            focus: 'center 30%'
        },
        {
            photo: 'assets/images/friends.jpeg',
            caption: 'Spending time with amazing friends together.\nJune 25th, 2026',
            date: '2026-06-25'
        },
        {
            photo: 'assets/images/laguna.jpeg',
            caption: 'Taking pictures with you. \nAugust 17th, 2026',
            date: '2025-12-19'
        },
        {
            photo: 'assets/images/us.jpeg',
            caption: 'Sitting on a bench together in Carmel by the Sea.\nJuly 17th, 2026',
            date: '2026-07-17'
        }
    ],

    /* ---------------------------------------------------------------
       Sprint 3 — Poppable balloons

       On the birthday screen she can tap a balloon to pop it. Each
       pop shows one of these, picked at random; she sees every one
       once before any repeats, and the balloons grow back so she can
       keep going. Add as many as you like.

       Keep them short: a few words or an emoji. A long sentence still
       fits, it just makes a tall bubble on a phone. \n starts a new
       line.

       Anything still starting with PLACEHOLDER is skipped, so she can
       never see one. With no real messages here the balloons are
       plain decoration and don't pop.

       To try them before the day, add ?preview=2026-10-01 to the end
       of the address.
       --------------------------------------------------------------- */

    balloonMessages: [
        // PLACEHOLDER
        'Happy Birthday!',
        'Life is too short, but I will live for you.',
        'I love you!',
        'But I really want pasta.',
        'ooglie booglie',
        'tu no me embarazas',
        'te amo mucho mailob',
        'One free bacio di latte',
        'Popped by a beautiful girl'
    ]
};
