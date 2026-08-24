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

/* ---- command palette ----
   Cmd-K / Ctrl-K, keyboard only. This is a fourth Matrix entrance (header
   control, footer line, discovery cue, and this), which is why it belongs
   here at all: routing entry through a palette makes it feel earned rather
   than bolted on. Nothing on touch replaces it, deliberately, because there
   is no Cmd-K on a phone and the header/footer links already reach every
   destination in this list. */
(function () {
    'use strict';

    var ENTRIES = [
        { label: 'Selected systems', hint: 'section', href: '#projects' },
        { label: 'Capabilities', hint: 'section', href: '#capabilities' },
        { label: 'Experience', hint: 'section', href: '#experience' },
        { label: 'Contact', hint: 'section', href: '#contact' },
        { label: 'Open resume', hint: 'file', href: '/assets/files/Akbar_Resume.pdf' },
        { label: 'Copy email address', hint: 'copy', copy: 'akbaraman797@gmail.com' },
        { label: 'GitHub', hint: 'external', href: 'https://github.com/ak23bar' },
        { label: 'LinkedIn', hint: 'external', href: 'https://linkedin.com/in/akbar-aman-94b1b6263' },
        { label: 'Enter the matrix', hint: 'interface', href: '/matrix/', accent: true }
    ];

    var reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var backdrop, dialog, input, list;
    var isOpen = false;
    var restoreFocus = null;
    var visible = ENTRIES.slice();
    var activeIndex = 0;

    function optionId(i) { return 'cmdk-option-' + i; }

    /* Built once on load, hidden until the first open. `hidden` (not
       opacity) is what keeps it out of the tab order and the accessibility
       tree while closed. */
    function build() {
        backdrop = document.createElement('div');
        backdrop.className = 'cmdk-backdrop';
        backdrop.hidden = true;

        dialog = document.createElement('div');
        dialog.className = 'cmdk-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', 'Command palette');

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'cmdk-input mono';
        input.setAttribute('aria-label', 'Search commands');
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-expanded', 'true');
        input.setAttribute('aria-controls', 'cmdk-list');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('spellcheck', 'false');
        input.placeholder = 'jump, open, copy';

        list = document.createElement('div');
        list.id = 'cmdk-list';
        list.className = 'cmdk-list';
        list.setAttribute('role', 'listbox');

        dialog.appendChild(input);
        dialog.appendChild(list);
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);

        /* Only the target click on the backdrop itself (not a bubbled click
           from inside the dialog) closes the palette. */
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) close();
        });

        input.addEventListener('input', function () {
            filter(input.value);
        });
        input.addEventListener('keydown', onKeydown);
    }

    function render() {
        while (list.firstChild) list.removeChild(list.firstChild);
        visible.forEach(function (entry, i) {
            var option = document.createElement('div');
            option.id = optionId(i);
            option.className = 'cmdk-option' + (entry.accent ? ' cmdk-option--accent' : '');
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');

            var label = document.createElement('span');
            label.className = 'cmdk-option-label';
            label.textContent = entry.label;

            var hint = document.createElement('span');
            hint.className = 'cmdk-option-hint mono';
            hint.textContent = entry.hint;

            option.appendChild(label);
            option.appendChild(hint);
            option.addEventListener('click', function () { activate(entry, hint); });
            list.appendChild(option);
        });
        updateActiveDescendant();
    }

    function updateActiveDescendant() {
        if (!visible.length) {
            input.removeAttribute('aria-activedescendant');
            return;
        }
        input.setAttribute('aria-activedescendant', optionId(activeIndex));
    }

    function setActive(nextIndex) {
        var options = list.children;
        if (options[activeIndex]) options[activeIndex].setAttribute('aria-selected', 'false');
        activeIndex = nextIndex;
        if (options[activeIndex]) {
            options[activeIndex].setAttribute('aria-selected', 'true');
            options[activeIndex].scrollIntoView({ block: 'nearest' });
        }
        updateActiveDescendant();
    }

    function move(delta) {
        if (!visible.length) return;
        setActive((activeIndex + delta + visible.length) % visible.length);
    }

    function filter(query) {
        var q = query.toLowerCase();
        visible = ENTRIES.filter(function (entry) {
            return entry.label.toLowerCase().indexOf(q) !== -1;
        });
        activeIndex = 0;
        render();
    }

    function activate(entry, hintEl) {
        if (entry.copy) {
            copyToClipboard(entry.copy, hintEl);
            return;
        }
        close();
        if (entry.href.charAt(0) === '#') {
            var target = document.getElementById(entry.href.slice(1));
            if (target) {
                target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
            }
        } else {
            window.location.href = entry.href;
        }
    }

    function copyToClipboard(text, hintEl) {
        if (!(navigator.clipboard && navigator.clipboard.writeText)) {
            /* No API to verify success with: degrade by closing rather than
               claiming a copy that may not have happened. */
            close();
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            /* Confirm in place, same element, so nothing shifts layout. */
            if (hintEl) hintEl.textContent = 'copied';
            window.setTimeout(close, 550);
        }, function () {
            close();
        });
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            move(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            move(-1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            var entry = visible[activeIndex];
            if (!entry) return;
            var option = list.children[activeIndex];
            activate(entry, option && option.querySelector('.cmdk-option-hint'));
        } else if (e.key === 'Tab') {
            /* The input is the only focusable element in the dialog, so the
               trap is simply refusing to let Tab leave it. */
            e.preventDefault();
        }
    }

    function open() {
        if (isOpen) return;
        restoreFocus = document.activeElement;
        isOpen = true;
        backdrop.hidden = false;
        input.value = '';
        filter('');
        input.focus();
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        backdrop.hidden = true;
        if (restoreFocus && typeof restoreFocus.focus === 'function') {
            restoreFocus.focus();
        }
        restoreFocus = null;
    }

    build();

    document.addEventListener('keydown', function (e) {
        var isToggle = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
        if (!isToggle) return;
        e.preventDefault();
        if (isOpen) {
            close();
        } else {
            open();
        }
    });
})();
