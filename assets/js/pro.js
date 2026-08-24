/* Professional surface behaviour: scroll reveal, bounded identity rotation, and
   the first-session Matrix discovery cue. No dependencies. Every effect here is
   additive — with this file absent the page is still complete and readable. */
(function () {
    'use strict';

    var html = document.documentElement;
    /* Retires the dead-man switch set inline in <head>. */
    html.setAttribute('data-pro-ready', '1');

    var reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- scroll reveal ---- */
    var revealable = document.querySelectorAll('.reveal');

    function revealAll() {
        for (var i = 0; i < revealable.length; i++) {
            revealable[i].classList.add('is-in');
        }
    }

    if (reduced || !('IntersectionObserver' in window)) {
        revealAll();
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                /* Reveal once. Scrolling back must not replay it. */
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });

        for (var j = 0; j < revealable.length; j++) {
            observer.observe(revealable[j]);
        }
    }

    /* ---- identity rotation ----
       Deliberately bounded. Text that rotates indefinitely is moving content
       under WCAG 2.2.2 and would need a pause control; four swaps terminate on
       their own and settle back on the first label. */
    var items = document.querySelectorAll('.ident-item');
    var MAX_SWAPS = 4;

    if (!reduced && items.length > 1) {
        var index = 0;
        var swaps = 0;
        var timer = window.setInterval(function () {
            items[index].classList.remove('is-active');
            index = (index + 1) % items.length;
            items[index].classList.add('is-active');
            if (++swaps >= MAX_SWAPS) window.clearInterval(timer);
        }, 5200);
    }

    /* ---- Matrix discovery cue ----
       Absolutely positioned, so showing and hiding it costs no layout. The link
       itself already carries the accessible name, and the footer states the
       alternate interface in prose, so the cue is visual-only. */
    var CUE_KEY = 'akaman.matrixCueSeen';
    var cue = document.getElementById('matrix-cue');

    function cueSeen() {
        try {
            return window.sessionStorage.getItem(CUE_KEY) === '1';
        } catch (e) {
            /* Storage can throw under strict privacy settings. Treat it as seen
               so a failure never turns into a cue on every page view. */
            return true;
        }
    }

    function markCueSeen() {
        try {
            window.sessionStorage.setItem(CUE_KEY, '1');
        } catch (e) { /* nothing to do */ }
    }

    if (cue && !cueSeen()) {
        window.setTimeout(function () {
            /* Marked on display, not on load: a visitor who leaves inside the
               first two seconds has not been shown the cue yet. */
            markCueSeen();
            cue.classList.add('is-shown');
            window.setTimeout(function () {
                cue.classList.remove('is-shown');
            }, 4500);
        }, 2000);
    }
})();
