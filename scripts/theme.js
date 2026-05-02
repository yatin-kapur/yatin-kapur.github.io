(function () {
    var STORAGE_KEY = 'theme';
    var DARK = 'dark';
    var LIGHT = 'light';

    var SUN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>';
    var MOON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function setStored(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
    }

    function getInitialTheme() {
        var stored = getStored();
        if (stored === DARK || stored === LIGHT) return stored;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return DARK;
        return LIGHT;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.setAttribute('aria-label', theme === DARK ? 'switch to light mode' : 'switch to dark mode');
            btn.setAttribute('title', theme === DARK ? 'switch to light mode' : 'switch to dark mode');
            btn.innerHTML = theme === DARK ? MOON_SVG : SUN_SVG;
        }
    }

    // Apply early to avoid flash of unstyled theme.
    applyTheme(getInitialTheme());

    function injectButton() {
        if (document.getElementById('theme-toggle')) return;
        var btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.type = 'button';
        btn.className = 'no-print';
        document.body.appendChild(btn);
        btn.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT;
            var next = current === DARK ? LIGHT : DARK;
            setStored(next);
            applyTheme(next);
        });
        applyTheme(document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButton);
    } else {
        injectButton();
    }

    // Track system changes only when user hasn't made an explicit choice.
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var listener = function (e) {
            if (getStored()) return;
            applyTheme(e.matches ? DARK : LIGHT);
        };
        if (mq.addEventListener) mq.addEventListener('change', listener);
        else if (mq.addListener) mq.addListener(listener);
    }
})();
