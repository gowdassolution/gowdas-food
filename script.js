/* GOWDA'S FOOD · interactions */
(function () {
  'use strict';

  /* ---- Grand opening (Oct 15, 2026, Knoxville time) ---- */
  // Days from today (America/New_York) to opening day; negative once open.
  var openingDays = (function () {
    var y, m, d, now = new Date();
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric'
      }).formatToParts(now);
      parts.forEach(function (p) {
        if (p.type === 'year') y = +p.value;
        if (p.type === 'month') m = +p.value;
        if (p.type === 'day') d = +p.value;
      });
    } catch (e) { y = now.getFullYear(); m = now.getMonth() + 1; d = now.getDate(); }
    return Math.round((Date.UTC(2026, 9, 15) - Date.UTC(y, m - 1, d)) / 864e5);
  })();
  // Celebrate up to and including Oct 31, then the site returns to normal.
  var celebrating = openingDays >= -16;
  var opening = document.getElementById('opening');
  var openingCount = document.getElementById('openingCount');
  if (opening && celebrating) {
    openingCount.textContent =
      openingDays > 1 ? openingDays + ' days to go' :
      openingDays === 1 ? 'Opening tomorrow!' :
      openingDays === 0 ? 'We open today!' : 'Now open!';
    opening.hidden = false;
  }

  /* ---- Loader ---- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    setTimeout(function () {
      if (loader) loader.classList.add('done');
      if (celebrating) startPetals();
    }, 700);
  });

  /* ---- Opening petal shower over the hero ---- */
  function startPetals() {
    var canvas = document.getElementById('petals');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // marigold, deep orange, gold, rose, cream, leaf green
    var colors = ['#f2a516', '#e8772e', '#e6b84c', '#f2d488', '#c8414b', '#f5ecdd', '#3f8f4a'];
    var count = Math.max(45, Math.min(110, Math.round(w / 8)));
    var petals = [];
    for (var i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * w,
        y: -20 - Math.random() * h * 0.6,       // staggered start above the hero
        r: 4 + Math.random() * 5,
        vy: 55 + Math.random() * 80,
        sway: 18 + Math.random() * 28,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 4,
        rot: Math.random() * Math.PI,
        color: colors[(Math.random() * colors.length) | 0],
        spark: Math.random() < 0.18
      });
    }

    var start = null, last = null;
    function frame(t) {
      if (start === null) { start = last = t; }
      var dt = Math.min((t - last) / 1000, 0.05); last = t;
      var age = (t - start) / 1000;
      var fade = age > 7 ? Math.max(0, 1 - (age - 7) / 1.2) : 1;
      ctx.clearRect(0, 0, w, h);
      var alive = 0;
      petals.forEach(function (p) {
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        if (p.y > h + 20) return;
        alive++;
        var x = p.x + Math.sin(age * 1.6 + p.phase) * p.sway;
        ctx.save();
        ctx.globalAlpha = 0.9 * fade;
        ctx.translate(x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.spark) {                           // little 4-point gold sparkle
          var s = p.r * 0.9;
          ctx.fillStyle = '#f2d488';
          ctx.moveTo(0, -s); ctx.lineTo(s * 0.25, -s * 0.25); ctx.lineTo(s, 0); ctx.lineTo(s * 0.25, s * 0.25);
          ctx.lineTo(0, s); ctx.lineTo(-s * 0.25, s * 0.25); ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.25, -s * 0.25);
        } else {                                 // petal that flutters (flips) as it falls
          var flip = Math.abs(Math.cos(age * 2.4 + p.phase));
          ctx.ellipse(0, 0, p.r * (0.35 + 0.65 * flip), p.r * 0.55, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      });
      if (alive && fade > 0) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }

  /* ---- Nav: scrolled state ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var setMenu = function (open) {
    links.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.classList.toggle('nav-open', open);
  };
  var closeMenu = function () { setMenu(false); };
  toggle.addEventListener('click', function () {
    setMenu(!links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) closeMenu();
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = Array.prototype.slice.call(el.parentElement.querySelectorAll('.reveal'));
          var i = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Menu category filter ---- */
  var menuFilter = document.getElementById('menuFilter');
  if (menuFilter) {
    var cats = document.querySelectorAll('.menu-cat');
    var catsWrap = document.querySelector('.menu-cats');
    var regNote = document.querySelector('.menu-reg');
    menuFilter.addEventListener('click', function (e) {
      var btn = e.target.closest('.menu-filter__btn');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      menuFilter.querySelectorAll('.menu-filter__btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      cats.forEach(function (cat) {
        cat.hidden = !(f === 'all' || cat.getAttribute('data-cat') === f);
      });
      if (regNote) regNote.hidden = (f === 'sunday');
      if (catsWrap) catsWrap.classList.toggle('is-single', f !== 'all');
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
