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

    /* --- boot -------------------------------------------------------- */

    applyContent();
    updateCountdown();
    if (tickHandle === null && targetTime - new Date().getTime() >= 0) {
        tickHandle = setInterval(updateCountdown, 1000);
    }
}());
