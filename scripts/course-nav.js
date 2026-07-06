// Course-page enhancements, desktop only (>=1240px):
//  1. a fixed left sidebar TOC cloned from the page's existing ul.toc,
//     with the in-view section highlighted while scrolling
//  2. a thin reading-progress bar across the top of the viewport
// No-ops on pages without a ul.toc (e.g. the hub), and stays hidden on
// narrow viewports. Include with:
//   <script src="/scripts/course-nav.js" defer></script>
(function () {
  function init() {
    var toc = document.querySelector('ul.toc');
    if (!toc) return;

    var style = document.createElement('style');
    style.textContent = [
      '#progress-bar, #side-toc { display: none; }',
      '@media (min-width: 1240px) {',
      '  #progress-bar { display: block; position: fixed; top: 0; left: 0; height: 3px; width: 0; background: #ff3333; z-index: 100; }',
      '  #side-toc { display: block; position: fixed; top: 4.5em; left: 1.5em; width: 13em; max-height: calc(100vh - 6em); overflow-y: auto; font-size: 0.85em; line-height: 1.5em; z-index: 10; }',
      '  #side-toc a { display: block; padding: 0.15em 0 0.15em 0.7em; border-left: 2px solid transparent; color: #888; text-decoration: none; text-transform: lowercase; }',
      '  #side-toc a:hover { color: #ff3333; }',
      '  #side-toc a.active { color: #ff3333; border-left-color: #ff3333; font-weight: 700; }',
      '  html[data-theme="dark"] #progress-bar { background: #ff5a5a; }',
      '  html[data-theme="dark"] #side-toc a { color: #9a9a9a; }',
      '  html[data-theme="dark"] #side-toc a:hover { color: #ff8080; }',
      '  html[data-theme="dark"] #side-toc a.active { color: #ff5a5a; border-left-color: #ff5a5a; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'progress-bar';
    document.body.appendChild(bar);

    var nav = document.createElement('nav');
    nav.id = 'side-toc';
    var links = [];
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent;
      nav.appendChild(link);
      links.push(link);
    });
    if (!links.length) return;
    document.body.appendChild(nav);

    var targets = links.map(function (l) {
      return document.getElementById(decodeURIComponent(l.getAttribute('href').slice(1)));
    });

    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

      var current = 0;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].getBoundingClientRect().top <= 120) current = i;
      }
      links.forEach(function (l, i) { l.classList.toggle('active', i === current); });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
